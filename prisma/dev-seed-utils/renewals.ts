/* eslint-disable no-console */
// Relative paths required, path aliases throw error with seed command
import prisma from '../index'; // Prisma client

// Seed data
const renewals = [
  {
    id: 1,
    usesAccessibleConvertedVan: false,
    requiresWiderParkingSpace: true,
    applicationId: 1,
  },
  {
    id: 2,
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
    const { id, ...rest } = renewal;
    const renewalUpsert = await prisma.renewal.upsert({
      where: { id },
      update: rest,
      create: renewal,
    });
    renewalUpserts.push(renewalUpsert);
    console.log({ renewalUpsert });
  }
}
