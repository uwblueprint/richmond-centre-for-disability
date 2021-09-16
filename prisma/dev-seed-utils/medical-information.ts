/* eslint-disable no-console */
// Relative paths required, path aliases throw error with seed command
import prisma from '../index'; // Prisma client
import { UpsertMedicalInformation } from '../types'; // Seeding types

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
 * @param data Custom medical information data to be upserted
 */
export default async function medicalInformationUpsert(
  data?: UpsertMedicalInformation[]
): Promise<void> {
  for (const medicalInformation of data || medicalInformationRecords) {
    const { id, ...rest } = medicalInformation;
    const medicalInformationUpsert = await prisma.medicalInformation.upsert({
      where: { id },
      update: rest,
      create: medicalInformation,
    });
    console.log({ medicalInformationUpsert });
  }
}
