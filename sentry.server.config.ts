import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment:
    process.env.SENTRY_ENVIRONMENT ||
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ||
    process.env.NODE_ENV,
  ...(process.env.SENTRY_RELEASE ||
  process.env.SOURCE_VERSION ||
  process.env.NEXT_PUBLIC_SENTRY_RELEASE
    ? {
        release:
          process.env.SENTRY_RELEASE ||
          process.env.SOURCE_VERSION ||
          process.env.NEXT_PUBLIC_SENTRY_RELEASE,
      }
    : {}),
  sendDefaultPii: false,
  enabled: true,
});
