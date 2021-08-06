/* eslint-disable no-console */
// Relative paths required, path aliases throw error with seed command
import prisma from '../index'; // Prisma client
import { Gender, Province, PaymentType, Aid } from '../../lib/graphql/types'; // GraphQL types

// Seed data
const applications = [
  {
    id: 1,
    firstName: 'Applicant',
    lastName: 'One',
    gender: Gender.Male,
    phone: '1234567890',
    province: Province.Bc,
    city: 'Vancouver',
    addressLine1: '456 Vancouver Rd.',
    postalCode: 'A1B2C3',
    disability: 'Cannot walk',
    aid: [],
    physicianName: 'Dr. Physician',
    physicianMspNumber: 12345,
    physicianAddressLine1: '789 BC Ave.',
    physicianCity: 'Victoria',
    physicianProvince: Province.Bc,
    physicianPostalCode: 'B4N5M6',
    physicianPhone: '1324354657',
    processingFee: 26,
    paymentMethod: PaymentType.Cash,
    shopifyConfirmationNumber: '1234567',
    applicantId: 1,
  },
  {
    id: 2,
    firstName: 'Applicant',
    lastName: 'Two',
    gender: Gender.Female,
    phone: '0987654321',
    province: Province.Bc,
    city: 'Vancouver',
    addressLine1: '789 Vancouver Rd.',
    postalCode: 'B1C2D3',
    disability: 'Requires walker',
    aid: [Aid.Walker],
    physicianName: 'Dr. Physician2',
    physicianMspNumber: 67890,
    physicianAddressLine1: '789 Alberta Rd.',
    physicianCity: 'Calgary',
    physicianProvince: Province.Ab,
    physicianPostalCode: 'H4K3S0',
    physicianPhone: '8264029163',
    processingFee: 26,
    paymentMethod: PaymentType.Cheque,
    shopifyConfirmationNumber: '0145829',
    applicantId: 2,
  },
];

/**
 * Upsert applications
 */
export default async function applicationUpsert(): Promise<void> {
  const applicationUpserts = [];
  for (const application of applications) {
    const { id, ...rest } = application;
    const applicationUpsert = await prisma.application.upsert({
      where: { id },
      update: { ...rest },
      create: { id, dateOfBirth: new Date().toISOString(), ...rest },
    });
    applicationUpserts.push(applicationUpsert);
    console.log({ applicationUpsert });
  }
}
