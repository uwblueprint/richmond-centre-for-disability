/* eslint-disable no-console */
// Relative paths required, path aliases throw error with seed command
import prisma from '../index'; // Prisma client
import { ReasonForReplacement } from '../../lib/graphql/types'; // GraphQL types

// Seed data
const replacements = [
  {
    reason: ReasonForReplacement.Lost,
    lostTimestamp: new Date(),
    lostLocation: 'The library',
    description: 'I lost my APP at the library',
    applicationId: 3,
  },
];

/**
 * Upsert replacement applications
 */
export default async function replacementUpsert(): Promise<void> {
  const replacementUpserts = [];
  for (const replacement of replacements) {
    const { ...rest } = replacement;
    const replacementUpsert = await prisma.replacement.create({
      data: {
        ...rest,
      },
    });
    replacementUpserts.push(replacementUpsert);
    console.log({ replacementUpsert });
  }
}
