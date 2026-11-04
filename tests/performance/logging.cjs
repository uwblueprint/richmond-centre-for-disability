require('ts-node').register({ transpileOnly: true, compilerOptions: { module: 'commonjs' } });
require('tsconfig-paths/register');
const assert = require('assert/strict');
const { createHook } = require('async_hooks');
const { graphql } = require('graphql');
const { makeExecutableSchema } = require('apollo-server-micro');
const { applyMiddleware } = require('graphql-middleware');
const middleware = require('../../lib/graphql/middleware/logging').default;
require('../../lib/utils/logging').default.level = 'silent';

async function main() {
  const rows = Array.from({ length: 1000 }, (_, id) => ({
    id,
    a: 'Synthetic',
    b: 'Synthetic',
    c: 'Synthetic',
  }));
  const legacyNested = (resolve, root, args, context, info) =>
    info.path.prev
      ? (async () => await resolve(root, args, context, info))()
      : middleware(resolve, root, args, context, info);
  const counts = {};
  for (const [label, wrapper] of [
    ['legacy-nested', legacyNested],
    ['synchronous-nested', middleware],
  ]) {
    let promises = 0;
    const hook = createHook({
      init(_id, type) {
        if (type === 'PROMISE') promises++;
      },
    });
    const schema = applyMiddleware(
      makeExecutableSchema({
        typeDefs:
          'type Row { id: Int! a: String b: String c: String } type Query { rows: [Row!]! }',
        resolvers: { Query: { rows: () => rows } },
      }),
      wrapper
    );
    hook.enable();
    try {
      const result = await graphql({ schema, source: '{ rows { id a b c } }' });
      assert.equal(result.errors, undefined);
      assert.equal(result.data.rows.length, rows.length);
    } finally {
      hook.disable();
    }
    counts[label] = promises;
  }
  assert.ok(counts['synchronous-nested'] < counts['legacy-nested']);
  process.stdout.write(
    `${JSON.stringify(
      {
        syntheticRows: rows.length,
        promiseInitializations: counts,
        scope: 'microbenchmark, not full-app RSS or production capacity',
      },
      null,
      2
    )}\n`
  );
}
main().catch(error => {
  process.stderr.write(`${error.stack}\n`);
  process.exitCode = 1;
});
