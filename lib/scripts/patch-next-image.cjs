const fs = require('fs');
const path = require('path');
const { createHash } = require('crypto');
const patch = require('../../patches/next-image-stream.json');

function applyNextImagePatch(packageDirectory) {
  const version = JSON.parse(
    fs.readFileSync(path.join(packageDirectory, 'package.json'), 'utf8')
  ).version;
  if (version !== patch.version)
    throw new Error(
      `Next image backport requires reviewed version ${patch.version}, found ${version}`
    );
  const filename = path.join(packageDirectory, patch.file);
  const source = fs.readFileSync(filename, 'utf8');
  const hash = value => createHash('sha256').update(value).digest('hex');
  const occurrences = value => source.split(value).length - 1;
  if (
    occurrences(patch.after) === 1 &&
    hash(source.replace(patch.after, patch.before)) === patch.originalSha256
  ) {
    return 'already-applied';
  }
  if (hash(source) !== patch.originalSha256 || occurrences(patch.before) !== 1) {
    throw new Error(
      'Unexpected Next image optimizer contents; review/remove the pinned backport before building'
    );
  }
  const temporary = `${filename}.rcd-patch`;
  try {
    fs.writeFileSync(temporary, source.replace(patch.before, patch.after), {
      mode: fs.statSync(filename).mode,
    });
    fs.renameSync(temporary, filename);
  } finally {
    fs.rmSync(temporary, { force: true });
  }
  return 'applied';
}
module.exports = { applyNextImagePatch };
if (require.main === module) {
  try {
    const directory = path.dirname(require.resolve('next/package.json'));
    process.stdout.write(`Next image stream backport: ${applyNextImagePatch(directory)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
