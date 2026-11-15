const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const net = require('node:net');
const { spawn, execFileSync } = require('node:child_process');
const { randomBytes } = require('node:crypto');
const { pathToFileURL } = require('node:url');
const { DatabaseSync } = require('node:sqlite');
const { chromium, firefox, request, expect } = require('playwright/test');
const { version: playwrightVersion } = require('playwright/package.json');

const repo = path.resolve(__dirname, '../../..');
const sutCommit = '8f3059fbec0512cc8f04972afe6ca20411a98471';
const baseURL = 'http://localhost:3000';
const email = 'admin@eshop.com';
const review = require('./cases.json');
const inherited = '../../task1/automation/';
const cases = { ...require(inherited + 'shared-categories.cjs'), ...require(inherited + 'coupon-dashboard.cjs'), ...require('./platform-cases.cjs') };
const [engine, ...arguments_] = process.argv.slice(2);
const headed = arguments_.includes('--headed');
const proofOnly = arguments_.includes('--proof');
const windowsProof = arguments_.includes('--windows-proof');
const sauceSmoke = engine === 'sauce-smoke';
const safari = engine === 'safari';
const safariLive = engine === 'safari-live';
const cloud = safari || sauceSmoke || safariLive;
const serve = arguments_.includes('--serve') || cloud;
const adminPort = cloud ? 8080 : 5174;
const adminURL = `http://localhost:${adminPort}`;
const sauceURL = `http://localtest.me:${adminPort}`;
const requested = new Set(arguments_.filter((arg) => !['--headed', '--proof', '--windows-proof', '--serve'].includes(arg)));
const platform = sauceSmoke ? 'sauce-smoke' : safari ? arguments_.includes('--webdriver-local') ? 'webdriver-local' : 'safari-apple' : engine + '-windows';
const identity = ['HW03_STUDENT_NAME', 'HW03_STUDENT_ID', 'HW03_STUDENT_EMAIL'].map((key) => process.env[key]);
const official = identity.every(Boolean);
const device = process.env.HW03_TEST_DEVICE || 'Máy Windows cục bộ';
const taskDir = path.resolve(__dirname, '..');
const localTime = () => new Date(Date.now() + 7 * 3600000).toISOString().replace('Z', '+07:00');
const couponsRead = (r) => r.url() === baseURL + '/api/coupons' && r.request().method() === 'GET' && r.ok();
const heading = { Dashboard: 'Dashboard', 'Danh mục': 'Quản lý Danh mục', 'Mã Giảm Giá': 'Quản lý Mã Giảm Giá' };
const tag = 'HW03-' + Date.now().toString(36).toUpperCase();
let secret;
const fixtureTables = ['categories', 'coupons', 'orders', 'coupon_usage'];

class CheckFailed extends Error {}
class Blocked extends Error {}

async function assertFree(port) {
  const listener = net.createServer();
  await new Promise((resolve, reject) => {
    listener.once('error', reject);
    listener.listen(port, '127.0.0.1', () => listener.close(resolve));
  });
}

