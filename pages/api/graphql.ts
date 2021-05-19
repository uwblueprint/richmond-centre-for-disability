import { apolloServer } from "@lib/resolvers"; // Apollo server

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
