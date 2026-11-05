import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  ...(process.env.NEXT_PUBLIC_SENTRY_RELEASE
    ? { release: process.env.NEXT_PUBLIC_SENTRY_RELEASE }
    : {}),
  sendDefaultPii: false,
  enabled: true,
});
