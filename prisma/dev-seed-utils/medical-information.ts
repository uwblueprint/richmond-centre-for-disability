/* eslint-disable no-console */
// Relative paths required, path aliases throw error with seed command
import prisma from '../index'; // Prisma client

// Seed data
const medicalInformationRecords = [
  {
    id: 1,
    disability: 'Fractured knee',
    affectsMobility: true,
    mobilityAidRequired: true,
    cannotWalk100m: false,
    physicianId: 1,
  },
  {
    id: 2,
    disability: 'Sprained ankle',
    affectsMobility: true,
    mobilityAidRequired: false,
    cannotWalk100m: false,
    physicianId: 2,
  },
  {
    id: 3,
    disability: 'Sprained ankle',
    affectsMobility: true,
    mobilityAidRequired: false,
    cannotWalk100m: false,
    physicianId: 2,
  },
];

/**
 * Upsert medical information records for applicants
 */
export default async function medicalInformationUpsert(): Promise<void> {
  const medicalInformationUpserts = [];
  for (const medicalInformation of medicalInformationRecords) {
    const { id, ...rest } = medicalInformation;
    const medicalInformationUpsert = await prisma.medicalInformation.upsert({
      where: { id },
      update: { ...rest },
      create: medicalInformation,
    });
    medicalInformationUpserts.push(medicalInformationUpsert);
    console.log({ medicalInformationUpsert });
  }
}
