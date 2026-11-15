const fs = require('node:fs/promises');
const path = require('node:path');
const { setTimeout: pause } = require('node:timers/promises');
const { SafariPage } = require('./safari-webdriver.cjs');

const api = 'https://api.eu-central-1.saucelabs.com';
const hub = 'https://ondemand.eu-central-1.saucelabs.com/wd/hub';
const tunnelName = 'hw03-task3';
const groups = { shared: 'S', dashboard: 'D', categories: 'C', coupons: 'P' };
const groupFor = (id) => Object.keys(groups).find((name) => id.startsWith(groups[name] + '-'));
const headings = { Dashboard: 'Dashboard', 'Danh mục': 'Quản lý Danh mục', 'Mã Giảm Giá': 'Quản lý Mã Giảm Giá' };
const evidenceReview = require('./safari-evidence-review.json');
const localTime = () => new Date(Date.now() + 7 * 3600000).toISOString().replace('Z', '+07:00');
class ObservationFailed extends Error {}
class ObservationBlocked extends Error {}

async function selectedCases(definitions, options, directory) {
  const group = options.find((value) => value.startsWith('--group='))?.split('=')[1];
  const explicit = options.filter((value) => !value.startsWith('--'));
  if ((group && !(group in groups)) || (group && explicit.length) || explicit.some((id) => !definitions[id]) ||
    options.some((value) => value.startsWith('--') && !['--retry-blocked', '--webdriver-local'].includes(value) && !value.startsWith('--group='))) {
    throw Error('Dùng safari [--group=shared|dashboard|categories|coupons] hoặc safari ID..., có thể thêm --retry-blocked.');
  }
  const ids = Object.keys(definitions).filter((id) => id !== 'S-05');
  if (explicit.includes('S-05')) throw Error('S-05 cần xác minh zoom gốc 200% trong phiên Safari Live. Xem human_verification.md.');
  if (explicit.length) return ids.filter((id) => explicit.includes(id));
  const completed = new Map();
  for (const file of (await fs.readdir(directory)).filter((name) => /^safari-apple-.*\.json$/.test(name)).sort()) {
    const log = JSON.parse(await fs.readFile(path.join(directory, file), 'utf8'));
    if (evidenceReview.excludedRuns[log.metadata.runId]) continue;
    for (const result of log.results) {
      if (result.status === 'Blocked' && /Phiên Sauce đã kết thúc|session.*(?:deleted|invalid|closed|expired)/i.test(result.actual)) continue;
      if (!['Passed', 'Failed'].includes(completed.get(result.id))) completed.set(result.id, result.status);
    }
  }
  const pending = ids.filter((id) => {
    const value = completed.get(id);
    return !value || value === 'Not Run' || (value === 'Blocked' && options.includes('--retry-blocked'));
  });
  const ordered = Object.keys(groups).flatMap((name) => pending.filter((id) => groupFor(id) === name));
  return group ? ordered.filter((id) => groupFor(id) === group) : ordered;
}

