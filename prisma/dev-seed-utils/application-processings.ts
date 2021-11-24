/* eslint-disable no-console */
// Relative paths required, path aliases throw error with seed command
import prisma from '../index'; // Prisma client
import { UpsertApplicationProcessing } from '../types'; // Seeding types

// Seed data
const applicationProcessings = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
];

/**
 * Upsert application processing records
 * @param data Custom application processing data to be upserted
 */
export default async function applicationProcessingUpsert(
  data?: UpsertApplicationProcessing[]
): Promise<void> {
  for (const applicationProcessing of data || applicationProcessings) {
    const { id, ...rest } = applicationProcessing;
    const applicationProcessingUpsert = await prisma.applicationProcessing.upsert({
      where: { id },
      update: rest,
      create: applicationProcessing,
    });
    console.log({ applicationProcessingUpsert });
  }
}
