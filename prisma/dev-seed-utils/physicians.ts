/* eslint-disable no-console */
// Relative paths required, path aliases throw error with seed command
import prisma from '../index'; // Prisma client
import { Province, PhysicianStatus } from '../../lib/graphql/types'; // GraphQL types

// Seed data
const physicians = [
  {
    id: 1,
    firstName: 'Dr. ',
    lastName: 'Doctor',
    mspNumber: 12345,
    addressLine1: '162 University Ave.',
    city: 'Waterloo',
    province: Province.On,
    postalCode: 'A1B2C3',
    phone: '123-456-7889',
    status: PhysicianStatus.Active,
  },
  {
    id: 2,
    firstName: 'Dr. ',
    lastName: 'Doctor 2',
    mspNumber: 12346,
    addressLine1: '163 University Ave.',
    city: 'Burnaby',
    province: Province.Bc,
    postalCode: 'N1M2K3',
    phone: '234-567-8901',
    status: PhysicianStatus.Inactive,
  },
];

/**
 * Upsert physicians
 */
export default async function physicianUpsert(): Promise<void> {
  const physicianUpserts = [];
  for (const physician of physicians) {
    const { id, ...rest } = physician;
    const physicianUpsert = await prisma.physician.upsert({
      where: { id },
      update: { ...rest },
      create: physician,
    });
    physicianUpserts.push(physicianUpsert);
    console.log({ physicianUpsert });
  }
}