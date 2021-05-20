import { loadFilesSync } from '@graphql-tools/load-files'; // Load GraphQL schemas

const typeDefs = loadFilesSync('./lib/graphql/_main.graphql');

export default typeDefs;
