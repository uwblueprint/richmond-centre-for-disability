const path = require('path');

module.exports = {
  experimental: { externalDir: true },
  webpack(config) {
    // Treat the imported real components as first-party issuers for Next 12's package CSS rules.
    const allowSourceIssuers = rules => {
      for (const rule of rules) {
        if (rule.issuer?.and?.includes(__dirname)) {
          rule.issuer.and = [path.resolve(__dirname, '../../..')];
        }
        if (rule.oneOf) allowSourceIssuers(rule.oneOf);
        if (rule.rules) allowSourceIssuers(rule.rules);
      }
    };
    allowSourceIssuers(config.module.rules);
    return config;
  },
};
