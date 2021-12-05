const { i18n } = require('./next-i18next.config'); // Internationalization

module.exports = {
  i18n,
  env: {
    STOREFRONT_ACCESS_TOKEN: process.env.STOREFRONT_ACCESS_TOKEN,
  },
};
