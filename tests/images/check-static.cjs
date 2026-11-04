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
      assert.equal(result.status, 200);
      assert.match(result.headers['content-type'], /^image\/png/);
      assert.equal(result.headers['content-disposition'], undefined);
      if (method === 'GET' && name !== 'wallet-card-example.png')
        assert.ok(result.bytes < 100 * 1024);
      if (method === 'HEAD') assert.equal(result.bytes, 0);
    }
  }
  assert.equal((await request(target, '/assets/logo.svg')).status, 200);
  process.stdout.write('PASS built-server static images and legacy optimizer GET/HEAD rewrites\n');
}
main().catch(error => {
  process.stderr.write(`${error.stack}\n`);
  process.exitCode = 1;
});
