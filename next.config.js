const withImages = require('next-images'); // Allow using imported images in the src attribute
const { i18n } = require('./next-i18next.config'); // Internationalization

module.exports = withImages({ i18n });
