/* eslint-disable no-console */
// Relative paths required, path aliases throw error with seed command
import prisma from '../index'; // Prisma client
import { ReasonForReplacement } from '../../lib/graphql/types'; // GraphQL types

// Seed data
const replacements = [
  {
    id: 1,
    reason: ReasonForReplacement.Lost,
    lostTimestamp: new Date(),
    lostLocation: 'The library',
    description: 'I lost my APP at the library',
    applicationId: 2,
  },
];

/**
 * Upsert replacement applications
 */
export default async function replacementUpsert(): Promise<void> {
  const replacementUpserts = [];
  for (const replacement of replacements) {
    const { id, ...rest } = replacement;
    const replacementUpsert = await prisma.replacement.upsert({
      where: { id },
      update: { ...rest },
      create: replacement,
    });
    replacementUpserts.push(replacementUpsert);
    console.log({ replacementUpsert });
  }
}
