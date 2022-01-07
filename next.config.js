const { i18n } = require('./next-i18next.config'); // Internationalization

module.exports = {
  i18n,
  env: {
    SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    SHOPIFY_PERMIT_PRODUCT_ID: process.env.SHOPIFY_PERMIT_PRODUCT_ID,
    SHOPIFY_DOMAIN: process.env.SHOPIFY_DOMAIN,
  },
};
