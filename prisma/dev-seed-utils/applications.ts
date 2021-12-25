/* eslint-disable no-console */
// Relative paths required, path aliases throw error with seed command
import prisma from '../index'; // Prisma client
import { Gender, Province, PaymentType, Eligibility } from '../../lib/graphql/types'; // GraphQL types
import { UpsertApplication } from '../types'; // Seeding types

// Seed data
const applications = [
  {
    rcdUserId: 12345,
    firstName: 'Applicant',
    lastName: 'One',
    dateOfBirth: new Date(),
    gender: Gender.Male,
    email: 'applicantone@gmail.com',
    phone: '1234567890',
    city: 'Vancouver',
    addressLine1: '456 Vancouver Rd.',
    postalCode: 'A1B2C3',
    disability: 'Cannot walk',
    physicianName: 'Dr. Physician',
    physicianMspNumber: 12345,
    certificationDate: new Date(),
    patientEligibility: Eligibility.AffectsMobility,
    expiryDate: new Date(),
    physicianAddressLine1: '789 BC Ave.',
    physicianCity: 'Victoria',
    physicianPostalCode: 'B4N5M6',
    physicianPhone: '1324354657',
    processingFee: 26,
    paymentMethod: PaymentType.Cash,
    shopifyConfirmationNumber: '1234567',
    applicantId: 1,
    shippingFullName: 'Applicant One',
    shippingAddressLine1: '456 Vancouver Rd.',
    shippingCity: 'Vancouver',
    shippingProvince: Province.Bc,
    shippingPostalCode: 'A1B2C3',
    billingFullName: 'Applicant One',
    applicationProcessingId: 1,
  },
  {
    rcdUserId: 23456,
    firstName: 'Applicant',
    lastName: 'Two',
    gender: Gender.Female,
    phone: '0987654321',
    city: 'Vancouver',
    addressLine1: '789 Vancouver Rd.',
    postalCode: 'B1C2D3',
    disability: 'Requires walker',
    physicianName: 'Dr. Physician2',
    certificationDate: new Date(),
    patientEligibility: Eligibility.MobilityAidRequired,
    expiryDate: new Date(),
    physicianMspNumber: 67890,
    physicianAddressLine1: '789 Alberta Rd.',
    physicianCity: 'Calgary',
    physicianPostalCode: 'H4K3S0',
    physicianPhone: '8264029163',
    processingFee: 26,
    paymentMethod: PaymentType.Cheque,
    shopifyConfirmationNumber: '0145829',
    applicantId: 2,
    email: 'applicanttwo@gmail.com',
    applicationProcessingId: 2,
  },
  {
    rcdUserId: 23456,
    firstName: 'Applicant',
    lastName: 'Two',
    gender: Gender.Female,
    phone: '0987654321',
    city: 'Vancouver',
    addressLine1: '789 Vancouver Rd.',
    postalCode: 'B1C2D3',
    disability: 'Requires walker',
    physicianName: 'Dr. Physician2',
    certificationDate: new Date(),
    patientEligibility: Eligibility.CannotWalk_100M,
    expiryDate: new Date(),
    physicianMspNumber: 67890,
    physicianAddressLine1: '789 Alberta Rd.',
    physicianCity: 'Calgary',
    physicianPostalCode: 'H4K3S0',
    physicianPhone: '8264029163',
    processingFee: 26,
    paymentMethod: PaymentType.Cheque,
    shopifyConfirmationNumber: '0145830',
    applicantId: 2,
    email: 'applicanttwo@gmail.com',
    applicationProcessingId: 3,
    isRenewal: false,
  },
  {
    firstName: 'Applicant',
    lastName: 'Three',
    gender: Gender.Male,
    phone: '4567891234',
    email: 'applicantthree@gmail.com',
    city: 'Vancouver',
    addressLine1: '789 Vancouver Rd.',
    postalCode: 'B1C2D3',
    disability: 'Requires walker',
    physicianName: 'Dr. Physician2',
    certificationDate: new Date(),
    patientEligibility: Eligibility.CannotWalk_100M,
    expiryDate: new Date(),
    physicianMspNumber: 67890,
    physicianAddressLine1: '789 Alberta Rd.',
    physicianCity: 'Calgary',
    physicianPostalCode: 'H4K3S0',
    physicianPhone: '8264029163',
    processingFee: 26,
    paymentMethod: PaymentType.Cheque,
    shopifyConfirmationNumber: '0245675',
    applicantId: 3,
    applicationProcessingId: 4,
  },
];

/**
 * Upsert applications
 * @param data Custom application data to be upserted
 */
export default async function applicationUpsert(data?: UpsertApplication[]): Promise<void> {
  for (const application of data || applications) {
    const { ...rest } = application;
    const applicationUpsert = await prisma.application.create({
      data: {
        dateOfBirth: new Date().toISOString(),
        ...rest,
      },
    });
    console.log({ applicationUpsert });
  }
}