async function openDriver(metadata, local, origin, secrets) {
  const { Builder } = require('selenium-webdriver');
  if (local) {
    const { Options } = require('selenium-webdriver/chrome');
    const options = new Options().addArguments('--headless=new', '--window-size=1440,900', '--no-proxy-server')
      .set('unhandledPromptBehavior', 'ignore');
    return new Builder().disableEnvironmentOverrides().forBrowser('chrome').setChromeOptions(options).build();
  }
  const { username, accessKey, auth } = secrets;
  if (!username || !accessKey) throw Error('Thiếu SAUCE_USERNAME/SAUCE_ACCESS_KEY trong PowerShell chạy suite.');
  const response = await fetch(`${api}/rest/v1/${encodeURIComponent(username)}/tunnels?full=true`, {
    headers: { Authorization: `Basic ${auth}` }, redirect: 'error', signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw Error(`API kiểm tunnel trả HTTP ${response.status}.`);
  const tunnels = await response.json();
  if (!tunnels.some((tunnel) => tunnel.tunnel_identifier === tunnelName && tunnel.is_ready === true)) throw Error('Tunnel hw03-task3 chưa Ready.');
  const { throughSauceProxy } = require('./sauce-smoke.cjs');
  for (const url of [origin + '/', origin + '/api/categories']) {
    const check = await throughSauceProxy(url);
    if (check.status !== 200) throw Error(`Proxy Sauce trả HTTP ${check.status} cho ${url}.`);
  }
  metadata.tunnel = { region: 'eu-central', name: tunnelName, preflight: 'HTML và /api/categories qua proxy Sauce HTTP 200' };
  const endpoint = new URL(hub);
  endpoint.username = username;
  endpoint.password = accessKey;
  return new Builder().disableEnvironmentOverrides().usingServer(endpoint.href).withCapabilities({
    browserName: 'safari', browserVersion: '18', platformName: 'macOS 14', unhandledPromptBehavior: 'ignore',
    'sauce:options': { tunnelName, name: `EShop HW03 Safari ${metadata.group} ${metadata.runId}`, public: 'private',
      recordVideo: true, recordScreenshots: false, recordLogs: false, captureHtml: false, commandTimeout: 45,
      idleTimeout: 45, maxDuration: 540 },
  }).build();
}

async function suite({ metadata, results, save, options, definitions, cases, sandbox, fixtures, temporarilyEmpty,
  identity, email, password, baseURL, subset, taskDir, setPage, expect, request }) {
  const local = options.includes('--webdriver-local');
  const origin = local ? metadata.localFrontend : metadata.frontend;
  const ids = await selectedCases(definitions, options, __dirname);
  if (!ids.length) { console.log('Nhóm đã chọn không còn ca tự động cần chạy.'); return; }
  metadata.group = [...new Set(ids.map(groupFor))].join(', ');
  metadata.requested = ids;
  metadata.infrastructureEvidence = 'automation/sauce-smoke-HW03-MWG5L5L2.json';
  const username = process.env.SAUCE_USERNAME;
  const accessKey = process.env.SAUCE_ACCESS_KEY;
  const auth = Buffer.from(`${username}:${accessKey}`).toString('base64');
  let token;
  const sanitize = (error) => [username, accessKey, auth, password, token].filter(Boolean)
    .reduce((message, secret) => message.replaceAll(secret, '[redacted]').replaceAll(encodeURIComponent(secret), '[redacted]'),
      String(error.message || error).replace(/\x1b\[[0-9;]*m/g, '')).replace(/https?:\/\/[^/\s]*@/gi, '[authenticated endpoint]').slice(0, 1200);
  let driver;
  let initialViewport;
  try {
    const started = Date.now();
    driver = await openDriver(metadata, local, origin, { username, accessKey, auth });
    const capabilities = await driver.getCapabilities();
    const browser = capabilities.get('browserName');
    const version = capabilities.get('browserVersion');
    const platform = capabilities.get('platformName');
    const osVersion = capabilities.get('safari:platformVersion') || capabilities.get('platformVersion') || '';
    if (!local && (!/^safari$/i.test(browser || '') || !/mac/i.test(platform || '') || !osVersion)) throw Error('WebDriver không xác nhận phiên Safari/macOS.');
    metadata.browser = `${browser} ${version}`;
    metadata.os = local ? platform : `macOS ${osVersion}`;
    metadata.device = local ? 'Windows diagnostic' : 'Sauce Labs desktop VM, EU Central';
    metadata.jobId = local ? null : (await driver.getSession()).getId();
    metadata.sessionSetupMs = Date.now() - started;
    await save();
    await driver.manage().setTimeouts({ pageLoad: 14000, script: 7500 });
    await driver.get(origin);
    const loginPage = new SafariPage(driver, origin);
    const { By, Key } = require('selenium-webdriver');
    await loginPage.getByRole('heading', { name: 'Admin Login', exact: true }).waitFor();
    await driver.findElement(By.css('input[placeholder="Email"]')).sendKeys(email);
    await driver.findElement(By.css('input[type="password"]')).sendKeys(password, Key.ENTER);
    await loginPage.getByRole('heading', { name: 'Dashboard', exact: true, level: 2 }).waitFor();
    token = await loginPage.evaluate(() => localStorage.getItem('adminToken'));
    if (!token) throw Error('Đăng nhập không tạo phiên Admin.');
    await loginPage.measureViewport();
    initialViewport = loginPage.viewportSize();
    metadata.viewport = `${initialViewport.width} × ${initialViewport.height}`;
    metadata.locale = await loginPage.evaluate(() => navigator.language);
    if (!local) metadata.keyboard = 'W3C WebDriver sends Tab without modifier; Safari VM keyboard-navigation preference was not changed.';
    const baseline = fixtures(sandbox);
    const apiContext = await request.newContext({ baseURL, extraHTTPHeaders: { Authorization: `Bearer ${token}` } });
    try {
      for (const id of ids) {
        if (!local && Date.now() - started > 430000) { metadata.interrupted = 'Dừng trước giới hạn phiên. Chạy lại nhóm để tiếp tục.'; break; }
        const definition = definitions[id];
        const page = new SafariPage(driver, origin);
        setPage(page);
        page.size = initialViewport;
        const record = { id, screen: definition.screen, ia: definition.ia, platform: metadata.platform, group: groupFor(id),
          category: definition.category, preconditions: definition.preconditions, testData: definition.testData, issue: definition.issue,
          timestamp: localTime(), browser: metadata.browser, os: metadata.os, jobId: metadata.jobId,
          expected: definition.expected, status: 'Blocked', steps: [], actual: '', notes: '', evidence: '' };
        let candidate;
        const open = async (name) => {
          record.steps.push(`Mở ${name}.`);
          await page.locator('li').filter({ hasText: new RegExp(`^${name}$`) }).click();
          await page.getByRole('heading', { name: headings[name], exact: true, level: 2 }).waitFor();
        };
        const refresh = async () => {
          const received = page.waitForResponse((response) => response.url().endsWith('/api/coupons') && response.request().method() === 'GET' && response.ok(), { timeout: 16000 });
          await page.reload();
          await received;
          await page.getByRole('heading', { name: 'Dashboard', exact: true, level: 2 }).waitFor();
        };
        const capture = async () => {
          await page.readAlert();
          const label = [...identity, metadata.browser, metadata.os, origin, id, metadata.jobId && `Sauce ${metadata.jobId}`].filter(Boolean).join(' | ');
          await page.evaluate((text) => {
            const marker = document.createElement('div');
            marker.dataset.hw03Capture = '';
            marker.setAttribute('aria-hidden', 'true');
            marker.style.cssText = 'position:fixed;bottom:0;left:0;right:0;pointer-events:none;z-index:2147483647;background:#14263d;color:#fff;font:12px Arial;padding:4px;overflow-wrap:anywhere';
            marker.textContent = text;
            document.body.append(marker);
          }, label);
          try { return Buffer.from(await driver.takeScreenshot(), 'base64'); }
          finally { await page.evaluate(() => document.querySelector('[data-hw03-capture]')?.remove()); }
        };
        try {
          fixtures(sandbox, baseline);
          record.steps.push('Khôi phục fixture Task 1/3 và tải lại Dashboard qua Safari.');
          if (['S-06', 'D-04'].includes(id)) record.steps.push('Đo viewport CSS thực bằng WebDriver trước khi chấm.');
          if (!local && ['S-08', 'S-09', 'S-10', 'C-22', 'P-16', 'P-18'].includes(id)) {
            record.steps.push('Phím Tab do WebDriver gửi ở cấu hình bàn phím của phiên Sauce.');
          }
          await refresh();
          const safariExpect = { poll: (read, options) => expect.poll(async () => {
            await page.readAlert();
            return read();
          }, options) };
          const t = { page, api: apiContext, tag: `${metadata.runId}-${id}`, dialogs: page.dialogs, expect: safariExpect, open, refresh,
            chooseDialog: (value) => { page.dialogAction = value; },
            note: (text) => record.steps.push(text),
            check: (condition, text) => { if (!condition) throw new ObservationFailed(text); },
            block: (text) => { throw new ObservationBlocked(text); },
            capture: async () => { candidate = await capture(); }, emptyList: (table, body) => temporarilyEmpty(sandbox, table, body),
          };
          record.actual = await cases[id](t);
          if (!record.actual?.trim()) throw Error('Ca không trả quan sát.');
          record.status = 'Passed';
        } catch (error) {
          record.actual = sanitize(error);
          record.status = error instanceof ObservationFailed ? 'Failed' : 'Blocked';
          if (record.status === 'Blocked') record.notes = error instanceof ObservationBlocked ? 'Thiếu tiền điều kiện đã quan sát.' : 'Gián đoạn WebDriver hoặc bộ kiểm.';
          if (/NoSuchSession|InvalidSession/i.test(error.name)) metadata.interrupted = 'Phiên Sauce đã kết thúc.';
        }
        if (page.framed) record.steps.push('Cửa sổ desktop giới hạn kích thước tối thiểu. Dùng iframe cùng origin và xác minh innerWidth/innerHeight trong Safari, không giả lập thiết bị.');
        if (['C-16', 'C-20'].includes(id) && record.status !== 'Blocked' && !page.dialogs.some(({ message }) => /network error|lỗi mạng|mất kết nối/i.test(message))) {
          record.status = 'Blocked';
          record.notes = 'Chưa xác minh Safari nhận lỗi kết nối do proxy ngắt socket. Cần đối chiếu phản hồi qua tunnel.';
        }
        if (['S-11', 'S-12', 'C-16', 'C-20'].includes(id) && page.diagnostics.some((item) => item.effect)) {
          record.steps.push('Proxy sandbox chuyển đúng request sang cổng bị trình duyệt chặn. Đối chiếu thông báo GUI và xác nhận request không đến backend.');
        }
        try {
          candidate = (record.status !== 'Passed' ? candidate : null) ?? await capture();
          if (candidate.subarray(1, 4).toString() !== 'PNG') throw Error('Không nhận ảnh PNG từ WebDriver.');
          record.evidence = `${subset}/${id}.png`;
          await fs.writeFile(path.join(taskDir, record.evidence), candidate, { flag: 'wx' });
          metadata.identityOverlay = true;
        } catch (error) {
          record.evidence = '';
          record.status = 'Blocked';
          record.notes = `Chưa lưu được ảnh WebDriver: ${sanitize(error)}`;
        }
        record.dialogs = page.dialogs.map((dialog) => ({ ...dialog, message: sanitize(dialog.message) }));
        record.diagnostics = page.diagnostics;
        page.closeCase();
        setPage(null);
        results.push(record);
        await save();
        console.log(`${id} ${record.status} · ${record.actual}`);
        if (page.framed) {
          await driver.switchTo().defaultContent();
          await driver.get(origin);
          page.framed = false;
        }
        if (metadata.interrupted) break;
        if (['S-06', 'D-04'].includes(id)) await page.setViewportSize(initialViewport).catch(() => {});
        await pause(30);
      }
    } finally { await apiContext.dispose(); }
  } catch (error) {
    throw Error(sanitize(error));
  } finally {
    setPage(null);
    if (driver) {
      try { await driver.quit(); metadata.sessionClosed = true; } catch { metadata.sessionClosed = false; }
    }
  }
}

module.exports = { suite };