function start(args, options) {
  const child = spawn(process.execPath, args, { ...options, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  child.logs = [];
  for (const stream of [child.stdout, child.stderr]) {
    stream.setEncoding('utf8').on('data', (chunk) => child.logs.push(chunk.trim()));
  }
  child.on('error', (error) => child.logs.push(error.message));
  return child;
}

async function stop(child) {
  if (child && child.exitCode === null && child.signalCode === null) {
    await new Promise((resolve) => {
      child.once('exit', resolve);
      if (!child.kill()) resolve();
    });
  }
}

async function ready(url, child) {
  await expect.poll(async () => {
    try {
      if (child && child.exitCode !== null) return 'process exited: ' + child.logs.join(' ');
      return (await fetch(url, { signal: AbortSignal.timeout(1000) })).status;
    } catch (error) {
      return [error.cause?.message || error.message, ...(child?.logs.slice(-3) ?? [])].join(' | ');
    }
  }, { timeout: 15000, message: url }).toBe(200);
}

async function temporarilyEmpty(sandbox, table, body) {
  if (!['categories', 'coupons'].includes(table)) throw new Error('Invalid fixture table');
  const db = new DatabaseSync(path.join(sandbox, 'database.sqlite'));
  try {
    const rows = db.prepare('SELECT * FROM ' + table).all();
    db.exec('DELETE FROM ' + table);
    try {
      return await body();
    } finally {
      if (rows.length) {
        const keys = Object.keys(rows[0]);
        const insert = db.prepare(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`);
        db.exec('BEGIN');
        try {
          for (const row of rows) insert.run(...keys.map((key) => row[key]));
          db.exec('COMMIT');
        } catch (error) {
          db.exec('ROLLBACK');
          throw error;
        }
      }
    }
  } finally {
    db.close();
  }
}

function fixtures(sandbox, baseline) {
  const db = new DatabaseSync(path.join(sandbox, 'database.sqlite'));
  try {
    if (!baseline) {
      return Object.fromEntries(fixtureTables.map((table) => [table, db.prepare('SELECT * FROM ' + table).all()]));
    }
    db.exec('BEGIN');
    try {
      for (const table of fixtureTables) {
        db.exec('DELETE FROM ' + table);
        for (const row of baseline[table]) {
          const keys = Object.keys(row);
          const insert = db.prepare(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`);
          insert.run(...keys.map((key) => row[key]));
        }
      }
      db.exec('COMMIT');
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
  } finally {
    db.close();
  }
}

async function login(page) {
  await page.goto(adminURL);
  await page.getByPlaceholder('Email', { exact: true }).fill(email);
  await page.getByPlaceholder('Password', { exact: true }).fill(secret);
  await page.getByPlaceholder('Password', { exact: true }).press('Enter');
  // Confirm the login and fetchData sequence through the UI instead of browser network notifications.
  await page.getByRole('heading', { name: 'Dashboard', exact: true }).waitFor();
  await page.locator('li').filter({ hasText: /^Mã Giảm Giá$/ }).click();
  await page.getByRole('cell', { name: 'SAVE10', exact: true }).waitFor();
  await page.locator('li').filter({ hasText: /^Dashboard$/ }).click();
  const token = await page.evaluate(() => localStorage.getItem('adminToken'));
  if (!token) throw Error('Giao diện Admin mở nhưng phiên đăng nhập không có token.');
  return token;
}

async function execute(browser, sandbox, id, definition, subset) {
  const reference = id === 'S-05' ? 'task3/automation/run.cjs#checkZoom' :
    ['S-06','C-15','C-22'].includes(id) ? 'task3/automation/platform-cases.cjs' :
      'task1/automation/' + (id.startsWith('C-') || id.startsWith('S-') ? 'shared-categories.cjs' : 'coupon-dashboard.cjs');
  const result = {
    id, screen: definition.screen, ia: definition.ia, platform, preconditions: definition.preconditions, testData: definition.testData, issue: definition.issue, category: definition.category, status: 'Not Run', timestamp: '',
    expected: definition.expected, steps: [], actual: '', notes: '', evidence: '', reference: '',
  };
  if (!cases[id] && !(id === 'S-05' && windowsProof)) {
    result.notes = 'Cần dùng zoom thật 200% từ giao diện trình duyệt và quan sát các điều khiển sau cuộn.';
    return result;
  }
  result.reference = `${reference}#${id}`;
  result.timestamp = localTime();
  const context = await browser.newContext({ viewport: id === 'S-05' ? null : { width: 1440, height: 900 }, locale: 'vi-VN', ignoreHTTPSErrors: false });
  let api, capture;
  let dialogAction = 'dismiss';
  const page = await context.newPage();
  page.setDefaultTimeout(5500);
  await installEvidenceOverlay(page, browser.version());
  const diagnostics = trackDiagnostics(page);
  const dialogs = [];
  page.on('dialog', (dialog) => {
    dialogs.push({ type: dialog.type(), message: dialog.message() });
    const action = dialogAction;
    dialogAction = 'dismiss';
    dialog[action]().catch(() => {});
  });
  const takeScreenshot = async () => {
    if (id === 'S-05') return fs.readFile(await captureWindow(page, subset, 'S-05-window.png'));
    if (official) await page.locator('[data-hw03-evidence]').waitFor({ state: 'visible' });
    return page.screenshot({ timeout: 5000, animations: 'disabled' });
  };
  try {
    const token = await login(page);
    result.steps.push('Đăng nhập GUI Admin bằng Enter và kiểm dữ liệu coupon mẫu hiện trên màn.');
    api = await request.newContext({ baseURL, extraHTTPHeaders: { Authorization: 'Bearer ' + token } });
    const t = {
      page, api, tag: tag + '-' + id, dialogs, expect,
      chooseDialog: (action) => {
        if (!['accept', 'dismiss'].includes(action)) throw new Error('Invalid dialog action');
        dialogAction = action;
      },
      open: async (name) => {
        result.steps.push('Mở menu ' + name + '.');
        await page.locator('li').filter({ hasText: new RegExp('^' + name + '$') }).click();
        await page.getByRole('heading', { name: heading[name], exact: true }).waitFor();
      },
      refresh: async () => {
        result.steps.push('Tải lại Web Admin và chờ GET /api/coupons thành công.');
        await Promise.all([page.waitForResponse(couponsRead), page.reload()]);
        await page.getByRole('heading', { name: 'Dashboard', exact: true }).waitFor();
      },
      note: (note) => result.steps.push(note),
      check: (condition, failure) => {
        if (!condition) throw new CheckFailed(failure);
      },
      block: (reason) => { throw new Blocked(reason); },
      capture: async () => { capture = await takeScreenshot(); },
      emptyList: (table, body) => temporarilyEmpty(sandbox, table, body),
    };
    result.actual = id === 'S-05' ? await checkZoom(t, subset, result) : await cases[id](t);
    if (!result.actual?.trim()) throw new Error('Missing observed result');
    result.status = 'Passed';
  } catch (error) {
    result.actual = error.message.replace(/\x1b\[[0-9;]*m/g, '');
    if (error instanceof CheckFailed) {
      try {
        const png = capture ?? await takeScreenshot();
        const relative = `${subset}/${id}.png`;
        await fs.writeFile(path.join(taskDir, relative), png);
        result.status = 'Failed';
        result.evidence = relative;
      } catch (screenshotError) {
        result.status = 'Blocked';
        result.notes = 'Quan sát sai lệch nhưng không lưu được ảnh: ' + screenshotError.message;
      }
    } else {
      result.status = 'Blocked';
      result.notes = error instanceof Blocked ? 'Thiếu tiền điều kiện kiểm thử.' : 'Gián đoạn kỹ thuật hoặc bộ kiểm thử; cần chẩn đoán.';
    }
  } finally {
    if (dialogs.length) result.dialogs = dialogs;
    if (diagnostics.length) result.diagnostics = diagnostics;
    await api?.dispose();
    await context.close();
  }
  return result;
}

async function captureWindow(page, folder, name, zoom = false) {
  const title = `Task 3 ${tag}`;
  await page.evaluate((label) => { document.title = label; }, title);
  await page.bringToFront();
  const filename = path.join(taskDir, folder, name);
  const args = ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(__dirname, 'capture-window.ps1'),
    '-WindowTitle', title, '-BrowserProcess', engine, '-OutputPath', filename];
  if (zoom) args.push(zoom === 'step' ? '-ZoomStep' : '-Zoom');
  execFileSync('powershell.exe', args, { windowsHide: true, timeout: 15000 });
  return filename;
}

async function checkZoom(t, folder, result) {
  const before = await t.page.evaluate(() => devicePixelRatio);
  await captureWindow(t.page, folder, 'unused.png', true);
  const measure = () => t.page.evaluate(() => ({ ratio: devicePixelRatio, width: innerWidth, height: innerHeight }));
  let after = await measure();
  const lower = engine === 'firefox' ? 1.90 : 1.98;
  for (let i = 0; i < 4 && after.ratio / before < lower; i++) {
    await captureWindow(t.page, folder, 'unused.png', 'step');
    after = await measure();
  }
  if (engine === 'firefox') await captureWindow(t.page, folder, 'S-05-zoom-indicator.png');
  if (after.ratio / before < lower || after.ratio / before > 2.02) t.block(`Không xác minh được zoom gốc 200% qua DPR. DPR ${before} → ${after.ratio}.`);
  t.note(`Dùng phím zoom của trình duyệt: DPR ${before} → ${after.ratio}; viewport ${after.width} × ${after.height}.`);
  for (const name of ['Dashboard', 'Danh mục', 'Mã Giảm Giá']) {
    await t.open(name);
    for (const control of await t.page.locator('form input, form select, form button, tbody tr:first-child button').all()) {
      await control.scrollIntoViewIfNeeded();
      const hit = await control.evaluate((element) => {
        const r = element.getBoundingClientRect();
        const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return element === hit || element.contains(hit);
      });
      t.check(hit, `Điều khiển tại ${name} bị che sau cuộn ở zoom gốc 200%.`);
    }
  }
  await captureWindow(t.page, folder, 'S-05-window.png');
  result.evidence = `${folder}/S-05-window.png`;
  if (engine === 'firefox') t.block('Đã thử đủ ba màn sau khi tăng zoom. Cần đối chiếu nhãn zoom gốc trên ảnh trước khi chấm 200%.');
  return 'Zoom gốc 200%. Mở được ba màn và các điều khiển chính có thể nhận thao tác sau cuộn.';
}

function trackDiagnostics(page) {
  const entries = [];
  const record = (entry) => { if (entries.length < 30) entries.push(entry); };
  page.on('pageerror', (error) => record({ type: 'pageerror', message: error.message.slice(0, 500) }));
  page.on('console', (message) => {
    if (message.type() === 'error') record({ type: 'console', message: message.text().replace(/([?&]token=)[^\s"&]+/gi, '$1[redacted]').slice(0, 500) });
  });
  page.on('requestfailed', (request) => record({
    type: 'requestfailed', method: request.method(), path: new URL(request.url()).pathname,
    message: request.failure()?.errorText,
  }));
  page.on('response', (response) => {
    if (response.status() >= 400) record({
      type: 'http', status: response.status(), method: response.request().method(), path: new URL(response.url()).pathname,
    });
  });
  return entries;
}

async function installEvidenceOverlay(page, version) {
  if (!official) return;
  await page.addInitScript(({ identity, browser, device, windows }) => {
    window.addEventListener('DOMContentLoaded', () => {
      const overlay = document.createElement('div');
      overlay.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('data-hw03-evidence', '');
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;box-sizing:border-box;z-index:2147483647;background:#14263d;color:white;padding:4px 8px;pointer-events:none;font:11px/1.25 Arial,sans-serif;overflow-wrap:anywhere;';
      overlay.textContent = identity.join(' | ') + ' | ' + browser + ' | Windows ' + windows + ' | ' + device + ' | ' + location.origin;
      document.body.append(overlay);
    }, { once: true });
  }, { identity, browser: (engine === 'chrome' ? 'Google Chrome ' : 'Firefox (Playwright) ') + version, device, windows: os.release() });
}

async function stayOpen() {
  await new Promise((resolve) => {
    process.stdin.once('data', resolve);
    process.stdin.once('end', resolve);
  });
  process.stdin.pause();
}

async function stageSut(sandbox) {
  const archive = path.join(sandbox, 'sut.zip');
  execFileSync('git', ['archive', '--format=zip', '--output=' + archive, sutCommit, '--', 'frontend-admin', 'backend/server.js', 'backend/database.js'], { cwd: repo });
  execFileSync('tar', ['-xf', archive, '-C', sandbox]);
  const frontend = path.join(sandbox, 'frontend-admin');
  await fs.symlink(path.join(repo, 'frontend-admin', 'node_modules'), path.join(frontend, 'node_modules'), 'junction');
  const seed = await fs.readFile(path.join(sandbox, 'backend', 'database.js'), 'utf8');
  secret = seed.match(/'admin@eshop\.com', '([^']+)'/)?.[1];
  if (!secret) throw Error('Không nhận diện được seed Admin tại commit SUT.');
  // Keep the backend on loopback. The isolated copy retains baseline data and application logic.
  const serverPath = path.join(sandbox, 'backend', 'server.js');
  const server = await fs.readFile(serverPath, 'utf8');
  const listen = 'app.listen(PORT, () => {';
  if (!server.includes(listen)) throw Error('Không nhận diện được dòng lắng nghe của backend baseline.');
  const testServer = server.replace(listen, 'app.listen(PORT, "127.0.0.1", () => {')
    .replace('const app = express();', `const app = express();
app.disable('etag');
app.use((_request, response, next) => { response.set('Cache-Control', 'no-store'); next(); });${sauceSmoke ? `
app.use((request, response, next) => {
  if (['/api/login', '/api/admin/orders', '/api/categories'].includes(request.path)) {
    response.on('finish', () => console.log('HW03_HTTP ' + request.method + ' ' + request.path + ' ' + response.statusCode));
  }
  next();
});` : ''}`);
  await fs.writeFile(serverPath, testServer);
  if (serve) {
    const app = path.join(frontend, 'src', 'App.jsx');
    const source = await fs.readFile(app, 'utf8');
    const apiOrigin = '"http://localhost:3000/api"';
    if (!source.includes(apiOrigin)) throw Error('Không tìm thấy URL API baseline.');
    await fs.writeFile(app, source.replace(apiOrigin, '"/api"'));
    if (safari || sauceSmoke) return frontend;
    const index = path.join(frontend, 'index.html');
    const html = await fs.readFile(index, 'utf8');
    const escaped = identity.join(' | ').replace(/[&<>]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[char]);
    const banner = `<div aria-hidden="true" style="position:fixed;bottom:0;left:0;right:0;z-index:2147483647;background:#14263d;color:white;padding:4px 8px;pointer-events:none;font:11px/1.25 Arial,sans-serif;overflow-wrap:anywhere">${escaped}</div>`;
    await fs.writeFile(index, html.replace('</body>', banner + '</body>'));
  }
  return frontend;
}

async function main() {
  if (!['chrome', 'firefox', 'sauce-smoke', 'safari', 'safari-live'].includes(engine)) throw Error('Dùng node run.cjs chrome|firefox|sauce-smoke|safari|safari-live.');
  if (proofOnly && (!headed || !official)) throw Error('--proof cần --headed và đủ ba trường danh tính đã xác minh.');
  if (windowsProof && (!headed || !official)) throw Error('--windows-proof cần --headed và đủ danh tính đã xác minh.');
  if (serve && (!official || proofOnly || (!safari && requested.size))) throw Error('Phiên phục vụ cần đủ ba trường danh tính và chế độ phù hợp.');
  const definitions = Object.fromEntries(review.map((item) => [item.id, item]));
  if (Object.keys(definitions).length !== 70 || (!safari && [...requested].some((id) => !definitions[id]))) {
    throw Error('Checklist không đủ 70 mục hoặc ID chưa hợp lệ.');
  }
  const subpath = `evidence/${platform}/${tag}`;
  const logPath = path.join(__dirname, platform + '-' + tag + '.json');
  const metadata = {
    runId: tag, sutCommit, platform, started: localTime(), os: os.type() + ' ' + os.release(), device,
    playwright: playwrightVersion, node: process.version, frontend: cloud ? sauceURL : adminURL, backend: baseURL,
    viewport: cloud ? null : proofOnly ? 'Kích thước cửa sổ thật' : '1440 × 900', locale: cloud ? null : 'vi-VN',
    mode: safari ? 'webdriver' : sauceSmoke ? 'sauce-smoke' : serve ? 'manual-server' : headed ? 'headed' : 'headless', browser: '', identityOverlay: !cloud && official, proofOnly,
    database: sauceSmoke ? 'SQLite tạm từ seed của commit SUT, thêm một đơn pending cho smoke test' : 'SQLite tạm từ seed của commit SUT, phục hồi fixture giữa từng ca',
    setup: ['Backend tạm chỉ nghe loopback.', 'API tạm dùng Cache-Control: no-store và tắt ETag để đọc đúng fixture.'],
    lifecycle: [],
  };
  if (cloud) metadata.localFrontend = `http://127.0.0.1:${adminPort}`;
  const results = [];
  let browser, backend, web, sandbox, currentPage, liveHttps;
  const save = async () => {
    await fs.writeFile(logPath + '.tmp', JSON.stringify({ metadata, results }, null, 2) + '\n');
    await fs.rename(logPath + '.tmp', logPath);
  };
  try {
    await Promise.all([assertFree(3000), assertFree(adminPort)]);
    sandbox = await fs.mkdtemp(path.join(os.tmpdir(), 'eshop-task3-'));
    const frontend = await stageSut(sandbox);
    await fs.mkdir(path.join(taskDir, subpath), { recursive: true });
    metadata.lifecycle.push('Trích mã đúng commit SUT vào thư mục tạm. Dữ liệu workspace nằm ngoài thư mục chạy.');
    const childEnv = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^(HW03_REMOTE_|HW03_STUDENT_|HW03_ADMIN_PASSWORD|SAUCE_)/i.test(k)));
    const backendDir = path.join(sandbox, 'backend');
    backend = start(['server.js'], { cwd: backendDir, env: { ...childEnv, NODE_PATH: path.join(repo, 'backend', 'node_modules') } });
    const vitePath = pathToFileURL(path.join(repo, 'frontend-admin', 'node_modules', 'vite', 'dist', 'node', 'index.js')).href;
    const config = {
      root: frontend, cacheDir: path.join(sandbox,'vite-cache'), preview: {
        host: '127.0.0.1', port: adminPort, strictPort: true,
        ...(serve ? { proxy: { '/api': baseURL } } : {}),
        ...(cloud ? { allowedHosts: [new URL(sauceURL).hostname] } : {}),
      },
    };
    if (safari) {
      const { build, preview } = await import(vitePath);
      const { safariTraffic } = require('./safari-traffic.cjs');
      config.plugins = [safariTraffic(() => currentPage, sauceURL, platform === 'webdriver-local')];
      const workingDirectory = process.cwd();
      process.chdir(frontend);
      try { await build(config); } finally { process.chdir(workingDirectory); }
      web = await preview(config);
    } else {
      const viteScript = `const {build,preview}=await import(${JSON.stringify(vitePath)}); const config=${JSON.stringify(config)}; await build(config); await preview(config);`;
      web = start(['--input-type=module', '-e', viteScript], { cwd: frontend, env: childEnv });
    }
    await Promise.all([ready(baseURL+'/api/categories', backend), ready(`http://127.0.0.1:${adminPort}`, safari ? null : web)]);
    await expect.poll(async () => (await (await fetch(baseURL+'/api/categories')).json()).length).toBe(3);
    metadata.lifecycle.push(`Backend 3000 và Web Admin ${adminPort} xác nhận HTTP 200 trên loopback.`);
    if (safari) {
      const db = new DatabaseSync(path.join(backendDir, 'database.sqlite'));
      secret = randomBytes(24).toString('base64url');
      try { db.prepare('UPDATE users SET password = ? WHERE email = ?').run(secret, email); }
      finally { db.close(); }
      const { suite } = require('./safari-suite.cjs');
      await suite({ metadata, results, save, options: arguments_, definitions, cases, sandbox: backendDir, fixtures, temporarilyEmpty,
        identity, email, password: secret, baseURL, subset: subpath, taskDir, setPage: (page) => { currentPage = page; }, expect, request });
      return;
    }
    if (sauceSmoke) {
      const db = new DatabaseSync(path.join(backendDir, 'database.sqlite'));
      secret = randomBytes(24).toString('base64url');
      try {
        db.prepare('UPDATE users SET password = ? WHERE email = ?').run(secret, email);
        db.prepare("INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES (1, 123450, 'pending', 'HW03 smoke fixture')").run();
        metadata.fixture = { orders: db.prepare('SELECT COUNT(*) AS count FROM orders').get().count,
          categories: db.prepare('SELECT name FROM categories ORDER BY id').all().map(({ name }) => name) };
      } finally {
        db.close();
      }
      const baselineLogSize = backend.logs.length;
      const { smoke } = require('./sauce-smoke.cjs');
      await smoke({ metadata, save, identity, email, password: secret, out: path.join(taskDir, subpath), evidencePath: subpath,
        apiTrace: () => backend.logs.slice(baselineLogSize).join('\n').split(/\r?\n/).filter((line) => line.startsWith('HW03_HTTP ')) });
      return;
    }
    if (serve) {
      if (safariLive) {
        const db = new DatabaseSync(path.join(backendDir, 'database.sqlite'));
        secret = randomBytes(24).toString('base64url');
        try { db.prepare('UPDATE users SET password = ? WHERE email = ?').run(secret, email); }
        finally { db.close(); }
      }
      const loginResponse = await fetch(adminURL + '/api/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: secret }),
      });
      if (!loginResponse.ok) throw Error('Proxy đăng nhập trả HTTP ' + loginResponse.status());
      if (safariLive) {
        const { origin, startLiveHttps } = require('./safari-live-https.cjs');
        liveHttps = await startLiveHttps();
        metadata.frontend = origin;
        metadata.identityOverlay = official;
        metadata.lifecycle.push('HTTPS 8443 trả đúng trang và API danh mục qua Sauce Connect.');
        await save();
      }
      // Display the isolated demo login only to a local interactive operator.
      if (process.stdout.isTTY) console.log('SERVE_READY', metadata.frontend, 'Admin:', email, 'mật khẩu demo:', secret, '| Enter để dừng');
      else console.log('SERVE_READY', metadata.frontend, '| Enter để dừng');
      await stayOpen();
      return;
    }
    browser = engine === 'chrome'
      ? await chromium.launch({ channel: 'chrome', headless: !headed })
      : await firefox.launch({ headless: !headed, firefoxUserPrefs: {
        'dom.ipc.processPriorityManager.enabled': false,
        'browser.tabs.unloadOnLowMemory': false,
      } });
    metadata.browser = (engine === 'chrome' ? 'Google Chrome ' : 'Firefox (Playwright build) ') + browser.version();
    const backendFixture = path.join(sandbox,'backend');
    const baseline = fixtures(backendFixture);
    if (proofOnly) {
      const context = await browser.newContext({ viewport: null, locale: 'vi-VN' });
      const page = await context.newPage();
      await installEvidenceOverlay(page, browser.version());
      await login(page);
      await page.bringToFront();
      await page.screenshot({ path: path.join(taskDir,subpath,'dashboard-viewport.png') });
      if (windowsProof) {
        await captureWindow(page, subpath, 'dashboard-window.png');
        metadata.platformEvidence = `${subpath}/dashboard-window.png`;
      }
      console.log('PROOF_READY', metadata.browser, path.join(taskDir,subpath));
      if (!windowsProof) await stayOpen();
      await context.close();
    } else {
      if (windowsProof) {
        const context = await browser.newContext({ viewport: null, locale: 'vi-VN' });
        try {
          const page = await context.newPage();
          await installEvidenceOverlay(page, browser.version());
          await login(page);
          await captureWindow(page, subpath, 'dashboard-window.png');
          metadata.platformEvidence = `${subpath}/dashboard-window.png`;
        } catch (error) {
          metadata.lifecycle.push('Ảnh cửa sổ chưa lưu: ' + error.message);
        } finally {
          await context.close();
        }
      }
      const ids = review.map(({id})=>id).filter((id)=>!requested.size||requested.has(id));
      for (const id of ids) {
        const result = await execute(browser, backendFixture, id, definitions[id], subpath);
        results.push(result);
        console.log(id, result.status, result.actual || result.notes);
        await save();
        fixtures(backendFixture, baseline);
      }
    }
  } catch (error) {
    metadata.error = error.message;
    throw error;
  } finally {
    await browser?.close();
    if (liveHttps) {
      liveHttps.closeAllConnections();
      await new Promise((resolve) => liveHttps.close(resolve));
    }
    await Promise.all([stop(backend), safari ? web?.close() : stop(web)]);
    if (sandbox && path.dirname(sandbox) === path.resolve(os.tmpdir()) && path.basename(sandbox).startsWith('eshop-task3-')) {
      // Remove the junction itself before deleting the isolated tree.
      await fs.unlink(path.join(sandbox,'frontend-admin','node_modules')).catch((error)=>{ if (error.code !== 'ENOENT') throw error; });
      await fs.rm(sandbox, { recursive: true, force: true, maxRetries: 3 });
    }
    metadata.lifecycle.push('Đã dừng tiến trình do runner tạo và thu dọn thư mục tạm.');
    metadata.finished = localTime();
    await save();
    console.log(logPath);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
