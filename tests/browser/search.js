const assert = require('assert/strict');
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const http = require('http');
const net = require('net');
const os = require('os');
const path = require('path');

const source = path.resolve(__dirname, '../..');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const row = (page, search, id) => page.getByText(`${search} Synthetic ${id}`, { exact: true });

async function main() {
  assert.ok(Number(process.versions.node.split('.')[0]) >= 18, 'Browser driver needs Node 18+');
  const { chromium } = require(process.env.RCD_PLAYWRIGHT_MODULE || 'playwright-core');
  const nextNode = process.env.RCD_NEXT_NODE || process.execPath;
  const appVersion = spawnSync(nextNode, ['--version'], { encoding: 'utf8' });
  assert.equal(
    appVersion.stdout?.trim(),
    'v16.20.2',
    'Set RCD_NEXT_NODE to the application Node 16.20.2 binary'
  );
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'rcd-search-test-'));
  let server;
  let browser;
  let serverLog = '';
  let failures = 0;
  try {
    fs.cpSync(path.join(__dirname, 'fixture'), directory, { recursive: true });
    fs.symlinkSync(path.join(source, 'node_modules'), path.join(directory, 'node_modules'), 'dir');
    fs.writeFileSync(path.join(directory, 'package.json'), JSON.stringify({ private: true }));
    const tsconfig = JSON.parse(fs.readFileSync(path.join(source, 'tsconfig.json'), 'utf8'));
    tsconfig.compilerOptions.baseUrl = source;
    fs.writeFileSync(path.join(directory, 'tsconfig.json'), JSON.stringify(tsconfig));
    const reservation = net.createServer();
    await new Promise(resolve => reservation.listen(0, '127.0.0.1', resolve));
    const port = reservation.address().port;
    await new Promise(resolve => reservation.close(resolve));
    const origin = `http://127.0.0.1:${port}`;
    server = spawn(
      nextNode,
      [
        path.join(source, 'node_modules/next/dist/bin/next'),
        'dev',
        directory,
        '-p',
        String(port),
        '-H',
        '127.0.0.1',
      ],
      {
        cwd: directory,
        // Never inherit the developer's app environment, HOME credentials, or .env files.
        env: {
          PATH: process.env.PATH,
          HOME: directory,
          NODE_ENV: 'development',
          NEXT_TELEMETRY_DISABLED: '1',
          RCD_TEST_SOURCE: source,
        },
        stdio: ['ignore', 'pipe', 'pipe'],
      }
    );
    for (const stream of [server.stdout, server.stderr]) {
      stream.on('data', data => {
        serverLog = (serverLog + data).slice(-32000);
      });
    }
    let ready = false;
    for (let attempt = 0; attempt < 120; attempt++) {
      if (server.exitCode !== null) throw new Error(`Fixture server exited: ${serverLog}`);
      ready = await new Promise(resolve => {
        const request = http.get(origin, response => {
          response.resume();
          resolve(response.statusCode === 200);
        });
        request.setTimeout(1000, () => request.destroy());
        request.on('error', () => resolve(false));
      });
      if (ready) break;
      await sleep(500);
    }
    assert.ok(ready, `Fixture server did not become ready: ${serverLog}`);
    browser = await chromium.launch({
      headless: true,
      executablePath: process.env.RCD_CHROMIUM_EXECUTABLE || undefined,
      args: [
        '--disable-background-networking',
        '--disable-component-update',
        '--disable-sync',
        '--no-first-run',
        '--no-proxy-server',
        '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1',
      ],
    });
    for (const width of [1280, 390]) {
      for (const [placeholder, label, initialSelection] of [
        ['Search by user ID, first name or last name', 'Selected holder', '0'],
        ["Search by doctor's MSP number", 'Selected physician', ''],
      ]) {
        const context = await browser.newContext({
          serviceWorkers: 'block',
          viewport: { width, height: 900 },
        });
        await context.routeWebSocket('**/*', socket => socket.close());
        await context.route('**/*', route =>
          new URL(route.request().url()).origin === origin ? route.continue() : route.abort()
        );
        const page = await context.newPage();
        const cases = {
          'blank mount and bounded pointer paging': async input => {
            await page.waitForTimeout(400);
            assert.deepEqual(await page.evaluate(() => window.searchRequests || []), []);
            await input.fill('4');
            await row(page, '4', 1).waitFor();
            await page.getByRole('button', { name: 'Next results' }).click();
            await row(page, '4', 21).waitFor();
            assert.equal(await row(page, '4', 1).count(), 0);
            await row(page, '4', 21).click();
            assert.equal(await page.getByLabel(label).textContent(), '21');
          },
          'replace selected input in one edit': async input => {
            await input.fill('a');
            await row(page, 'a', 1).waitFor();
            await row(page, 'a', 1).click();
            await input.fill('b');
            await row(page, 'b', 1).waitFor();
            assert.equal(await input.inputValue(), 'b');
            assert.equal(await page.getByLabel(label).textContent(), '1');
            await row(page, 'b', 2).click();
            assert.equal(await page.getByLabel(label).textContent(), '2');
            await input.fill('');
            await page.waitForTimeout(400);
            assert.equal(await page.getByLabel(label).textContent(), '2');
            assert.equal(await page.getByRole('option').count(), 0);
          },
          'Enter while page is loading': async input => {
            await page.evaluate(() => {
              window.searchDelays = { 'a:20': 1200 };
            });
            await input.fill('a');
            await row(page, 'a', 1).waitFor();
            await input.press('ArrowDown');
            await page.getByRole('button', { name: 'Next results' }).click();
            await page.getByText('Searching...', { exact: true }).waitFor();
            await input.press('Enter');
            assert.equal(await page.getByLabel(label).textContent(), initialSelection);
            await row(page, 'a', 21).waitFor();
            assert.equal(await input.getAttribute('aria-activedescendant'), null);
          },
          'short last page clears active item': async input => {
            await input.fill('a');
            await row(page, 'a', 1).waitFor();
            await page.getByRole('button', { name: 'Next results' }).click();
            await row(page, 'a', 21).waitFor();
            for (let index = 0; index < 20; index++) await input.press('ArrowDown');
            assert.match(
              await page.locator('[role="option"][aria-selected="true"]').textContent(),
              /Synthetic 40/
            );
            await page.getByRole('button', { name: 'Next results' }).click();
            await row(page, 'a', 41).waitFor();
            await input.press('Enter');
            assert.equal(await page.getByLabel(label).textContent(), initialSelection);
            assert.equal(await input.getAttribute('aria-activedescendant'), null);
            await input.press('ArrowDown');
            await input.press('Enter');
            assert.equal(await page.getByLabel(label).textContent(), '41');
          },
          'keyboard-only paging and focus exit': async input => {
            await input.fill('a');
            await row(page, 'a', 1).waitFor();
            await input.press('Tab');
            const next = page.getByRole('button', { name: 'Next results' });
            assert.ok(await next.evaluate(button => button === document.activeElement));
            assert.equal(await page.getByRole('listbox').getByRole('button').count(), 0);
            await page.keyboard.press('Enter');
            await row(page, 'a', 21).waitFor();
            assert.ok(await input.evaluate(element => element === document.activeElement));
            await input.press('Tab');
            assert.ok(
              await page
                .getByRole('button', { name: 'Previous results' })
                .evaluate(button => button === document.activeElement)
            );
            await page.keyboard.press('Shift+Tab');
            assert.ok(await input.evaluate(element => element === document.activeElement));
            await input.press('Tab');
            await page.keyboard.press('Tab');
            assert.ok(await next.evaluate(button => button === document.activeElement));
            await page.keyboard.press('Enter');
            await row(page, 'a', 41).waitFor();
            await input.press('Tab');
            await page.keyboard.press('Tab');
            assert.equal(await page.getByRole('group', { name: 'Search result pages' }).count(), 0);
          },
          'slow old response and clearing': async input => {
            await page.evaluate(() => {
              window.searchDelays = { 'old:0': 1000, 'clear:0': 1000 };
            });
            await input.fill('old');
            await page.waitForFunction(() =>
              window.searchRequests?.some(request => request.search === 'old')
            );
            await input.fill('new');
            await row(page, 'new', 1).waitFor();
            await page.waitForTimeout(1100);
            assert.equal(await row(page, 'old', 1).count(), 0);
            await input.fill('clear');
            await page.waitForFunction(() =>
              window.searchRequests.some(request => request.search === 'clear')
            );
            await input.fill('');
            await page.waitForTimeout(1100);
            assert.equal(await page.getByRole('option').count(), 0);
            await input.fill('   ');
            await page.waitForTimeout(400);
          },
          'error and empty results': async input => {
            await input.fill('fail');
            await page.getByText('Search unavailable.', { exact: true }).waitFor();
            await input.fill('none');
            await page.getByText('No results found.', { exact: true }).waitFor();
          },
        };
        try {
          for (const [name, check] of Object.entries(cases)) {
            await page.goto(origin);
            await page.waitForFunction(() => window.searchFixtureReady === true);
            const input = page.getByPlaceholder(placeholder);
            await input.waitFor();
            try {
              await check(input);
              assert.ok(
                await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
              );
              for (const request of await page.evaluate(() => window.searchRequests || [])) {
                assert.ok(request.search.trim());
                assert.equal(request.limit, 20);
                assert.ok(Number.isInteger(request.offset) && request.offset >= 0);
              }
              process.stdout.write(`PASS ${width}px ${label}: ${name}\n`);
            } catch (error) {
              failures++;
              process.stderr.write(`FAIL ${width}px ${label}: ${name}\n${error.stack}\n`);
            }
          }
        } finally {
          await context.close();
        }
      }
    }
    assert.equal(failures, 0, `${failures} browser regressions failed`);
  } finally {
    if (browser) await browser.close();
    if (server && server.exitCode === null) {
      const exited = new Promise(resolve => server.once('exit', resolve));
      server.kill('SIGTERM');
      const timer = setTimeout(() => server.kill('SIGKILL'), 5000);
      await exited;
      clearTimeout(timer);
    }
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

main().catch(error => {
  process.stderr.write(`${error.stack}\n`);
  process.exitCode = 1;
});
