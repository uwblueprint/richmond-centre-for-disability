const assert = require('assert/strict');

require('net').Socket.prototype.connect = () => {
  throw new Error('Network access is disabled in pagination tests');
};
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'commonjs' },
});
const { getSearchPagination } = require('../lib/utils/pagination');

for (const filter of [undefined, null, {}, { limit: null, offset: null }]) {
  assert.deepEqual(getSearchPagination(filter), { take: 20, skip: 0 });
}
for (const limit of [1, 20, 100]) {
  assert.deepEqual(getSearchPagination({ limit, offset: 40 }), { take: limit, skip: 40 });
}
for (const limit of [0, -1, 101, 1.5, NaN, Infinity, '20']) {
  assert.throws(() => getSearchPagination({ limit }), /limit must be/);
}
for (const offset of [-1, 1.5, NaN, Infinity, '0']) {
  assert.throws(() => getSearchPagination({ offset }), /offset must be/);
}
process.stdout.write('PASS search pagination defaults, bounds and validation\n');
