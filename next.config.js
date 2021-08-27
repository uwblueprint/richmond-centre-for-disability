const { i18n } = require('./next-i18next.config'); // Internationalization

module.exports = {
  i18n,
  // Required for Netlify build. https://github.com/vercel/next.js/issues/20487#issuecomment-753884085
  target: 'experimental-serverless-trace',
};
