const assert = require('assert/strict');
const http = require('http');

function request(target, pathname, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = http.request(new URL(pathname, target), { method }, res => {
      let bytes = 0;
      res.on('data', chunk => {
        bytes += chunk.length;
      });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, bytes }));
    });
    req.setTimeout(5000, () => req.destroy(new Error('Local static-image deadline exceeded')));
    req.on('error', reject);
    req.end();
  });
}
async function main() {
  const target = new URL(process.env.RCD_TEST_URL || 'http://127.0.0.1:3212');
  assert.equal(target.hostname, '127.0.0.1');
  assert.equal(target.protocol, 'http:');
  for (const method of ['GET', 'HEAD']) {
    for (const name of ['logo.png', 'logo.svg', 'logo-web-v1.png', 'wallet-card-example.png']) {
      const result = await request(
        target,
        `/_next/image?url=${encodeURIComponent(`/assets/${name}`)}&w=3840&q=75`,
        method
      );
      assert.equal(result.status, 307);
      const destination = new URL(result.headers.location, target);
      assert.equal(destination.origin, target.origin);
      assert.equal(
        destination.pathname,
        name === 'wallet-card-example.png'
          ? '/assets/wallet-card-example.png'
          : '/assets/logo-web-v1.png'
      );
      const asset = await request(target, destination.pathname, method);
      assert.equal(asset.status, 200);
      assert.match(asset.headers['content-type'], /^image\/png/);
      if (method === 'GET' && name !== 'wallet-card-example.png')
        assert.ok(asset.bytes < 100 * 1024);
      if (method === 'HEAD') assert.equal(asset.bytes, 0);
    }
  }
  assert.equal((await request(target, '/assets/logo.svg')).status, 307);
  process.stdout.write('PASS built-server static images and legacy optimizer GET/HEAD redirects\n');
}
main().catch(error => {
  process.stderr.write(`${error.stack}\n`);
  process.exitCode = 1;
});
