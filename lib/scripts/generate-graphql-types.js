/* eslint-disable no-console */
const fs = require('fs'); // File system
const { execSync } = require('child_process'); // Execute shell commands
const { loadFilesSync } = require('@graphql-tools/load-files'); // Load GraphQL schemas
const { mergeTypeDefs } = require('@graphql-tools/merge'); // Merge GraphQL typedefs
const { print } = require('graphql'); // Output GraphQL schema object as string

const GRAPHQL_MAIN_SCHEMA_PATH = 'lib/graphql/_main.graphql';

/**
 * Merges schema.graphql files into _main.graphql file and generates TypeScript types based on
 * GraphQL schema
 */
function generateGraphQLTypes() {
  console.log('Starting generation of main GraphQL schema and TypeScript types...');

  // Generate _main schema file
  console.log('Creating main GraphQL schema file 🛠️ ...');
  const typesArray = loadFilesSync(['./lib/**/*.graphql', '!./lib/graphql/_main.graphql']);
  const typeDefs = mergeTypeDefs(typesArray);
  const schemaString = `######################################################################
### THIS IS AN AUTO-GENERATED FILE. PLEASE DO NOT MODIFY DIRECTLY. ###
######################################################################

${print(typeDefs)}
  `;
  fs.writeFileSync(GRAPHQL_MAIN_SCHEMA_PATH, schemaString, 'utf-8');
  console.log(`GraphQL schema file created at ${GRAPHQL_MAIN_SCHEMA_PATH} ✅\n`);

  // Codegen TypeScript types
  console.log('Generating TypeScript types');
  execSync('graphql-codegen --config codegen.yml');
  console.log('TypeScript types file created at lib/graphql/types.ts ✅\n');

  console.log('DONE ✅');
}

generateGraphQLTypes();
