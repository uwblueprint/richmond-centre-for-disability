const { i18n } = require('./next-i18next.config'); // Internationalization
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  i18n,
  async rewrites() {
    // Next 12 excludes /_next from redirects; beforeFiles rewrites precede its image handler.
    return {
      beforeFiles: [
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
        },
        {
          source: '/_next/image',
          has: [{ type: 'query', key: 'url', value: '/assets/wallet-card-example\\.png' }],
          destination: '/assets/wallet-card-example.png',
        },
        {
          source: '/assets/logo.svg',
          destination: '/assets/logo-web-v1.png',
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

module.exports = withSentryConfig(nextConfig, { silent: true });
