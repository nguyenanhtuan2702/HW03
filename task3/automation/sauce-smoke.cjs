const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { lookup } = require('node:dns/promises');
const { setTimeout: pause } = require('node:timers/promises');

const api = 'https://api.eu-central-1.saucelabs.com';
const webdriver = 'https://ondemand.eu-central-1.saucelabs.com/wd/hub';
const tunnelName = 'hw03-task3';

function throughSauceProxy(url) {
  return new Promise((resolve, reject) => {
    const request = http.get({ host: '127.0.0.1', port: 18080, path: url, headers: { Host: new URL(url).host },
      signal: AbortSignal.timeout(7000) }, (response) => {
      response.setEncoding('utf8');
      let body = '';
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => resolve({ status: response.statusCode, body }));
      response.on('error', reject);
    });
    request.on('error', reject);
  });
}

async function smoke({ metadata, save, identity, email, password, out, evidencePath, apiTrace }) {
  const username = process.env.SAUCE_USERNAME;
  const accessKey = process.env.SAUCE_ACCESS_KEY;
  const localOnly = process.env.HW03_SMOKE_LOCAL_ONLY === '1';
  const platformName = process.env.HW03_SAFARI_PLATFORM || 'macOS 14';
  const browserVersion = process.env.HW03_SAFARI_VERSION || '18';
  const auth = Buffer.from(`${username}:${accessKey}`).toString('base64');
  const start = Date.now();
  const report = metadata.smoke = { region: 'eu-central', tunnelName, requestedPlatform: platformName,
    requestedVersion: browserVersion, status: 'Blocked', checks: [], evidence: [] };
  const rest = (endpoint) => fetch(`${api}${endpoint}`, {
    headers: { Authorization: `Basic ${auth}` }, redirect: 'error', signal: AbortSignal.timeout(12000),
  });
  const accountPath = `/rest/v1/${encodeURIComponent(username)}`;
  const check = async (name, operation) => {
    const before = Date.now();
    try {
      const observation = await operation();
      report.checks.push({ name, status: 'Passed', observation, elapsedMs: Date.now() - before });
      await save();
    } catch (error) {
      const safe = String(error.message || error).split(/\r?\n/)[0];
      const secrets = [accessKey, username, auth, password].filter(Boolean);
      const observation = secrets.reduce((message, value) => message.replaceAll(value, '[redacted]').replaceAll(encodeURIComponent(value), '[redacted]'), safe)
        .replace(/https?:\/\/[^/\s]*@/ig, '[authenticated endpoint]').replace(/\b(?:Bearer|Basic)\s+\S+/gi, '[redacted header]').slice(0, 750);
      report.checks.push({ name, status: 'Blocked', observation, elapsedMs: Date.now() - before });
      await save();
      throw Error(`${name}: ${observation}`);
    }
  };

  let driver;
  let sessionStarted;
  let localApiLines = 0;
  const sessionApi = () => apiTrace().slice(localApiLines);
  try {
    const assertHttp = async (origin, read) => {
      const readExpected = async (pathname) => {
        const response = await read(`${origin}${pathname}`);
        if (response.status !== 200) throw Error(`${pathname} tại ${origin} trả HTTP ${response.status}.`);
        return response.body;
      };
      const html = await readExpected('/');
      const asset = html.match(/<script\b[^>]*\bsrc="(\/assets\/[^"?#]+\.js)"/i)?.[1];
      if (!asset) throw Error('HTML không có đường dẫn tương đối đến JavaScript của Vite.');
      const javascript = await readExpected(asset);
      if (javascript.includes('http://localhost:3000/api')) throw Error('Bundle vẫn chứa API localhost tuyệt đối.');
      const data = JSON.parse(await readExpected('/api/categories'));
      if (!Array.isArray(data) || JSON.stringify(data.map((row) => row.name)) !== JSON.stringify(metadata.fixture.categories)) {
        throw Error('Proxy không trả đúng danh mục fixture.');
      }
      return `${origin}: HTML, JavaScript và GET /api/categories đều HTTP 200; ${data.length} danh mục fixture.`;
    };
    const localRead = async (url) => {
      const response = await fetch(url, { signal: AbortSignal.timeout(5000), redirect: 'manual' });
      return { status: response.status, body: await response.text() };
    };
    await check('Web Admin trên loopback', () => assertHttp(metadata.localFrontend, localRead));
    await check('DNS và HTTP của hostname Safari', async () => {
      const hostname = new URL(metadata.frontend).hostname;
      const addresses = await lookup(hostname, { all: true }).catch(() => []);
      if (!addresses.some(({ address }) => address === '127.0.0.1') ||
        addresses.some(({ address }) => !['127.0.0.1', '::1'].includes(address))) {
        throw Error(`${hostname} cần phân giải về loopback IPv4 trên máy chạy Sauce Connect.`);
      }
      return `${hostname} → ${addresses.map(({ address }) => address).join(', ')}. ${await assertHttp(metadata.frontend, localRead)}`;
    });
    if (localOnly) {
      report.status = 'Local preflight only';
      return;
    }
    await check('Tài khoản và tunnel Ready', async () => {
      if (!username || !accessKey) throw Error('Thiếu biến xác thực trong PowerShell chạy smoke test.');
      const response = await rest(`${accountPath}/tunnels?full=true`);
      if (!response.ok) throw Error(`API đọc tunnel tại EU Central trả HTTP ${response.status}.`);
      const tunnels = await response.json();
      if (!Array.isArray(tunnels)) throw Error('API tunnel trả cấu trúc không nhận diện được.');
      const found = tunnels.find((tunnel) => tunnel.tunnel_identifier === tunnelName && tunnel.is_ready === true);
      if (!found) throw Error(`Chưa thấy ${tunnelName} có is_ready=true ở EU Central.`);
      return `${tunnelName}: is_ready=true.`;
    });
    await check('HTTP qua proxy chẩn đoán Sauce Connect', async () => {
      try {
        return await assertHttp(metadata.frontend, throughSauceProxy);
      } catch (error) {
        if (error.code === 'ECONNREFUSED') throw Error('Khởi động lại tunnel với --debug-address 127.0.0.1:18080 để kiểm tra trước khi mở Safari.');
        throw error;
      }
    });
    localApiLines = apiTrace().length;

    const { Builder, By, Key, until } = require('selenium-webdriver');
    await check('Khởi tạo phiên Safari/macOS', async () => {
      const endpoint = new URL(webdriver);
      endpoint.username = username;
      endpoint.password = accessKey;
      sessionStarted = Date.now();
      driver = await new Builder().disableEnvironmentOverrides().usingServer(endpoint.href).withCapabilities({
        browserName: 'safari', browserVersion, platformName,
        'sauce:options': { tunnelName, name: `EShop HW03 smoke ${metadata.runId}`, public: 'private',
          recordVideo: true, recordScreenshots: false, recordLogs: false, captureHtml: false,
          commandTimeout: 45, idleTimeout: 45, maxDuration: 180 },
      }).build();
      const session = await driver.getSession();
      report.jobId = session.getId();
      const capabilities = await driver.getCapabilities();
      const actual = { browser: capabilities.get('browserName'), version: capabilities.get('browserVersion'),
        platform: capabilities.get('platformName'), platformVersion: capabilities.get('safari:platformVersion') || capabilities.get('platformVersion') || null };
      report.actual = actual;
      if (actual.browser?.toLowerCase() !== 'safari' || !/mac|darwin/i.test(actual.platform || '')) throw Error('Capabilities trả về không xác nhận Safari trên macOS.');
      metadata.browser = `Safari ${actual.version}`;
      return `${actual.browser} ${actual.version} · ${actual.platform}.`;
    });
    const heading = (value) => driver.wait(until.elementLocated(By.xpath(`//h2[normalize-space(.)='${value}']`)), 8000);
    await check('Mở Web Admin qua tunnel', async () => {
      await driver.manage().setTimeouts({ pageLoad: 15000, script: 8000 });
      await driver.get(metadata.frontend);
      await heading('Admin Login');
      const url = await driver.getCurrentUrl();
      if (new URL(url).origin !== metadata.frontend) throw Error('Origin sau khi tải trang khác origin dự kiến.');
      report.observedUrl = url;
      return `Admin Login đã hiển thị tại ${metadata.frontend}.`;
    });
    await check('Đăng nhập và tải Dashboard', async () => {
      await driver.findElement(By.css('input[placeholder="Email"]')).sendKeys(email);
      await driver.findElement(By.css('input[type="password"]')).sendKeys(password, Key.ENTER);
      await heading('Dashboard');
      const total = By.xpath("//*[normalize-space(.)='Tổng số đơn hàng']/following-sibling::p[1]");
      await driver.wait(async () => Number(await driver.findElement(total).getText()) === metadata.fixture.orders, 9000);
      return `Dashboard hiển thị ${metadata.fixture.orders} đơn, khớp SQLite sandbox.`;
    });
    await check('Tải Danh mục và đối chiếu API', async () => {
      await driver.findElement(By.xpath("//li[normalize-space(.)='Danh mục']")).click();
      await heading('Quản lý Danh mục');
      const cells = By.css('tbody tr td:nth-child(2)');
      await driver.wait(async () => {
        const values = await Promise.all((await driver.findElements(cells)).map((cell) => cell.getText()));
        return metadata.fixture.categories.every((name) => values.includes(name));
      }, 8000);
      report.api = sessionApi();
      for (const line of ['POST /api/login 200', 'GET /api/admin/orders 200', 'GET /api/categories 200']) {
        if (!report.api.includes(`HW03_HTTP ${line}`)) throw Error(`Thiếu phản hồi từ hành trình trình duyệt: ${line}.`);
      }
      return `${metadata.fixture.categories.length} danh mục trong GUI, login và hai GET được backend xác nhận HTTP 200.`;
    });
    await check('Chụp ảnh thật trong phiên Safari', async () => {
      const environment = await driver.executeScript('return { agent: navigator.userAgent, platform: navigator.platform, viewport: [innerWidth, innerHeight], locale: navigator.language };');
      report.client = environment;
      if (!/Mac/i.test(environment.platform) || !/Safari\//.test(environment.agent)) throw Error('Browser metadata trong trang không khớp Safari/macOS.');
      metadata.viewport = environment.viewport.join(' × ');
      metadata.locale = environment.locale;
      const label = [...identity, `Safari ${report.actual.version} | macOS ${report.actual.platformVersion || report.actual.platform}`,
        new URL(report.observedUrl).origin, `Sauce job ${report.jobId}`].join(' | ');
      const fixed = await driver.executeScript(function (label) {
        const overlay = document.createElement('div');
        overlay.setAttribute('aria-hidden', 'true');
        overlay.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#14263d;color:white;font:13px Arial;padding:6px;pointer-events:none;z-index:2147483647;text-align:center;overflow-wrap:anywhere';
        overlay.textContent = label;
        const before = [document.documentElement.scrollWidth, document.documentElement.scrollHeight, document.activeElement];
        document.body.append(overlay);
        const after = [document.documentElement.scrollWidth, document.documentElement.scrollHeight, document.activeElement];
        return before.every((value, i) => value === after[i]);
      }, label);
      if (!fixed) throw Error('Overlay làm thay đổi kích thước trang hoặc focus.');
      const screenshot = Buffer.from(await driver.takeScreenshot(), 'base64');
      if (screenshot.subarray(1, 4).toString() !== 'PNG') throw Error('WebDriver không trả ảnh PNG.');
      await fs.writeFile(path.join(out, 'categories-safari-viewport.png'), screenshot, { flag: 'wx' });
      report.evidence.push(`${evidencePath}/categories-safari-viewport.png`);
      metadata.identityOverlay = true;
      await pause(1700);
      return 'Đã lưu ảnh nguyên bản. Cần rà artifact máy cloud để xác nhận thanh địa chỉ.';
    });
    report.status = 'Browser smoke passed';
  } finally {
    if (driver) {
      try { await driver.quit(); report.sessionClosed = true; } catch { report.sessionClosed = false; }
    }
    if (sessionStarted) report.sessionElapsedMs = Date.now() - sessionStarted;
    if (report.jobId) {
      try {
        const job = `${accountPath}/jobs/${encodeURIComponent(report.jobId)}`;
        const response = await rest(job);
        if (response.ok) {
          const jobData = await response.json();
          report.sauceMetadata = Object.fromEntries(['browser', 'browser_version', 'os', 'platform', 'deviceName', 'device_name', 'duration', 'status', 'record_video', 'proxied']
            .filter((key) => jobData[key] !== undefined).map((key) => [key, jobData[key]]));
        }
        if (report.evidence.length) {
          const asset = `${job}/assets/video.mp4`;
          let video = await rest(asset);
          for (const delay of [1500, 3500, 7000]) {
            if (![404, 409, 425].includes(video.status)) break;
            await pause(delay);
            video = await rest(asset);
          }
          if (video.ok) {
            await fs.writeFile(path.join(out, 'sauce-job-video.mp4'), Buffer.from(await video.arrayBuffer()), { flag: 'wx' });
            report.evidence.push(`${evidencePath}/sauce-job-video.mp4`);
          } else {
            report.video = `HTTP ${video.status}; kiểm Video trong job Sauce sau khi xử lý xong.`;
          }
        }
      } catch {
        report.video = 'Chưa lấy được artifact từ API; kiểm job Sauce trong dashboard.';
      }
    }
    report.api = report.api || sessionApi();
    report.elapsedMs = Date.now() - start;
    await save();
  }
}

module.exports = { smoke, throughSauceProxy };
