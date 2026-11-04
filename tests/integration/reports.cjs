const assert = require('assert/strict');
const path = require('path');
const net = require('net');
const tls = require('tls');

async function main() {
  const value = process.env.RCD_REPORT_TEST_DATABASE_URL;
  if (!value)
    throw new Error('Set RCD_REPORT_TEST_DATABASE_URL to an approved isolated local clone');
  const url = new URL(value);
  assert.equal(url.protocol, 'postgresql:');
  assert.equal(url.hostname, '127.0.0.1');
  assert.match(url.pathname, /^\/rcd_(?:memory_work\d*|report_test_[a-z0-9_]+)$/);
  // Do not permit query-string host/socket overrides or inherit another service configuration.
  url.search = '?connection_limit=1';
  for (const key of Object.keys(process.env)) {
    if (/^(DATABASE_URL|S3_UPLOAD_|SHOPIFY_|SENTRY_|NEXT_PUBLIC_SENTRY_)/.test(key))
      delete process.env[key];
  }
  process.env.DATABASE_URL = url.href;
  process.env.NEXT_PUBLIC_LOCAL_TIMEZONE = 'America/Vancouver';
  process.env.NODE_ENV = 'test';
  const denyNetwork = () => {
    throw new Error('Only the explicitly configured native local database client is allowed');
  };
  net.Socket.prototype.connect = denyNetwork;
  tls.connect = denyNetwork;
  require('ts-node').register({ transpileOnly: true, compilerOptions: { module: 'commonjs' } });
  require('tsconfig-paths').register({
    baseUrl: path.resolve(__dirname, '../..'),
    paths: require('../../tsconfig.json').compilerOptions.paths,
  });
  const { PrismaClient } = require('@prisma/client');
  const parser = require('csv-parser');
  const s3 = require('../../lib/utils/s3-utils');
  const reports = require('../../lib/reports/resolvers');
  const columns = require('../../tools/admin/reports');
  const prisma = new PrismaClient({
    datasources: { db: { url: url.href } },
    log: [{ level: 'query', emit: 'event' }],
  });
  let maximumBindPosition = 0;
  prisma.$on('query', event => {
    const positions = Array.from(event.query.matchAll(/\$(\d+)/g), match => Number(match[1]));
    if (positions.length) maximumBindPosition = Math.max(maximumBindPosition, ...positions);
  });
  const outputs = [];
  s3.serverUploadToS3 = async (body, key) => {
    let rowCount = 0;
    for await (const row of body.pipe(parser())) {
      assert.ok(Object.keys(row).length);
      rowCount++;
    }
    outputs.push({ rowCount });
    return { key };
  };
  s3.getSignedUrlForS3 = () => 'https://synthetic.invalid/local-artifact';
  try {
    await prisma.$executeRawUnsafe('SET default_transaction_read_only = on');
    assert.equal(
      (await prisma.$queryRawUnsafe('SHOW default_transaction_read_only'))[0]
        .default_transaction_read_only,
      'on'
    );
    const pid = (await prisma.$queryRawUnsafe('select pg_backend_pid() as pid'))[0].pid;
    const input = {
      startDate: new Date('1990-01-01'),
      endDate: new Date('2040-12-31'),
      columns: columns.APPLICATIONS_COLUMNS.map(item => item.value),
    };
    const expected = await prisma.application.findMany({
      where: { createdAt: { gte: input.startDate, lt: new Date('2041-01-01') } },
      select: { id: true },
      orderBy: { id: 'asc' },
    });
    assert.ok(
      expected.length > 32767,
      'Fixture needs more than 32767 applications to cover the reproduced boundary'
    );
    const seen = [];
    let applicationBatches = 0;
    const original = prisma.application.findMany.bind(prisma.application);
    prisma.application.findMany = async args => {
      assert.ok(args.take <= 2000);
      const rows = await original(args);
      seen.push(...rows.map(row => row.id));
      applicationBatches++;
      return rows;
    };
    const context = { prisma, session: { id: 1, role: 'ADMIN' }, logger: { error: () => {} } };
    const started = Date.now();
    assert.equal(
      (await reports.generateApplicationsReport(undefined, { input }, context, {})).ok,
      true
    );
    assert.deepEqual(
      seen,
      expected.map(row => row.id)
    );
    assert.equal(outputs[0].rowCount, expected.length);
    const holderCount = await prisma.applicant.count({
      where: {
        permits: { some: { expiryDate: { gte: input.startDate, lt: new Date('2041-01-01') } } },
      },
    });
    assert.equal(
      (
        await reports.generatePermitHoldersReport(
          undefined,
          { input: { ...input, columns: columns.PERMIT_HOLDERS_COLUMNS.map(item => item.value) } },
          context,
          {}
        )
      ).ok,
      true
    );
    assert.equal(outputs[1].rowCount, holderCount);
    assert.equal((await prisma.$queryRawUnsafe('select pg_backend_pid() as pid'))[0].pid, pid);
    assert.ok(maximumBindPosition <= 2001);
    process.stdout.write(
      `${JSON.stringify(
        {
          applicationRows: expected.length,
          applicationBatches,
          holderRows: holderCount,
          maximumBindPosition,
          readOnlySession: true,
          durationMs: Date.now() - started,
        },
        null,
        2
      )}\n`
    );
  } finally {
    await prisma.$disconnect();
  }
}
main().catch(error => {
  process.stderr.write(`Report integration failed: ${error.name} ${error.code || ''}\n`);
  process.exitCode = 1;
});
