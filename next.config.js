const { i18n } = require('./next-i18next.config'); // Internationalization
const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = {
  i18n,
};

module.exports = withSentryConfig(
  nextConfig,
  { silent: true } // Sentry options
);

module.exports = {
  i18n,
};
