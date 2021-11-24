/* eslint-disable no-console */
// Relative paths required, path aliases throw error with seed command
import prisma from '../index'; // Prisma client

// Seed data
const renewals = [
  {
    usesAccessibleConvertedVan: false,
    requiresWiderParkingSpace: true,
    applicationId: 1,
  },
  {
    usesAccessibleConvertedVan: false,
    requiresWiderParkingSpace: true,
    applicationId: 2,
  },
];

/**
 * Upsert renewal applications
 */
export default async function renewalsUpsert(): Promise<void> {
  const renewalUpserts = [];
  for (const renewal of renewals) {
    const { ...rest } = renewal;
    const renewalUpsert = await prisma.renewal.create({
      data: {
        ...rest,
      },
    });
    renewalUpserts.push(renewalUpsert);
    console.log({ renewalUpsert });
  }
}
