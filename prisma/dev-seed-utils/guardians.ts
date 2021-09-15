/* eslint-disable no-console */
// Relative paths required, path aliases throw error with seed command
import prisma from '../index'; // Prisma client
import { Province } from '../../lib/graphql/types'; // GraphQL types
import { UpsertGuardian } from '../types'; // Seeding types

// Upsert applicant guardians
const guardians = [
  {
    id: 1,
    firstName: 'Guardian',
    lastName: 'One',
    phone: '1234567890',
    province: Province.Bc,
    city: 'Richmond',
    addressLine1: '123 Richmond St.',
    postalCode: 'X0X0X0',
    relationship: 'Father',
  },
  {
    id: 2,
    firstName: 'Guardian',
    lastName: 'Two',
    phone: '0987654321',
    province: Province.Bc,
    city: 'Surrey',
    addressLine1: '321 Surrey St.',
    postalCode: 'A1B2C3',
    relationship: 'Mother',
  },
  {
    id: 3,
    firstName: 'Guardian',
    lastName: 'Three',
    phone: '0987654321',
    province: Province.Bc,
    city: 'Vancouver',
    addressLine1: '456 BC Way',
    postalCode: 'B1C2D3',
    relationship: 'Brother',
  },
];

/**
 * Upsert guardians
 * @param data Custom guardian data to be upserted
 */
export default async function guardianUpsert(data?: UpsertGuardian[]): Promise<void> {
  for (const guardian of data || guardians) {
    const { id, ...rest } = guardian;
    const guardianUpsert = await prisma.guardian.upsert({
      where: { id },
      update: { ...rest },
      create: guardian,
    });
    console.log({ guardianUpsert });
  }
}
