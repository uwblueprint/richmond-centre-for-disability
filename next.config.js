const { i18n } = require('./next-i18next.config'); // Internationalization

module.exports = {
  i18n,
  target: 'serverless', // Create standalone serverless function for applicable pages
};
