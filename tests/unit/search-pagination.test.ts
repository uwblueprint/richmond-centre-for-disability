import assert from 'assert';
import { graphql } from 'graphql';
import { makeExecutableSchema } from 'apollo-server-micro';
import { getSearchPagination } from '@lib/utils/pagination';
import { SEARCH_PAGE_SIZE, MAX_SEARCH_PAGE_SIZE } from '@lib/utils/search-limits';
import { applicants } from '@lib/applicants/resolvers';
import { physicians } from '@lib/physicians/resolvers';
import { authorize } from '@lib/graphql/authorization';
import { initialTypeaheadState, typeaheadSearchReducer } from '@tools/hooks/typeahead-state';

export default async function (): Promise<void> {
  for (const input of [undefined, null, {}, { limit: null, offset: null }]) {
    assert.deepEqual(getSearchPagination(input), { take: SEARCH_PAGE_SIZE, skip: 0 });
  }
  for (const limit of [1, SEARCH_PAGE_SIZE, MAX_SEARCH_PAGE_SIZE]) {
    assert.deepEqual(getSearchPagination({ limit, offset: 40 }), { take: limit, skip: 40 });
  }
  for (const limit of [0, -1, 101, 1.5, NaN, Infinity, '20']) {
    assert.throws(() => getSearchPagination({ limit } as any), /limit must be/);
  }
  for (const offset of [-1, 1.5, Infinity, NaN, '0']) {
    assert.throws(() => getSearchPagination({ offset } as any), /offset must be/);
  }

  const calls: Array<{ method: string; args: any }> = [];
  const model = {
    count: async (args: any) => {
      calls.push({ method: 'count', args });
      return 14712;
    },
    findMany: async (args: any) => {
      calls.push({ method: 'findMany', args });
      return [{ id: 4, firstName: 'Synthetic', lastName: 'Holder', mspNumber: '4' }];
    },
  };
  const context: any = {
    prisma: { applicant: model, physician: model },
    session: { role: 'ADMIN' },
  };
  for (const resolver of [applicants, physicians]) {
    for (const filter of [undefined, null, {}, { limit: null }, { search: '', mspNumber: '' }]) {
      calls.length = 0;
      const result: any = await resolver(undefined, { filter } as any, context, {} as any);
      assert.equal(result.totalCount, 14712);
      assert.equal(result.result.length, 1);
      assert.equal(calls[1].args.take, SEARCH_PAGE_SIZE);
      assert.equal(calls[1].args.skip, 0);
    }
    for (const filter of [{ limit: 0 }, { limit: 101 }, { offset: -1 }]) {
      calls.length = 0;
      await assert.rejects(async () => resolver(undefined, { filter } as any, context, {} as any));
      assert.equal(calls.length, 0);
    }
    calls.length = 0;
    await resolver(undefined, { filter: { limit: 20, offset: 40 } } as any, context, {} as any);
    assert.equal(calls[1].args.take, 20);
    assert.equal(calls[1].args.skip, 40);
  }
  calls.length = 0;
  await applicants(undefined, { filter: { search: '4' } } as any, context, {} as any);
  assert.equal(calls[1].args.where.id, 4);
  assert.deepEqual(calls[1].args.orderBy.at(-1), { id: 'asc' });
  calls.length = 0;
  await physicians(undefined, { filter: { mspNumber: '4' } } as any, context, {} as any);
  assert.deepEqual(calls[1].args.where, { mspNumber: { contains: '4' } });
  assert.deepEqual(calls[1].args.orderBy, { mspNumber: 'asc' });

  const schema = makeExecutableSchema({
    typeDefs: `input Filter { limit: Int offset: Int search: String }
      type Holder { id: Int! } type Page { result: [Holder!]! totalCount: Int! }
      type Query { applicants(filter: Filter): Page }`,
    resolvers: { Query: { applicants: authorize(applicants, ['SECRETARY']) } },
  });
  for (const role of ['ADMIN', 'SECRETARY']) {
    const result = await graphql({
      schema,
      source: '{ applicants { totalCount result { id } } }',
      contextValue: { ...context, session: { role } },
    });
    assert.equal(result.errors, undefined);
    assert.equal((result.data as any).applicants.totalCount, 14712);
  }
  calls.length = 0;
  const denied = await graphql({
    schema,
    source: '{ applicants { totalCount } }',
    contextValue: { ...context, session: null },
  });
  assert.equal(denied.data?.applicants, null);
  assert.equal(calls.length, 0);
  for (const limit of ['0', '101', '1.5']) {
    calls.length = 0;
    const invalid = await graphql({
      schema,
      source: `{ applicants(filter: {limit: ${limit}}) { totalCount } }`,
      contextValue: context,
    });
    assert.ok(invalid.errors?.length);
    assert.equal(calls.length, 0);
  }

  const reduce = typeaheadSearchReducer;
  let state = reduce(initialTypeaheadState, { type: 'input', value: '4' });
  assert.equal(state.search, '');
  state = reduce(state, { type: 'search', value: '4' });
  assert.equal(state.search, '4');
  state = reduce(state, { type: 'page', offset: 20 });
  assert.equal(state.offset, 20);
  state = reduce(state, { type: 'input', value: 'Other' });
  assert.equal(state.search, '');
  assert.equal(state.offset, 0);
  assert.deepEqual(reduce(state, { type: 'search', value: '4' }), state);
  state = reduce(state, { type: 'input', value: '   ' });
  assert.equal(reduce(state, { type: 'search', value: '   ' }).search, '');
  state = reduce(state, { type: 'input', value: '' });
  assert.deepEqual(state, initialTypeaheadState);
  assert.deepEqual(reduce(state, { type: 'page', offset: 20 }), state);
}
