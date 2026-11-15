const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const net = require('node:net');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const { DatabaseSync } = require('node:sqlite');
const { chromium, request, expect } = require('playwright/test');
const { version: playwrightVersion } = require('playwright/package.json');

const repo = path.resolve(__dirname, '../../..');
const frontend = path.join(repo, 'frontend-admin');
const baseURL = 'http://localhost:3000';
const adminURL = 'http://localhost:5174';
const email = 'admin@eshop.com';
const review = require('./checklist-review.json');
const cases = { ...require('./shared-categories.cjs'), ...require('./coupon-dashboard.cjs') };
const requested = new Set(process.argv.slice(2));
const taskDir = path.resolve(__dirname, '..');
const localTime = () => new Date(Date.now() + 7 * 3600000).toISOString().replace('Z', '+07:00');
const couponsRead = (r) => r.url() === baseURL + '/api/coupons' && r.request().method() === 'GET' && r.ok();
const heading = { Dashboard: 'Dashboard', 'Danh mục': 'Quản lý Danh mục', 'Mã Giảm Giá': 'Quản lý Mã Giảm Giá' };
const tag = 'HW03-' + Date.now().toString(36).toUpperCase();
const secret = process.env.HW03_ADMIN_PASSWORD;
const fixtureTables = ['categories', 'coupons', 'orders', 'coupon_usage'];

class CheckFailed extends Error {}
class Blocked extends Error {}

