import { apolloServer } from '@lib/graphql/apollo'; // Apollo server
import '@/sentry.server.config'; // Sentry Client

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api/graphql' });
