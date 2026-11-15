// Runs before Vite's /api proxy and sees only requests to this disposable sandbox.
function safariTraffic(getPage, origin, isLocal) {
  return {
    name: 'hw03-safari-traffic',
    configurePreviewServer({ middlewares }) {
      middlewares.use((incoming, outgoing, next) => {
        const page = getPage();
        const path = incoming.url.split('?')[0];
        if (page && incoming.method === 'GET' && path === '/__hw03_viewport') {
          const params = new URL(incoming.url, origin).searchParams;
          const width = Number(params.get('width'));
          const height = Number(params.get('height'));
          if (!Number.isInteger(width) || !Number.isInteger(height) || width < 320 || width > 1600 || height < 500 || height > 1000) {
            outgoing.statusCode = 400;
            return outgoing.end();
          }
          outgoing.setHeader('Content-Type', 'text/html; charset=utf-8');
          outgoing.setHeader('Cache-Control', 'no-store');
          return outgoing.end(`<!doctype html><title>HW03 Safari CSS viewport</title><iframe title="EShop" src="/" style="display:block;border:0;width:${width}px;height:${height}px"></iframe>`);
        }
        if (!page || !path.startsWith('/api/')) return next();
        const request = { url: () => `${isLocal ? 'http://127.0.0.1:8080' : origin}${incoming.url}`, method: () => incoming.method };
        page.emit('request', request);
        const complete = () => {
          if (!['/api/login', '/api/admin/users'].includes(path)) {
            const chunks = [];
            for (const method of ['write', 'end']) {
              const send = outgoing[method];
              outgoing[method] = function (chunk, encoding, ...rest) {
                if (typeof chunk === 'string') chunks.push(Buffer.from(chunk, typeof encoding === 'string' ? encoding : 'utf8'));
                else if (Buffer.isBuffer(chunk) || chunk instanceof Uint8Array) chunks.push(Buffer.from(chunk));
                return send.call(this, chunk, encoding, ...rest);
              };
            }
            outgoing.once('finish', () => page.emit('response', {
              url: request.url, request: () => request, status: () => outgoing.statusCode,
              ok: () => outgoing.statusCode >= 200 && outgoing.statusCode < 300,
              json: async () => JSON.parse(Buffer.concat(chunks).toString('utf8')),
              finished: async () => null,
            }));
          }
          outgoing.once('finish', () => page.diagnostics.push({ method: incoming.method, path, status: outgoing.statusCode }));
          next();
        };
        const handler = page.routeFor(path);
        if (!handler) return complete();
        const abort = () => {
          // Safari rejects port 1 before connecting. Proxy socket resets reach Safari as HTTP 5xx through Sauce.
          const blockedDestination = new URL(path, origin);
          blockedDestination.port = '1';
          outgoing.writeHead(307, { Location: blockedDestination.href, 'Cache-Control': 'no-store' });
          outgoing.end();
          page.diagnostics.push({ method: incoming.method, path, effect: 'sandbox-redirect-to-browser-blocked-port', backendReached: false });
          page.emit('requestfailed', request);
        };
        Promise.resolve(handler({ request: () => request, continue: complete, abort })).catch(() => {
          if (!outgoing.headersSent && !outgoing.destroyed) abort();
        });
      });
    },
  };
}

module.exports = { safariTraffic };
