/* eslint-disable no-console */
// Relative paths required, path aliases throw error with seed command
import prisma from '../index'; // Prisma client
import { UpsertApplicationProcessing } from '../types'; // Seeding types

// Seed data
const applicationProcessings = [{}, {}, {}];

/**
 * Upsert application processing records
 * @param data Custom application processing data to be upserted
 */
export default async function applicationProcessingUpsert(
  data?: UpsertApplicationProcessing[]
): Promise<void> {
  for (const applicationProcessing of data || applicationProcessings) {
    const { ...rest } = applicationProcessing;
    const applicationProcessingUpsert = await prisma.applicationProcessing.create({
      data: {
        ...rest,
      },
    });
    console.log({ applicationProcessingUpsert });
  }
}
