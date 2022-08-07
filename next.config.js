const { i18n } = require('./next-i18next.config'); // Internationalization

module.exports = {
  i18n,
  async redirects() {
    const redirects = [];

    if (process.env.NODE_ENV !== 'development') {
      // Disable GraphQL playground in production
      redirects.push({
        source: '/api/graphql',
        destination: '/',
        permanent: true,
      });
    }

    return redirects;
  },
};
