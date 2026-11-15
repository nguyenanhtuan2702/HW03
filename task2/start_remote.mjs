import { spawn, spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import fs from 'node:fs';
import { get } from 'node:https';
import net from 'node:net';
import path from 'node:path';
import { createInterface } from 'node:readline';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const taskDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(taskDir, '../..');
const backendDir = path.join(root, 'backend');
const frontendDir = path.join(root, 'frontend-admin');
const stateDir = path.join(taskDir, '.remote-state');
const origin = 'http://127.0.0.1:5517';
const mode = 'hw03-remote';
const localOnly = process.argv[2] === '--local-only';
const installedTunnel = path.join(taskDir, '.tools', 'cloudflared.exe');
const cloudflared = process.env.CLOUDFLARED_PATH ||
  (fs.existsSync(installedTunnel) ? installedTunnel : 'cloudflared');
const recipients = [...new Set((process.env.HW03_TUNNEL_EMAILS || '')
  .split(',').map((email) => email.trim().toLowerCase()).filter(Boolean))];
const providedPassword = process.env.HW03_ADMIN_PASSWORD;
const adminPassword = providedPassword || randomBytes(18).toString('base64url');
const jwtSecret = randomBytes(32).toString('hex');
const {
  HW03_TUNNEL_EMAILS: _emails,
  HW03_ADMIN_PASSWORD: _password,
  HW03_REMOTE_DB: _db,
  HW03_REMOTE_JWT: _jwt,
  ...childEnv
} = process.env;

function validateTunnel() {
  if (localOnly) return;
  const exactEmail = /^[a-z0-9.!#$%&'+/=?^`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i;
  if (!recipients.length || recipients.some((email) => !exactEmail.test(email))) {
    throw new Error('Set HW03_TUNNEL_EMAILS to exact comma-separated email addresses. Wildcards are disabled.');
  }
  const help = spawnSync(cloudflared, ['tunnel', '--help'], {
    encoding: 'utf8', env: childEnv, windowsHide: true,
  });
  if (help.status !== 0 || !help.stdout.includes('--allowed-mail') || !help.stdout.includes('--http-host-header')) {
    throw new Error('Install an up-to-date cloudflared that supports --allowed-mail and --http-host-header.');
  }
}

async function requireFreePort(port) {
  const listener = net.createServer();
  await new Promise((resolve, reject) => {
    listener.once('error', reject);
    listener.listen(port, '127.0.0.1', () => listener.close(resolve));
  });
}

function removeOwnedDirectory(dir) {
  if (path.dirname(dir) !== stateDir || !/^(seed|preview)-/.test(path.basename(dir))) {
    throw new Error('Refusing to remove an unexpected directory');
  }
  fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3 });
}

