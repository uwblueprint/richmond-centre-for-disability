import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Logo from '@components/Logo';

export default async function (): Promise<void> {
  const asset = fs.readFileSync(path.join(__dirname, '../../public/assets/logo-web-v1.png'));
  assert.equal(asset.readUInt32BE(16), 800);
  assert.ok(asset.length < 100 * 1024);
  for (const width of [120, 165, 200, 221, 400]) {
    const markup = renderToStaticMarkup(
      React.createElement(Logo, { width, height: 45, layout: 'responsive' })
    );
    assert.ok(markup.includes('/assets/logo-web-v1.png'));
    assert.ok(markup.includes('Richmond Centre for Disability Logo'));
    assert.equal(markup.includes('/_next/image'), false);
  }
  // The web derivative must never replace the shared original used in invoices and email.
  const original = fs.readFileSync(path.join(__dirname, '../../public/assets/logo.png'));
  assert.equal(original.readUInt32BE(16), 3600);
  assert.notEqual(
    createHash('sha256').update(asset).digest('hex'),
    createHash('sha256').update(original).digest('hex')
  );
  const config = require('../../next.config.js');
  const redirects = (await config.rewrites()).beforeFiles;
  for (const name of ['logo.png', 'logo.svg', 'logo-web-v1.png']) {
    const rule = redirects.find(
      (item: any) =>
        item.source === '/_next/image' &&
        new RegExp(`^${item.has[0].value}$`).test(`/assets/${name}`)
    );
    assert.equal(rule.destination, '/assets/logo-web-v1.png');
    assert.equal(new RegExp(`^${rule.has[0].value}$`).test('/assets/unrelated.png'), false);
  }
}
