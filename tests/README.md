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
