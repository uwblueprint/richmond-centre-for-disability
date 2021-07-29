/* eslint-disable no-console */
const { existsSync, unlinkSync, renameSync, copyFileSync } = require('fs'); // File system
const { execSync } = require('child_process'); // Execute shell commands

/**
 * Generates TypeScript types based on GraphQL schema
 */
function generateGraphQLTypes() {
  console.log('Starting generation of TypeScript types...');

  // Backup and delete current types file if exists
  const TYPES_PATH = 'lib/graphql/types.ts';
  const BACKUP_TYPES_PATH = 'lib/graphql/types-backup.ts';

  if (existsSync(TYPES_PATH)) {
    // Backup file
    console.log(`Backing up ${TYPES_PATH}...`);
    copyFileSync(TYPES_PATH, BACKUP_TYPES_PATH);

    // Delete file
    unlinkSync(TYPES_PATH);
  }

  try {
    // Codegen TypeScript types
    console.log('Generating TypeScript types 🛠️');
    execSync('graphql-codegen --config codegen.yml', { stdio: 'inherit' });
    console.log(`TypeScript types file created at ${TYPES_PATH} ✅\n`);

    // Delete backup if it was made
    if (existsSync(BACKUP_TYPES_PATH)) {
      unlinkSync(BACKUP_TYPES_PATH);
    }

    console.log('DONE ✅');
  } catch {
    // Roll back types file, if backup exists
    console.log(`An error occurred. Rolling back ${TYPES_PATH}...`);
    if (existsSync(BACKUP_TYPES_PATH)) {
      renameSync(BACKUP_TYPES_PATH, TYPES_PATH);
    }

    console.error('TYPE GENERATION FAILED ❌');
  }
}

generateGraphQLTypes();
