/* eslint-disable no-console */
// Relative paths required, path aliases throw error with seed command
import prisma from '../index'; // Prisma client

// Seed data
const permits = [{ rcdPermitId: 1, applicantId: 1, applicationId: 1 }];

/**
 * Upsert permits
 */
export default async function permitUpsert(): Promise<void> {
  const permitUpserts = [];
  for (const permit of permits) {
    const { rcdPermitId, ...rest } = permit;
    const permitUpsert = await prisma.permit.upsert({
      where: { rcdPermitId },
      update: { ...rest },
      create: { rcdPermitId, expiryDate: new Date().toISOString(), ...rest },
    });
    permitUpserts.push(permitUpsert);
    console.log({ permitUpsert });
  }
}
