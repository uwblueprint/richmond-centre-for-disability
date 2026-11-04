# Focused Regression Tests

Run `yarn test:unit` on Node 16.20.2 after installing the lockfile dependencies. Tests use the
existing TypeScript compiler/ts-node and Node assertions; no application Babel configuration is
changed. Unit suites under `tests/unit/*.test.ts` export an async default function and use synthetic
inputs and mocked service boundaries. A failure exits nonzero. TypeScript checking remains a
separate CI step.

The runner replaces service environment values and disables JavaScript network connections. Do not
use real service credentials or a production database in these tests. Native database clients must
be mocked; the socket guard alone is not a native-process sandbox.

## Preparing A Memory-Test Candidate

Commit the intended changes, then run `yarn memory:prepare <full-commit-sha>`. This only archives
tracked source into a new private OS-temp directory and records the exact commit, archive, and
lockfile hashes. It refuses tracked environment/credential files. It never builds, starts a server,
restores data, changes an existing baseline, or contacts production.

Use the resulting source in a separately reviewed isolated lab build, with dummy credentials,
blocked external egress, private artifacts, explicit memory/CPU limits, and no automatic migration
startup. Do not use `yarn start`: this repository's start command runs migrations. Verify the
candidate manifest against the built image and match baseline/candidate data, runtime, request
selection, concurrency, and measurement settings.

The existing untracked `diagnostics/` scaffold and the completed private investigation are separate
tooling. A runner pinned to the old deployed revision is not candidate verification. This
preparation command does not certify those runners or make a shared staging environment safe.

## Synthetic Browser Search Checks

The test app under `tests/browser/fixture` imports the real holder/physician typeaheads with a
synthetic in-memory Apollo link. It does not import the product auth, Sentry, database, or HTTP
GraphQL handler. From a clean environment, start it with
`node node_modules/next/dist/bin/next dev tests/browser/fixture -H 127.0.0.1 -p 3211`. Run
`tests/browser/search.cjs` with a compatible Playwright installation on its supported host Node
version. `RCD_PLAYWRIGHT_MODULE` and `RCD_CHROMIUM_EXECUTABLE` optionally select an installed
module/browser; `RCD_VIEWPORT_WIDTH=390` repeats the checks at mobile width. The application fixture
remains on Node 16 independently of the browser runner. Only an HTTP 127.0.0.1 target is accepted,
and browser requests to other origins are blocked. Stop the fixture after testing.

Checks cover no blank mount/clear requests, explicit bounds, next/previous and keyboard paging,
holder/doctor selection without wiping the parent's selected value, delayed-response/clear races,
no-match/error/retry states, and viewport overflow. These component checks do not replace staging
auth/parent-form smoke testing or matched whole-process memory measurements.
