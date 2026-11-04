const { execFileSync, spawnSync } = require('child_process');
const { createHash } = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

function prepareCandidate(repository, revision, temporaryRoot = os.tmpdir()) {
  if (!revision || revision.startsWith('-'))
    throw new Error('An explicit Git revision is required');
  const git = args => execFileSync('git', ['-C', repository, ...args], { encoding: 'utf8' }).trim();
  const commit = git(['rev-parse', '--verify', `${revision}^{commit}`]);
  const trackedFiles = git(['ls-tree', '-r', '--name-only', commit]).split('\n');
  const files = trackedFiles.filter(file => file !== '.env.sample');
  if (files.some(file => /(^|\/)(\.env($|\.)|\.aws\/|node_modules\/)/.test(file))) {
    throw new Error('Refusing to archive tracked environment, credential, or dependency files');
  }
  // Separate state per invocation: candidate preparation never modifies an existing baseline.
  const directory = fs.mkdtempSync(path.join(temporaryRoot, 'rcd-memory-candidate-'));
  fs.chmodSync(directory, 0o700);
  try {
    const archive = execFileSync('git', ['-C', repository, 'archive', commit, '--', ...files], {
      maxBuffer: 64 * 1024 * 1024,
    });
    const source = path.join(directory, 'app');
    fs.mkdirSync(source, { mode: 0o700 });
    const extracted = spawnSync('tar', ['-xf', '-', '-C', source], { input: archive });
    if (extracted.status !== 0) throw new Error(`Archive extraction failed: ${extracted.stderr}`);
    const hash = data => createHash('sha256').update(data).digest('hex');
    const manifest = {
      role: 'candidate',
      commit,
      archiveSha256: hash(archive),
      lockfileSha256: hash(fs.readFileSync(path.join(source, 'yarn.lock'))),
      preparedAt: new Date().toISOString(),
      productionConnectionsAllowed: false,
      omittedFiles: trackedFiles.filter(file => !files.includes(file)),
    };
    fs.writeFileSync(path.join(directory, 'candidate.json'), JSON.stringify(manifest, null, 2), {
      mode: 0o600,
    });
    return { directory, ...manifest };
  } catch (error) {
    fs.rmSync(directory, { recursive: true, force: true });
    throw error;
  }
}

module.exports = { prepareCandidate };
if (require.main === module) {
  try {
    const repository = path.resolve(__dirname, '../..');
    process.stdout.write(
      `${JSON.stringify(prepareCandidate(repository, process.argv[2]), null, 2)}\n`
    );
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
