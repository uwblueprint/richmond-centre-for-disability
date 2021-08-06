/* eslint-disable no-console */
// Relative paths required, path aliases throw error with seed command
import prisma from '../index'; // Prisma client

// Seed data
const applicationProcessings = [
  {
    id: 1,
    applicationId: 1,
  },
  {
    id: 2,
    applicationId: 2,
  },
];

/**
 * Upsert application processing records
 */
export default async function applicationProcessingUpsert(): Promise<void> {
  const applicationProcessingUpserts = [];
  for (const applicationProcessing of applicationProcessings) {
    const { id, ...rest } = applicationProcessing;
    const applicationProcessingUpsert = await prisma.applicationProcessing.upsert({
      where: { id },
      update: { ...rest },
      create: applicationProcessing,
    });
    applicationProcessingUpserts.push(applicationProcessingUpsert);
    console.log({ applicationProcessingUpsert });
  }
}
