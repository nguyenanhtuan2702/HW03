/**
 * HW03 Task 2 — Local access gate for ngrok (Node.js, no dependencies).
 * Use only with an isolated EShop test environment.
 * This gate protects ALL paths (including /api) with an HttpOnly cookie,
 * leaving the application's Authorization: Bearer JWT intact.
 *
 * Start EShop first with: node HW03/task2/start_remote.mjs --local-only
 * Set HW03_GATE_PASSWORD in your terminal to a strong separate password.
 * Then: node eshop_task2_access_gate.mjs
 * Finally: ngrok http 5518
 */
import http from 'node:http';
import crypto from 'node:crypto';

const target = { hostname: '127.0.0.1', port: 5517 };
const listen = { hostname: '127.0.0.1', port: 5518 };
const password = process.env.HW03_GATE_PASSWORD;
if (!password || password.length < 16) {
  console.error('Thiếu HW03_GATE_PASSWORD (ít nhất 16 ký tự). Không mở cổng khi thiếu mật khẩu.');
  process.exit(1);
}
const passwordDigest = crypto.createHash('sha256').update(password).digest();
const sessions = new Map();
const SESSION_MS = 12 * 60 * 60 * 1000;
const attempts = [];
const COOKIE_NAME = 'hw03_gate_session';

function escapedHtml(s) {
  return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;')
    .replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
}
function send(res, status, html, headers={}) {
  res.writeHead(status, {
    'Content-Type':'text/html; charset=utf-8',
    'Cache-Control':'no-store',
    'X-Content-Type-Options':'nosniff',
    'X-Frame-Options':'DENY',
    'Referrer-Policy':'no-referrer',
    'Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'",
    ...headers,
  });
  res.end(html);
}
function loginPage(message='') {
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>HW03 — Truy cập phiên kiểm thử</title><style>
  body{font:16px system-ui,sans-serif;background:#f5f7fb;margin:0;display:grid;min-height:100vh;place-items:center;color:#14263a}
  main{background:#fff;max-width:390px;width:calc(100% - 40px);padding:30px;border-radius:15px;box-shadow:0 5px 25px #172c4618}
  h1{font-size:21px;margin:0 0 12px}p{line-height:1.5}label{display:block;margin-bottom:8px}
  input,button{font:inherit;box-sizing:border-box;width:100%;padding:12px;border-radius:8px}
  input{border:1px solid #aaa}button{background:#194e91;color:white;border:0;margin-top:15px;cursor:pointer}
  small{color:#536478}.error{color:#aa1d2f}
  </style></head><body><main><h1>Truy cập EShop — HW03</h1>
  <p>Nhập mật khẩu phiên kiểm thử do người điều phối cung cấp. Đây không phải mật khẩu đăng nhập Admin.</p>
  ${message?`<p class="error" role="alert">${escapedHtml(message)}</p>`:''}
  <form method="post" action="/__hw03/login"><label for="pw">Mật khẩu truy cập</label>
  <input name="password" id="pw" type="password" autocomplete="off" required autofocus>
  <button type="submit">Tiếp tục đến EShop</button></form>
  <p><small>Chỉ sử dụng cho người tham gia nghiên cứu đã được mời.</small></p></main></body></html>`;
}
function isAuthorized(req) {
  const cookie = req.headers.cookie || '';
  const value = cookie.split(';').map(s=>s.trim()).find(s=>s.startsWith(COOKIE_NAME+'='))?.slice(COOKIE_NAME.length+1);
  if (!value) return false;
  const expires = sessions.get(value);
  if (!expires) return false;
  if (expires < Date.now()) { sessions.delete(value); return false; }
  return true;
}
function proxy(req,res) {
  const headers = { ...req.headers, host: `${target.hostname}:${target.port}` };
  // The edge session cookie is never forwarded to EShop.
  if (headers.cookie) {
    const remaining = headers.cookie.split(';').map(s=>s.trim())
      .filter(s=>!s.startsWith(COOKIE_NAME+'='));
    if (remaining.length) headers.cookie=remaining.join('; '); else delete headers.cookie;
  }
  const upstream = http.request({ ...target, path:req.url, method:req.method, headers }, upstreamRes => {
    res.writeHead(upstreamRes.statusCode ?? 502, upstreamRes.headers);
    upstreamRes.pipe(res);
  });
  upstream.on('error',()=>{
    if (!res.headersSent) send(res,502,loginPage('EShop chưa sẵn sàng. Hãy báo người điều phối.'));
    else res.destroy();
  });
  req.pipe(upstream);
}
async function readSmallForm(req) {
  let raw='';
  for await (const chunk of req) {
    raw += chunk.toString('utf8');
    if (raw.length > 8192) return null;
  }
  return new URLSearchParams(raw);
}
const server = http.createServer(async (req,res) => {
  const path = new URL(req.url || '/', 'http://localhost').pathname;
  if (path === '/__hw03/login' && req.method === 'POST') {
    // A minimal global throttle against guessing (per run); avoid storing participant IPs.
    const now=Date.now();
    while(attempts.length && attempts[0]<now-5*60*1000) attempts.shift();
    if(attempts.length>=30) return send(res,429,loginPage('Quá nhiều lần thử. Liên hệ người điều phối.'));
    const params=await readSmallForm(req);
    const submitted=String(params?.get('password') || '');
    const digest=crypto.createHash('sha256').update(submitted).digest();
    if(!crypto.timingSafeEqual(digest,passwordDigest)) {
      attempts.push(now);
      return send(res,401,loginPage('Mật khẩu chưa đúng. Vui lòng thử lại.'));
    }
    const token=crypto.randomBytes(32).toString('base64url');
    sessions.set(token, now+SESSION_MS);
    res.writeHead(303, {
      Location:'/', 'Set-Cookie':`${COOKIE_NAME}=${token}; Max-Age=${SESSION_MS/1000}; Path=/; HttpOnly; Secure; SameSite=Lax`,
      'Cache-Control':'no-store',
    });
    return res.end();
  }
  if (!isAuthorized(req)) {
    if(path.startsWith('/api/')) {
      res.writeHead(401,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});
      return res.end(JSON.stringify({ error: 'HW03 access required' }));
    }
    return send(res,401,loginPage());
  }
  if (path === '/__hw03/logout' && req.method==='POST') {
    const value=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(COOKIE_NAME+'='))?.slice(COOKIE_NAME.length+1);
    if(value) sessions.delete(value);
    res.writeHead(303, {'Location':'/', 'Set-Cookie':`${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`});
    return res.end();
  }
  proxy(req,res);
});
server.listen(listen.port,listen.hostname,()=>{
  console.log(`HW03 gate: http://${listen.hostname}:${listen.port} -> http://${target.hostname}:${target.port}`);
  console.log('Chỉ công bố qua ngrok HTTPS: ngrok http 5518');
  console.log('Mật khẩu bảo vệ không được ghi vào file hoặc Git.');
});
