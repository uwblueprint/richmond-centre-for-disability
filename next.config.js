const { i18n } = require('./next-i18next.config'); // Internationalization
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  i18n,
  async redirects() {
    // Cached clients can still request the old optimized logo. Redirect before image workers run.
    return [
      {
        source: '/_next/image',
        has: [
          {
            type: 'query',
            key: 'url',
            value: '/assets/(?:logo\\.png|logo\\.svg|logo-web-v1\\.png)',
          },
        ],
        destination: '/assets/logo-web-v1.png',
        permanent: false,
        locale: false,
      },
      {
        source: '/_next/image',
        has: [{ type: 'query', key: 'url', value: '/assets/wallet-card-example\\.png' }],
        destination: '/assets/wallet-card-example.png',
        permanent: false,
        locale: false,
      },
      {
        source: '/assets/logo.svg',
        destination: '/assets/logo-web-v1.png',
        permanent: false,
        locale: false,
      },
    ];
  },
};

module.exports = withSentryConfig(nextConfig, { silent: true });
