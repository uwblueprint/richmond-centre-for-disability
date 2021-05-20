import { apolloServer } from '@lib/graphql/apollo'; // Apollo server

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api/graphql' });
