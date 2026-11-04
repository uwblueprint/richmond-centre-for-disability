import assert from 'assert';
import { graphql } from 'graphql';
import { makeExecutableSchema } from 'apollo-server-micro';
import { applyMiddleware } from 'graphql-middleware';
import middleware from '@lib/graphql/middleware/logging';
import logger from '@logging';
import { authorize } from '@lib/graphql/authorization';

export default async function (): Promise<void> {
  const logs: Array<{ level: string; data: any; message: string }> = [];
  const originalInfo = logger.info;
  const originalError = logger.error;
  const originalLevel = logger.level;
  logger.level = 'info';
  logger.info = ((data: any, message: string) =>
    logs.push({ level: 'info', data, message })) as any;
  logger.error = ((data: any, message: string) =>
    logs.push({ level: 'error', data, message })) as any;
  try {
    const context = { marker: 'synthetic' };
    const root: any = {
      path: { key: 'holder' },
      fieldName: 'holder',
      operation: { name: { value: 'Synthetic' } },
    };
    const nested: any = { ...root, path: { key: 'name', prev: root.path } };
    const resolve = (_root: any, _args: any, received: any) => {
      assert.equal(received, context);
      return 42;
    };
    assert.equal(middleware(resolve, undefined, {}, context, nested), 42);
    const promise = Promise.resolve(43);
    assert.equal(
      middleware(() => promise, undefined, {}, context, nested),
      promise
    );
    const error = new Error('Synthetic failure');
    assert.throws(
      () =>
        middleware(
          () => {
            throw error;
          },
          undefined,
          {},
          context,
          nested
        ),
      value => value === error
    );
    await assert.rejects(
      middleware(() => Promise.reject(error), undefined, {}, context, nested) as Promise<any>,
      value => value === error
    );
    assert.equal(logs.length, 0);
    assert.equal(
      await middleware(resolve, undefined, { private: 'must-not-be-logged' }, context, root),
      42
    );
    assert.deepEqual(
      logs.map(item => item.message),
      ['START: Synthetic', 'FINISH: Synthetic']
    );
    assert.equal(logs[0].data.args, undefined);
    assert.ok(Number.isFinite(logs[1].data.durationMs));
    logs.length = 0;
    await assert.rejects(
      middleware(
        () => {
          throw error;
        },
        undefined,
        {},
        context,
        root
      ) as Promise<any>,
      value => value === error
    );
    assert.deepEqual(
      logs.map(item => item.message),
      ['START: Synthetic', 'ERROR: Synthetic']
    );
    assert.equal(logs[1].data.error.message, error.message);

    const schema = applyMiddleware(
      makeExecutableSchema({
        typeDefs: `type Holder { name: String! nullable: String }
        type Query { holder: Holder denied: Holder failed: Holder }`,
        resolvers: {
          Query: {
            holder: authorize(async () => ({ name: 'Synthetic', nullable: null }), ['SECRETARY']),
            denied: authorize(async () => ({ name: 'Denied' })),
            failed: () => Promise.reject(error),
          },
        },
      }),
      middleware
    );
    logs.length = 0;
    const result = await graphql({
      schema,
      source:
        'query Aliased { first: holder { ...Fields } second: holder { name } denied { name } failed { name } } fragment Fields on Holder { name nullable }',
      contextValue: { session: { role: 'SECRETARY' } },
    });
    assert.equal((result.data as any).first.name, 'Synthetic');
    assert.equal((result.data as any).first.nullable, null);
    assert.equal(result.data?.denied, null);
    assert.equal(result.data?.failed, null);
    assert.equal(result.errors?.[0].originalError, error);
    assert.equal(logs.filter(item => item.message.startsWith('START')).length, 4);
    assert.equal(logs.filter(item => item.message.startsWith('FINISH')).length, 3);
    assert.equal(logs.filter(item => item.message.startsWith('ERROR')).length, 1);
  } finally {
    logger.info = originalInfo;
    logger.error = originalError;
    logger.level = originalLevel;
  }
}