async function assertFree(port) {
  const listener = net.createServer();
  await new Promise((resolve, reject) => {
    listener.once('error', reject);
    listener.listen(port, () => listener.close(resolve));
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
      if (child.exitCode !== null) return 'process exited: ' + child.logs.join(' ');
      return (await fetch(url, { signal: AbortSignal.timeout(1000) })).status;
    } catch (error) {
      return [error.cause?.message || error.message, ...child.logs.slice(-3)].join(' | ');
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
  const [response] = await Promise.all([
    page.waitForResponse((r) => r.url() === baseURL + '/api/login' && r.request().method() === 'POST'),
    page.waitForResponse(couponsRead),
    page.getByRole('button', { name: 'Login', exact: true }).click(),
  ]);
  if (!response.ok()) throw new Error('Admin login returned HTTP ' + response.status());
  return (await response.json()).token;
}

async function execute(browser, sandbox, id, definition, subset) {
  const reference = id.startsWith('C-') || id.startsWith('S-') ? 'shared-categories.cjs' : 'coupon-dashboard.cjs';
  const result = {
    id, screen: definition.screen, category: definition.category, status: 'Not Run', timestamp: '',
    expected: definition.expected, steps: [], actual: '', notes: '', evidence: '', reference: '',
  };
  if (!cases[id]) {
    result.notes = 'Chờ kiểm tra trực tiếp hoặc chưa có phép đo phù hợp.';
    return result;
  }
  result.reference = `automation/${reference}#${id}`;
  result.timestamp = localTime();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'vi-VN' });
  let api, capture;
  let dialogAction = 'dismiss';
  const page = await context.newPage();
  page.setDefaultTimeout(3500);
  const dialogs = [];
  page.on('dialog', (dialog) => {
    dialogs.push({ type: dialog.type(), message: dialog.message() });
    const action = dialogAction;
    dialogAction = 'dismiss';
    dialog[action]().catch(() => {});
  });
  const takeScreenshot = () => page.screenshot({ timeout: 5000, animations: 'disabled' });
  try {
    const token = await login(page);
    result.steps.push('Đăng nhập GUI Admin và chờ chuỗi tải dữ liệu hoàn tất.');
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
    result.actual = await cases[id](t);
    if (!result.actual?.trim()) throw new Error('Missing observed result');
    result.status = 'Passed';
  } catch (error) {
    result.actual = error.message.replace(/\x1b\[[0-9;]*m/g, '');
    if (error instanceof CheckFailed) {
      try {
        const png = capture ?? await takeScreenshot();
        const relative = `evidence/${subset ? '_diagnostic/' : ''}${id}.png`;
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
    await api?.dispose();
    await context.close();
  }
  return result;
}

async function main() {
  if (!secret) throw new Error('Set HW03_ADMIN_PASSWORD to the demo admin password from backend/database.js.');
  const definitions = Object.fromEntries(review.items.map((item) => [item.id, item]));
  if (!definitions || Object.keys(definitions).length !== 69) throw new Error('Expected 69 reviewed baseline items.');
  if ([...requested].some((id) => !definitions[id])) throw new Error('Unknown case ID.');
  await Promise.all([assertFree(3000), assertFree(5174)]);
  const sandboxRoot = path.resolve(os.tmpdir());
  const sandbox = await fs.mkdtemp(path.join(sandboxRoot, 'eshop-hw03-'));
  const subpath = requested.size ? 'evidence/_diagnostic' : 'evidence';
  let browser, backend, web;
  try {
    await fs.mkdir(path.join(taskDir, subpath), { recursive: true });
    for (const filename of ['server.js', 'database.js']) {
      await fs.copyFile(path.join(repo, 'backend', filename), path.join(sandbox, filename));
    }
    const { HW03_ADMIN_PASSWORD: _password, ...childEnv } = process.env;
    backend = start(['server.js'], {
      cwd: sandbox,
      env: { ...childEnv, NODE_PATH: path.join(repo, 'backend', 'node_modules') },
    });
    const vitePath = pathToFileURL(path.join(frontend, 'node_modules', 'vite', 'dist', 'node', 'index.js')).href;
    const viteScript = `const {createServer}=await import(${JSON.stringify(vitePath)}); const server=await createServer(${JSON.stringify({
      root: frontend, cacheDir: path.join(sandbox, 'vite-cache'), server: { host: '127.0.0.1', port: 5174, strictPort: true },
    })}); await server.listen();`;
    web = start(['--input-type=module', '-e', viteScript], { cwd: frontend, env: childEnv });
    await Promise.all([ready(baseURL + '/api/categories', backend), ready('http://127.0.0.1:5174', web)]);
    await expect.poll(async () => {
      const response = await fetch(baseURL + '/api/categories');
      return (await response.json()).length;
    }).toBe(3);
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    const baseline = fixtures(sandbox);
    const metadata = {
      runId: tag, started: localTime(), browser: 'Chrome ' + browser.version(), playwright: playwrightVersion,
      os: os.type() + ' ' + os.release(), node: process.version, frontend: adminURL,
      backend: baseURL, viewport: '1440 × 900', locale: 'vi-VN', mode: 'headless',
      database: 'Fresh fixture database from unchanged copied backend source',
    };
    const results = [];
    const filename = requested.size ? 'results-diagnostic.json' : 'results.json';
    const ids = Object.keys(definitions).filter((id) => !requested.size || requested.has(id));
    const byScreen = (id) => ['C', 'P', 'D', 'S'].indexOf(id[0]);
    ids.sort((a, b) => byScreen(a) - byScreen(b) || Number(b === 'D-09') - Number(a === 'D-09') || a.localeCompare(b));
    for (const id of ids) {
      const result = await execute(browser, sandbox, id, definitions[id], requested.size);
      results.push(result);
      console.log(id, result.status, result.actual || result.notes);
      await fs.writeFile(path.join(__dirname, filename), JSON.stringify({ metadata, results }, null, 2) + '\n');
      fixtures(sandbox, baseline);
    }
    metadata.finished = localTime();
    await fs.writeFile(path.join(__dirname, filename), JSON.stringify({ metadata, results }, null, 2) + '\n');
  } finally {
    await browser?.close();
    await Promise.all([stop(backend), stop(web)]);
    if (path.dirname(sandbox) === sandboxRoot && path.basename(sandbox).startsWith('eshop-hw03-')) {
      await fs.rm(sandbox, { recursive: true, force: true, maxRetries: 3 });
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
