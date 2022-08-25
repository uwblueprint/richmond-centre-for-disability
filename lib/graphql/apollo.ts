import { ApolloServer, makeExecutableSchema } from 'apollo-server-micro'; // Apollo server
import typeDefs from '@lib/graphql/type-defs'; // Typedefs
import resolvers from '@lib/graphql/resolvers'; // Resolvers
import context from '@lib/graphql/context'; // GraphQL context
import { applyMiddleware } from 'graphql-middleware';
import loggingMiddleware from '@lib/graphql/middleware/logging';

const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs,
    resolvers,
  }),
  loggingMiddleware
);

export const apolloServer = new ApolloServer({
  schema,
  playground: {
    settings: {
      'schema.polling.enable': false, // Disable infinite schema introspection
      'request.credentials': 'include', // Include auth token in requests
    },
  },
  introspection: process.env.NODE_ENV !== 'production',
  context,
});
