import assert from 'assert';
import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import net from 'net';
import { formatFullName } from '@lib/utils/format';

const { prepareCandidate } = require('../memory/prepare-candidate.cjs');

export default async function (): Promise<void> {
  assert.equal(formatFullName('Synthetic', undefined, 'Holder'), 'Synthetic Holder');
  assert.throws(() => net.connect(443, 'example.com'), /Network access is disabled/);
  assert.throws(() => prepareCandidate('.', undefined), /explicit Git revision/);
  assert.throws(() => prepareCandidate('.', '--help'), /explicit Git revision/);
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rcd-candidate-test-'));
  try {
    const repository = path.join(root, 'repository');
    fs.mkdirSync(repository);
    const git = (args: string[]) =>
      execFileSync('git', ['-C', repository, ...args], { encoding: 'utf8' }).trim();
    git(['init', '-q']);
    git(['config', 'user.email', 'synthetic@example.invalid']);
    git(['config', 'user.name', 'Synthetic Test']);
    fs.writeFileSync(path.join(repository, 'yarn.lock'), '# synthetic lockfile\n');
    git(['add', 'yarn.lock']);
    git(['commit', '-qm', 'Synthetic baseline']);
    const original = git(['rev-parse', 'HEAD']);
    fs.writeFileSync(path.join(repository, 'untracked.env'), 'MUST_NOT_BE_ARCHIVED');
    const candidate = prepareCandidate(repository, original, root);
    assert.equal(candidate.commit, original);
    assert.equal(candidate.role, 'candidate');
    assert.equal(candidate.productionConnectionsAllowed, false);
    assert.equal(fs.existsSync(path.join(candidate.directory, 'app', 'untracked.env')), false);
    assert.equal(fs.statSync(candidate.directory).mode & 0o777, 0o700);
    assert.equal(fs.statSync(path.join(candidate.directory, 'candidate.json')).mode & 0o777, 0o600);
    assert.notEqual(prepareCandidate(repository, original, root).directory, candidate.directory);
    fs.writeFileSync(path.join(repository, '.env'), 'SYNTHETIC_SECRET=example');
    git(['add', '.env']);
    git(['commit', '-qm', 'Unsafe tracked environment fixture']);
    assert.throws(() => prepareCandidate(repository, 'HEAD', root), /Refusing to archive/);
    assert.equal(git(['rev-parse', original]), original);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}
