/* eslint-disable no-console */
const fs = require('fs'); // File system
const { execSync } = require('child_process'); // Execute shell commands

/**
 * Generates TypeScript types based on GraphQL schema
 */
function generateGraphQLTypes() {
  console.log('Starting generation of TypeScript types...');

  // Delete current types file
  fs.unlinkSync('lib/graphql/types.ts');

  // Codegen TypeScript types
  console.log('Generating TypeScript types 🛠️');
  execSync('graphql-codegen --config codegen.yml');
  console.log('TypeScript types file created at lib/graphql/types.ts ✅\n');

  console.log('DONE ✅');
}

generateGraphQLTypes();
