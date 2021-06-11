import { meta } from '@lib/meta/resolvers'; // Metadata resolvers
import { employees, createEmployee } from '@lib/employees/resolvers'; // Employee resolvers
import { IFieldResolver } from 'graphql-tools'; // GraphQL field resolver
import { Context } from '@lib/context'; // Context type

// Resolver type
export type Resolver<P = undefined> = IFieldResolver<P, Context>;

const resolvers = {
  Query: {
    meta,
    employees,
  },
  Mutation: {
    createEmployee,
  },
};

export default resolvers;
