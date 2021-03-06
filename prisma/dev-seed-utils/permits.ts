/* eslint-disable no-console */
// Relative paths required, path aliases throw error with seed command
import { PermitType } from '@prisma/client';
import prisma from '../index'; // Prisma client
import { UpsertPermit } from '../types'; // Seeding types

// Seed data
const permits: Array<UpsertPermit> = [
  {
    rcdPermitId: 1,
    applicantId: 2,
    applicationId: 2,
    type: PermitType.PERMANENT,
    expiryDate: new Date('2018-01-01'),
    active: false,
  },
  {
    rcdPermitId: 2,
    applicantId: 3,
    applicationId: 3,
    type: PermitType.PERMANENT,
    expiryDate: new Date('2025-01-01'),
    active: true,
  },
  {
    rcdPermitId: 3,
    applicantId: 4,
    applicationId: 5,
    type: PermitType.PERMANENT,
    expiryDate: new Date(new Date().getTime() + 29 * 24 * 60 * 60 * 1000), // Expiring in < 30 days
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
      update: rest,
      create: { rcdPermitId, expiryDate, ...rest },
    });
    console.log({ permitUpsert });
  }
}
