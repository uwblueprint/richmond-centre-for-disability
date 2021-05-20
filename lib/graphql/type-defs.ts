import { loadFilesSync } from '@graphql-tools/load-files'; // Load GraphQL schemas
import { mergeTypeDefs } from '@graphql-tools/merge'; // Merge typedefs

// Merge schemas
const typesArray = loadFilesSync('./lib/**/schema.graphql');
const typeDefs = mergeTypeDefs(typesArray);

export default typeDefs;
