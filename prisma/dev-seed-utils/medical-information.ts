/* eslint-disable no-console */
// Relative paths required, path aliases throw error with seed command
import prisma from '../index'; // Prisma client
import { Eligibility } from '../../lib/graphql/types'; // GraphQL types
import { UpsertMedicalInformation } from '../types'; // Seeding types

// Seed data
const medicalInformationRecords = [
  {
    id: 1,
    disability: 'Fractured knee',
    patientEligibility: Eligibility.AffectsMobility,
    physicianId: 1,
  },
  {
    id: 2,
    disability: 'Sprained ankle',
    patientEligibility: Eligibility.MobilityAidRequired,
    physicianId: 2,
  },
  {
    id: 3,
    disability: 'Sprained ankle',
    patientEligibility: Eligibility.CannotWalk_100M,
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
