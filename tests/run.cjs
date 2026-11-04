const fs = require('fs');
const path = require('path');
const net = require('net');
const tls = require('tls');

// Unit tests must not inherit working service credentials or open network connections.
for (const key of Object.keys(process.env)) {
  if (/^(DATABASE_URL|NEXTAUTH_|S3_UPLOAD_|SHOPIFY_|SENTRY_|NEXT_PUBLIC_SENTRY_)/.test(key)) {
    delete process.env[key];
  }
}
process.env.DATABASE_URL = 'postgresql://unit:unit@127.0.0.1:1/unit';
process.env.NODE_ENV = 'test';
const denyNetwork = () => {
  throw new Error('Network access is disabled in unit tests');
};
net.Socket.prototype.connect = denyNetwork;
tls.connect = denyNetwork;

require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'commonjs', jsx: 'react-jsx' },
});
require('tsconfig-paths/register');

async function main() {
  const directory = path.join(__dirname, 'unit');
  const files = fs
    .readdirSync(directory)
    .filter(file => file.endsWith('.test.ts'))
    .sort();
  if (!files.length) throw new Error('No unit tests found');
  for (const file of files) {
    await require(path.join(directory, file)).default();
    process.stdout.write(`PASS ${file}\n`);
  }
  process.stdout.write(`Passed ${files.length} regression suites\n`);
}
main().catch(error => {
  process.stderr.write(`${error.stack || error}\n`);
  process.exitCode = 1;
});
