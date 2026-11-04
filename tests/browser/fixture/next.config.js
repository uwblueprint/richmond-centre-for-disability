const path = require('path');

const source = process.env.RCD_TEST_SOURCE;
if (!source || !path.isAbsolute(source)) throw new Error('Missing absolute RCD_TEST_SOURCE');

module.exports = {
  experimental: { externalDir: true },
  webpack(config) {
    // Imported application components are first-party issuers for Next 12's global CSS rules.
    const allowSourceIssuers = rules => {
      for (const rule of rules) {
        if (rule.issuer?.and?.includes(__dirname)) rule.issuer.and = [source];
        if (rule.oneOf) allowSourceIssuers(rule.oneOf);
        if (rule.rules) allowSourceIssuers(rule.rules);
      }
    };
    allowSourceIssuers(config.module.rules);
    return config;
  },
};
