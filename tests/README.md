# Search regressions

These focused checks use Node assertions and the actual application typeaheads, not a new unit-test
framework. The browser fixture uses synthetic in-memory Apollo results and has no API, database,
authentication, email, or upload integration. It runs from a temporary directory with a fresh
environment, bound to host loopback. Browser egress and WebSockets are blocked. Processes and
temporary build output are cleaned up on completion.

Pagination checks run with the application's Node 16.20.2:

```sh
yarn test:search:unit
```

Browser checks use a separate Node 18+ driver and Playwright Core 1.56.1. The application server
still runs Node 16.20.2. CI installs the browser driver outside the application dependency tree; no
application runtime or lockfile upgrade is required.

```sh
# Run with a supported browser-driver Node version.
npm install --prefix /tmp/rcd-search-browser --no-save --ignore-scripts playwright-core@1.56.1
node /tmp/rcd-search-browser/node_modules/playwright-core/cli.js install chromium
RCD_NEXT_NODE=/absolute/path/to/node-16.20.2 \
  RCD_PLAYWRIGHT_MODULE=/tmp/rcd-search-browser/node_modules/playwright-core \
  node tests/browser/search.js
```

An installed Chrome can be used instead by setting `RCD_CHROMIUM_EXECUTABLE` to its absolute path.
Do not run the product server, `npm start`, migrations, or a production database for these tests.

The browser matrix covers both holder and physician controls at desktop/mobile widths: blank mounts,
bounded pointer paging, editing a selection in one action, Enter during loading, a shorter last
page, real Tab/Shift+Tab/Enter navigation (without programmatic button focus), delayed responses,
clearing, errors, and empty results. Test fixtures never contain production-derived records.
