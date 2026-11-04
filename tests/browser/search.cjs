const assert = require('assert/strict');

async function main() {
  const target = new URL(process.env.RCD_TEST_URL || 'http://127.0.0.1:3211');
  assert.equal(target.hostname, '127.0.0.1');
  assert.equal(target.protocol, 'http:');
  const { chromium } = require(process.env.RCD_PLAYWRIGHT_MODULE || 'playwright');
  const browser = await chromium.launch({
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
  try {
    const width = Number(process.env.RCD_VIEWPORT_WIDTH || 1280);
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.route('**/*', route =>
      new URL(route.request().url()).origin === target.origin ? route.continue() : route.abort()
    );
    await page.goto(target.href);
    const holder = page.getByPlaceholder('Search by user ID, first name or last name');
    const physician = page.getByPlaceholder("Search by doctor's MSP number");
    await holder.waitFor();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    await page.waitForTimeout(500);
    assert.deepEqual(await page.evaluate(() => window.searchRequests || []), []);
    for (const [input, label] of [
      [holder, 'Selected holder'],
      [physician, 'Selected physician'],
    ]) {
      await input.fill('4');
      await page.getByText('4 Synthetic 1', { exact: true }).waitFor();
      await page.getByRole('button', { name: 'Next results' }).click();
      await page.getByText('4 Synthetic 21', { exact: true }).waitFor();
      await page.getByRole('button', { name: 'Previous results' }).click();
      await page.getByText('4 Synthetic 1', { exact: true }).waitFor();
      await page.getByRole('button', { name: 'Next results' }).focus();
      await page.keyboard.press('Enter');
      await page.getByText('4 Synthetic 21', { exact: true }).waitFor();
      await page.getByRole('button', { name: 'Previous results' }).click();
      await page.getByText('4 Synthetic 1', { exact: true }).waitFor();
      await page.getByText('4 Synthetic 1', { exact: true }).click();
      assert.equal(await page.getByLabel(label).textContent(), '1');
      await input.fill('');
      const before = await page.evaluate(() => window.searchRequests.length);
      await page.waitForTimeout(450);
      assert.equal(await page.evaluate(() => window.searchRequests.length), before);
      assert.equal(await page.getByLabel(label).textContent(), '1');
    }
    await holder.fill('   ');
    await page.waitForTimeout(450);
    assert.ok(
      (await page.evaluate(() => window.searchRequests)).every(item =>
        (item.filter.search ?? item.filter.mspNumber).trim()
      )
    );
    await page.evaluate(() => {
      window.searchDelay = 700;
    });
    await holder.fill('old');
    await page.waitForTimeout(350);
    await holder.fill('new');
    assert.equal(await page.getByText('old Synthetic 1', { exact: true }).count(), 0);
    await page.getByText('new Synthetic 1', { exact: true }).waitFor();
    assert.equal(await page.getByText('old Synthetic 1', { exact: true }).count(), 0);
    await holder.fill('clear');
    await page.waitForTimeout(350);
    await holder.fill('');
    await page.waitForTimeout(800);
    assert.equal(await page.getByText('clear Synthetic 1', { exact: true }).count(), 0);
    await page.evaluate(() => {
      window.searchDelay = 20;
    });
    await holder.fill('fail');
    await page.getByText('Search unavailable.').waitFor();
    await page.getByRole('button', { name: 'Retry search' }).click();
    await page.getByText('Search unavailable.').waitFor();
    await holder.fill('none');
    await page.getByText('No results found.').waitFor();
    for (const item of await page.evaluate(() => window.searchRequests)) {
      assert.equal(item.filter.limit, 20);
      assert.ok(Number.isInteger(item.filter.offset) && item.filter.offset >= 0);
    }
    process.stdout.write(
      'PASS synthetic browser search, paging, clear, race, selection and failure checks\n'
    );
  } finally {
    await browser.close();
  }
}
main().catch(error => {
  process.stderr.write(`${error.stack}\n`);
  process.exitCode = 1;
});
