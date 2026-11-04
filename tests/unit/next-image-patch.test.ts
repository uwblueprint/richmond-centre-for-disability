import assert from 'assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { createHash } from 'crypto';

const patch = require('../../patches/next-image-stream.json');
const { applyNextImagePatch } = require('../../lib/scripts/patch-next-image.cjs');

export default async function (): Promise<void> {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rcd-next-patch-test-'));
  try {
    const filename = path.join(root, patch.file);
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ version: patch.version }));
    const installed = fs.readFileSync(require.resolve('next/dist/server/image-optimizer'), 'utf8');
    const original = installed.replace(patch.after, patch.before);
    assert.equal(createHash('sha256').update(original).digest('hex'), patch.originalSha256);
    fs.writeFileSync(filename, original);
    assert.equal(applyNextImagePatch(root), 'applied');
    assert.ok(fs.readFileSync(filename, 'utf8').includes(patch.after));
    assert.equal(applyNextImagePatch(root), 'already-applied');
    fs.appendFileSync(filename, '\n// unreviewed change');
    assert.throws(() => applyNextImagePatch(root), /Unexpected Next/);
    fs.writeFileSync(filename, original);
    fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ version: '12.0.10' }));
    assert.throws(() => applyNextImagePatch(root), /requires reviewed version/);
    assert.equal(fs.readFileSync(filename, 'utf8'), original);
    assert.equal(fs.existsSync(`${filename}.rcd-patch`), false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}
