import { ApolloServer, makeExecutableSchema } from 'apollo-server-micro'; // Apollo server
import typeDefs from '@lib/graphql/type-defs'; // Typedefs
import resolvers from '@lib/graphql/resolvers'; // Resolvers

const schema = makeExecutableSchema({ typeDefs, resolvers });

export const apolloServer = new ApolloServer({
  schema,
  playground: {
    settings: {
      'schema.polling.enable': false, // Disable infinite schema introspection
    },
  },
});
