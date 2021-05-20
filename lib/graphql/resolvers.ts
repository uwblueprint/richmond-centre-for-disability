import { metaQueries } from '@lib/meta/resolvers'; // Metadata resolvers

const resolvers = {
  Query: {
    meta: metaQueries,
  },
};

export default resolvers;