function setSessionCredentials(dbPath) {
  const db = new DatabaseSync(dbPath);
  try {
    const admins = db.prepare("SELECT id, email FROM users WHERE role = 'admin'").all();
    if (admins.length !== 1 || !admins[0].email) throw new Error('Expected one demo admin in the isolated DB');
    const admin = admins[0];
    const update = db.prepare('UPDATE users SET password = ?, login_attempts = 0, locked_until = NULL, reset_token = NULL WHERE id = ?');
    db.exec('BEGIN');
    try {
      for (const { id } of db.prepare('SELECT id FROM users').all()) {
        update.run(id === admin.id ? adminPassword : randomBytes(24).toString('base64url'), id);
      }
      db.exec('COMMIT');
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
    return admin.email;
  } finally {
    db.close();
  }
}

function prepareDatabase(dbPath) {
  if (fs.existsSync(dbPath)) return setSessionCredentials(dbPath);
  const seedDir = fs.mkdtempSync(path.join(stateDir, 'seed-'));
  try {
    const seed = path.join(seedDir, 'database.js');
    fs.copyFileSync(path.join(backendDir, 'database.js'), seed);
    const result = spawnSync(process.execPath, [seed], {
      cwd: seedDir,
      env: { ...childEnv, NODE_PATH: path.join(backendDir, 'node_modules') },
      encoding: 'utf8',
      windowsHide: true,
    });
    if (result.status !== 0) throw new Error('The isolated database seed failed.');
    const seededDb = path.join(seedDir, 'database.sqlite');
    const adminEmail = setSessionCredentials(seededDb);
    fs.renameSync(seededDb, dbPath);
    return adminEmail;
  } finally {
    removeOwnedDirectory(seedDir);
  }
}

function startChild(executable, args, options) {
  const child = spawn(executable, args, { ...options, windowsHide: true });
  const done = new Promise((resolve) => {
    child.once('exit', (code) => resolve(code ?? 1));
    child.once('error', () => resolve(1));
  });
  return { child, done };
}

async function stopChild(job) {
  if (!job) return;
  if (job.child.exitCode === null && job.child.signalCode === null) job.child.kill();
  await job.done;
}

async function awaitBackend(job) {
  for (let attempt = 0; attempt < 30; attempt++) {
    const state = await Promise.race([job.done, delay(300, 'running')]);
    if (state !== 'running') break;
    const response = await fetch('http://127.0.0.1:5300/api/categories', {
      signal: AbortSignal.timeout(1000),
    }).catch(() => null);
    if (response?.ok && Array.isArray(await response.json())) return;
  }
  throw new Error('The isolated backend did not become ready on port 5300.');
}

function startTunnel() {
  const job = startChild(cloudflared, [
    'tunnel', '--no-autoupdate', '--url', origin,
    '--http-host-header', '127.0.0.1:5517',
    '--allowed-mail', recipients.join(','),
  ], { env: childEnv, stdio: ['ignore', 'pipe', 'pipe'] });
  job.recent = '';
  for (const stream of [job.child.stdout, job.child.stderr]) {
    stream.on('data', (chunk) => { job.recent = (job.recent + chunk).slice(-6000); });
  }
  return job;
}

function tunnelErrors(job) {
  return recipients.reduce((log, email) => log.replaceAll(email, '[email]'), job.recent)
    .split(/\r?\n/).filter((line) => /ERR|WRN/.test(line)).slice(-5).join('\n');
}

async function tunnelURL(job) {
  let timer;
  const found = new Promise((resolve) => {
    const onData = () => {
      const url = job.recent.match(/protected quick Tunnel has been created[^\n]*\n[^\n]*(https:\/\/[a-z0-9-]+\.trycloudflare\.com)\b/i)?.[1];
      if (url) resolve(url);
    };
    job.child.stdout.on('data', onData);
    job.child.stderr.on('data', onData);
    timer = setTimeout(() => resolve(null), 40000);
  });
  try {
    const url = await Promise.race([found, job.done.then(() => null)]);
    if (!url) {
      const details = tunnelErrors(job);
      throw new Error('Cloudflare did not allocate a protected Quick Tunnel.' + (details ? '\n' + details : ''));
    }
    return url;
  } finally {
    clearTimeout(timer);
  }
}

async function resolvePublicAddress(url, signal) {
  const dns = new URL('https://cloudflare-dns.com/dns-query');
  dns.search = new URLSearchParams({ name: new URL(url).hostname, type: 'A' });
  const response = await fetch(dns, { headers: { accept: 'application/dns-json' }, signal });
  if (!response.ok) return;
  const answer = await response.json();
  if (answer.Status === 0) {
    return answer.Answer?.find(({ type, data }) => type === 1 && net.isIPv4(data))?.data;
  }
}

function probeHTTPS(url, signal, address) {
  const options = { signal: AbortSignal.any([signal, AbortSignal.timeout(5000)]) };
  if (address) {
    // Override only DNS for this request. The URL still sets the Host header and TLS hostname.
    options.family = 4;
    options.lookup = (_host, _options, callback) => callback(null, address, 4);
  }
  return new Promise((resolve) => {
    const request = get(url, options, (response) => {
      response.resume();
      resolve({ status: response.statusCode, location: response.headers.location });
    });
    request.once('error', (error) => resolve({ error: error.code || error.name }));
  });
}

async function verifyAnonymousGate(url, tunnel, signal) {
  let latest = [];
  let publicAddress;
  const deadline = Date.now() + 75000;
  while (Date.now() < deadline) {
    signal.throwIfAborted();
    const checks = await Promise.all(['/', '/api/categories'].map((route) =>
      probeHTTPS(url + route, signal, publicAddress)));
    latest = checks.map(({ status, error }) => status ?? error);
    if (checks.some(({ status }) => status >= 200 && status < 300)) {
      throw new Error('A Quick Tunnel route allowed anonymous access. The tunnel is being closed.');
    }
    if (checks.every(({ status, location }) =>
      status >= 300 && status < 400 && location &&
      new URL(location, url).hostname === 'login.trycloudflare.com')) {
      return Boolean(publicAddress);
    }
    if (!publicAddress && latest.includes('ENOTFOUND')) {
      const dnsSignal = AbortSignal.any([signal, AbortSignal.timeout(5000)]);
      publicAddress = await resolvePublicAddress(url, dnsSignal).catch(() => undefined);
    }
    await delay(2500, undefined, { signal });
  }
  const details = tunnelErrors(tunnel);
  throw new Error(
    'Could not verify email protection. Last responses for / and /api/categories: ' + latest.join(', ') +
    '. The tunnel is being closed.' + (details ? '\n' + details : ''),
  );
}

async function main() {
  if (process.argv.length > (localOnly ? 3 : 2)) throw new Error('Usage: node HW03/task2/start_remote.mjs [--local-only]');
  if (providedPassword && providedPassword.length < 16) throw new Error('Use a session password of at least 16 characters.');
  validateTunnel();
  await Promise.all([requireFreePort(5300), requireFreePort(5517)]);
  fs.mkdirSync(stateDir, { recursive: true });
  const lockPath = path.join(stateDir, 'running.lock');
  const lock = fs.openSync(lockPath, 'wx');
  let previewDir, backend, preview, tunnel;
  const interrupt = new AbortController();
  const stop = () => interrupt.abort();
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
  const terminal = process.stdin.isTTY ? createInterface({ input: process.stdin }) : null;
  terminal?.on('line', (line) => { if (line.trim().toLowerCase() === 'q') stop(); });
  terminal?.on('SIGINT', stop);
  try {
    const dbPath = path.join(stateDir, 'database.sqlite');
    const adminEmail = prepareDatabase(dbPath);
    previewDir = fs.mkdtempSync(path.join(stateDir, 'preview-'));
    process.chdir(frontendDir);
    const { build, preview: servePreview } = await import(
      pathToFileURL(path.join(frontendDir, 'node_modules', 'vite', 'dist', 'node', 'index.js')).href
    );
    const config = { root: frontendDir, mode, build: { outDir: previewDir, emptyOutDir: true } };
    await build(config);
    interrupt.signal.throwIfAborted();
    backend = startChild(process.execPath, ['server.js'], {
      cwd: backendDir,
      env: { ...childEnv, HW03_REMOTE_DB: dbPath, HW03_REMOTE_JWT: jwtSecret },
      stdio: ['ignore', 'inherit', 'inherit'],
    });
    await awaitBackend(backend);
    preview = await servePreview(config);
    console.log('Local test URL:', origin);
    console.log('EShop demo admin:', adminEmail);
    if (!providedPassword) console.log('Temporary EShop password:', adminPassword);
    if (terminal) console.log('To end the session, type q and press Enter.');
    if (!localOnly) {
      interrupt.signal.throwIfAborted();
      console.log('Requesting a Quick Tunnel with email authentication...');
      tunnel = startTunnel();
      const url = await tunnelURL(tunnel);
      console.log('Cloudflare assigned a hostname. Checking HTTPS and the email gate (up to 75 seconds)...');
      const usedPublicDNS = await verifyAnonymousGate(url, tunnel, interrupt.signal);
      console.log('Protected HTTPS URL:', url);
      console.log('Anonymous checks blocked on / and /api/categories. Verify OTP with an allowed inbox before sharing.');
      if (usedPublicDNS) console.log('Windows DNS has not resolved the new hostname yet. Try the HTTPS link on mobile data if needed.');
    }
    const stopped = interrupt.signal.aborted ? Promise.resolve(0) : new Promise((resolve) => {
      interrupt.signal.addEventListener('abort', () => resolve(0), { once: true });
    });
    const code = await Promise.race([stopped, backend.done, ...(tunnel ? [tunnel.done] : [])]);
    if (code) throw new Error('A required service exited. Restart the session.');
  } finally {
    try {
      await stopChild(tunnel);
      if (preview) {
        preview.httpServer.closeAllConnections();
        await new Promise((resolve) => preview.httpServer.close(resolve));
      }
      await stopChild(backend);
      if (previewDir) removeOwnedDirectory(previewDir);
    } finally {
      terminal?.close();
      fs.closeSync(lock);
      fs.unlinkSync(lockPath);
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
