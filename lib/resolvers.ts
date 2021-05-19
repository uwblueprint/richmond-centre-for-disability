import { ApolloServer } from "apollo-server-micro"; // Apollo server micro
import { typeDefs } from "@lib/schema"; // Type definitions

const resolvers = {
  Query: {
    sayHello() {
      return "Hello World!";
    },
  },
};

export const apolloServer = new ApolloServer({ typeDefs, resolvers });
