/* eslint-disable no-console */
// Relative paths required, path aliases throw error with seed command
import prisma from '../index'; // Prisma client
import { UpsertPermit } from '../types'; // Seeding types

// Seed data
const permits = [
  {
    rcdPermitId: 1,
    applicantId: 1,
    applicationId: 1,
    expiryDate: new Date(2025, 1, 1).toISOString(),
    active: true,
  },
  {
    rcdPermitId: 2,
    applicantId: 2,
    applicationId: 2,
    active: true,
  },
  {
    rcdPermitId: 3,
    applicantId: 3,
    applicationId: 3,
    expiryDate: new Date(2018, 1, 1).toISOString(),
    active: true,
  },
];

/**
 * Upsert permits
 * @param data Custom permit data to be upserted
 */
export default async function permitUpsert(data?: UpsertPermit[]): Promise<void> {
  for (const permit of data || permits) {
    const { rcdPermitId, expiryDate = new Date().toISOString(), ...rest } = permit;
    const permitUpsert = await prisma.permit.upsert({
      where: { rcdPermitId },
      update: { ...rest },
      create: { rcdPermitId: rcdPermitId, expiryDate, ...rest },
    });
    console.log({ permitUpsert });
  }
}
