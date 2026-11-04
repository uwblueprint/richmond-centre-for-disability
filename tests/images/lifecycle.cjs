const assert = require('assert/strict');
const http = require('http');
const path = require('path');

async function main() {
  process.env.NEXT_TELEMETRY_DISABLED = '1';
  process.env.SENTRY_DSN = '';
  process.env.NEXT_PUBLIC_SENTRY_DSN = '';
  const app = require('next')({ dev: false, dir: path.join(__dirname, 'fixture') });
  await app.prepare();
  const handler = app.getRequestHandler();
  const sockets = new Set();
  let active = 0;
  const server = http.createServer(async (req, res) => {
    active++;
    try {
      await handler(req, res);
    } catch (error) {
      res.statusCode = 500;
      res.end('Synthetic fixture error');
    } finally {
      active--;
    }
  });
  server.on('connection', socket => {
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const optimized = name => `/_next/image?url=${encodeURIComponent(name)}&w=96&q=75`;
  const request = (pathname, method = 'GET', cancel = false) =>
    new Promise((resolve, reject) => {
      let cancellation;
      const req = http.request(new URL(pathname, origin), { method }, res => {
        let bytes = 0;
        res.on('data', chunk => {
          bytes += chunk.length;
        });
        res.on('end', () => {
          clearInterval(cancellation);
          resolve({ status: res.statusCode, bytes });
        });
      });
      req.setTimeout(5000, () => req.destroy(new Error('Image lifecycle deadline exceeded')));
      req.on('error', error => {
        clearInterval(cancellation);
        cancel ? resolve({ cancelled: true }) : reject(error);
      });
      req.end();
      if (cancel)
        cancellation = setInterval(() => {
          if (active) {
            clearInterval(cancellation);
            req.destroy(new Error('Synthetic client cancellation'));
          }
        }, 1);
    });
  try {
    for (const method of ['GET', 'HEAD']) {
      for (const name of ['/missing.svg', '/missing.png', '/not-an-image.txt']) {
        const result = await request(optimized(name), method);
        assert.ok(result.status >= 400 && result.status < 500);
        if (method === 'HEAD') assert.equal(result.bytes, 0);
      }
    }
    const same = optimized('/same-key-missing.png');
    const pair = await Promise.all([request(same), request(same)]);
    assert.ok(pair.every(result => result.status >= 400));
    assert.equal((await request(optimized('/api/delayed'), 'GET', true)).cancelled, true);
    assert.ok((await request(optimized('/api/delayed'))).status >= 400);
    assert.equal((await request(optimized('/valid.svg'))).status, 200);
    assert.equal((await request(optimized('/api/pixel'))).status, 200);
    assert.equal((await request('/missing.svg')).status, 404);
    assert.equal(
      (await request('/_next/image?url=https%3A%2F%2Fexample.invalid%2Fx.png&w=96&q=75')).status,
      400
    );
    await new Promise(resolve => setTimeout(resolve, 100));
    assert.equal(active, 0);
    process.stdout.write(
      'PASS built Next image GET/HEAD/errors/concurrency/cancellation and handler completion\n'
    );
  } finally {
    for (const socket of sockets) socket.destroy();
    await new Promise(resolve => server.close(resolve));
    await app.close();
  }
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    process.stderr.write(`${error.stack}\n`);
    process.exit(1);
  });
