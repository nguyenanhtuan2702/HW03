const fs = require('node:fs');
const http = require('node:http');
const https = require('node:https');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const origin = 'https://localtest.me:8443';
const localOrigin = 'http://127.0.0.1:8080';
const proxy = 'http://127.0.0.1:18080';

async function startLiveHttps() {
  const existing = await fetch(localOrigin + '/', { signal: AbortSignal.timeout(5000) });
  if (!existing.ok) throw Error(`Sandbox HTTP ${existing.status}.`);
  await existing.body.cancel();
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'hw03-live-tls-'));
  const key = path.join(temporary, 'key.pem');
  const cert = path.join(temporary, 'cert.pem');
  const openssl = [process.env.HW03_OPENSSL, 'C:/Program Files/Git/usr/bin/openssl.exe', 'openssl'].find((entry) => entry && (entry === 'openssl' || fs.existsSync(entry)));
  let tls;
  try {
    execFileSync(openssl, ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-days', '1', '-subj', '/CN=localtest.me',
      '-addext', 'subjectAltName=DNS:localtest.me,IP:127.0.0.1', '-keyout', key, '-out', cert], { stdio: 'ignore', windowsHide: true });
    tls = { key: fs.readFileSync(key), cert: fs.readFileSync(cert) };
  } finally {
    for (const file of [key, cert]) if (fs.existsSync(file)) fs.unlinkSync(file);
    fs.rmdirSync(temporary);
  }
  const server = https.createServer(tls, (incoming, outgoing) => {
    if (!['localtest.me:8443', '127.0.0.1:8443'].includes(incoming.headers.host)) {
      outgoing.writeHead(421).end();
      return;
    }
    if (incoming.method === 'GET' && incoming.url === '/__hw03_live_375') {
      outgoing.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      outgoing.end(`<!doctype html><meta charset="utf-8"><title>HW03 S-06 · Safari</title>
<style>body{margin:0;font:14px system-ui;background:#eef2f7}header{padding:6px 10px}iframe{display:block;width:375px;height:812px;border:0;outline:1px solid #64748b;margin-left:10px}</style>
<header><strong id="size">Đang đo viewport…</strong> · S-06 · <a href="/">Về EShop</a></header>
<iframe id="shop" title="EShop Admin" src="/"></iframe>
<script>const frame=document.getElementById('shop');frame.addEventListener('load',()=>{const w=frame.contentWindow;document.getElementById('size').textContent=w.innerWidth+' × '+w.innerHeight+' CSS px'});</script>`);
      return;
    }
    const forward = http.request({ hostname: '127.0.0.1', port: 8080, path: incoming.url,
      method: incoming.method, headers: { ...incoming.headers, host: 'localtest.me:8080' } }, (response) => {
      outgoing.writeHead(response.statusCode, response.headers);
      response.pipe(outgoing);
    });
    forward.on('error', () => {
      if (!outgoing.headersSent) outgoing.writeHead(502);
      outgoing.end();
    });
    outgoing.on('close', () => { if (!outgoing.writableFinished) forward.destroy(); });
    incoming.pipe(forward);
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(8443, '127.0.0.1', resolve);
  });
  try {
    const { execFile } = require('node:child_process');
    const { promisify } = require('node:util');
    const curl = promisify(execFile);
    for (const route of ['/', '/api/categories']) {
      const { stdout } = await curl('curl.exe', ['-kfSs', '--max-time', '10', '--noproxy', '""', '--proxy', proxy, origin + route], { windowsHide: true });
      if (route === '/' ? !stdout.includes('/assets/') : !Array.isArray(JSON.parse(stdout))) {
        throw Error(`Phản hồi không khớp EShop tại ${route}.`);
      }
    }
  } catch (error) {
    server.close();
    throw error;
  }
  return server;
}

module.exports = { origin, startLiveHttps };
