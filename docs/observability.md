# RCD Observability Checks

This change makes deployment identity explicit. It does not prove event delivery, fix memory
consumption, add event capture, or change the existing 10% trace sample rate.
`SENTRY_TRACES_SAMPLE_RATE` was never read by these configurations and is no longer advertised in
the sample environment file.

## Configuration

| Setting     | Browser                                             | Server                                                                                     |
| ----------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| DSN         | `NEXT_PUBLIC_SENTRY_DSN`                            | `SENTRY_DSN`, then public DSN                                                              |
| Environment | `NEXT_PUBLIC_SENTRY_ENVIRONMENT`, then `NODE_ENV`   | `SENTRY_ENVIRONMENT`, then public environment, then `NODE_ENV`                             |
| Release     | `NEXT_PUBLIC_SENTRY_RELEASE`, otherwise SDK default | `SENTRY_RELEASE`, then Heroku `SOURCE_VERSION`, then public release, otherwise SDK default |

Set both environment variables to the intended deployment name (for example, `staging` or
`production`). `NODE_ENV=production` alone cannot distinguish those deployments. If setting release
explicitly, use the same immutable source revision for browser, server, and uploaded source maps.

Next embeds `NEXT_PUBLIC_*` values in browser JavaScript **during build**. Changing runtime
variables or restarting an existing slug cannot repair a missing browser DSN. Slug promotion can
also preserve the source environment's browser settings; verify the actual production build
configuration rather than assuming runtime configuration rewrites the bundle. Never put auth tokens
in public variables. Source-map upload credentials (`SENTRY_AUTH_TOKEN`, organization/project
settings) are separate from the DSNs used to send events. Do not print either in build logs.

Both initializers explicitly disable default PII collection. This is not complete redaction:
exception messages, application attachments, URLs, breadcrumbs, and manually supplied context may
still contain sensitive information. Do not add raw GraphQL inputs, applicant details, or
production-derived test events.

## Read-Only Production Verification

- Better Stack source supplied by the maintainer:
  <https://telemetry.betterstack.com/team/t57645/tail?s=l183396>. Confirm its source name/app labels
  really identify `rcd-production` and its retention period; a URL alone does not establish the
  current logging drain.
- Heroku Git remote `https://git.heroku.com/rcd-production.git` identifies the app, not its logs or
  deployment identity. Use existing dashboard/CLI read access to inspect release, dyno size, memory
  quota, process count, drain, H12 and R14 events. Do not restart, scale, change config, or run test
  requests in production.
- Ask the project owner for the Sentry organization/project URL and access. Find existing browser
  **and** server events and check their SDK/platform, environment, immutable release, timestamps,
  and readable source-mapped stack traces. A server event does not establish that the browser bundle
  is configured, and vice versa.
- Correlate existing H12/R14 timestamps with route, status, dyno, request ID where present, and
  memory metrics. Do not export patient payloads or authenticated URLs. A router timeout or memory
  kill is not necessarily a captured JS exception; empty Sentry results do not prove those incidents
  stopped.

## Separately Approved Staging Verification

Build with staging DSN/environment and an identifiable release. With approval, trigger one synthetic
browser error and one synthetic server error that contain no patient information; verify arrival,
environment/release, and source maps in the intended project. Remove any temporary trigger route
afterward. No diagnostic route or deliberate event is added by this PR. Production event generation
or configuration changes require separate approval.

## Release Gates For The Memory Fixes

Run the committed synthetic regressions and report checks on the exact release candidate. Repeat the
isolated baseline workloads with identical runtime, data, resource limits, concurrency, and observer
settings before claiming an RSS or latency improvement. Then release changes incrementally and
compare real traffic over a representative window, including worker/native RSS, not only JS heap.
Agree on a quota headroom budget before release. Local correctness tests or a successful build alone
are not evidence that all production incidents are fixed.
