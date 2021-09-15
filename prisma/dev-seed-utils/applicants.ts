/* eslint-disable no-console */
// Relative paths required, path aliases throw error with seed command
import prisma from '../index'; // Prisma client
import { Gender, Province, ApplicantStatus } from '../../lib/graphql/types'; // GraphQL types
import { UpsertApplicant } from '../types'; // Seeding types

// Seed data
const applicants = [
  {
    id: 1,
    rcdUserId: 12345,
    firstName: 'Applicant',
    middleName: 'Middle-One',
    lastName: 'One',
    email: 'applicantone@email.com',
    gender: Gender.Male,
    phone: '1234567890',
    province: Province.Bc,
    city: 'Richmond',
    addressLine1: '123 Richmond St.',
    postalCode: 'X0X0X0',
    guardianId: 1,
    medicalInformationId: 1,
    status: ApplicantStatus.Active,
  },
  {
    id: 2,
    rcdUserId: 23456,
    firstName: 'Applicant',
    lastName: 'Two',
    email: 'applicanttwo@email.com',
    gender: Gender.Female,
    phone: '0987654321',
    province: Province.Bc,
    city: 'Surrey',
    addressLine1: '321 Surrey St.',
    postalCode: 'A1B2C3',
    guardianId: 2,
    medicalInformationId: 2,
    status: ApplicantStatus.Active,
  },
  {
    id: 3,
    firstName: 'Applicant',
    lastName: 'Three',
    email: 'applicantthree@email.com',
    gender: Gender.Male,
    phone: '4567891234',
    province: Province.Bc,
    city: 'Vancouver',
    addressLine1: '456 BC Way',
    postalCode: 'B1C2D3',
    rcdUserId: 3,
    guardianId: 3,
    medicalInformationId: 3,
    status: ApplicantStatus.Inactive,
  },
];

/**
 * Upsert applicants
 * @param data Custom applicant data to be upserted
 */
export default async function applicantUpsert(data?: UpsertApplicant[]): Promise<void> {
  for (const applicant of data || applicants) {
    const { id, ...rest } = applicant;
    const applicantUpsert = await prisma.applicant.upsert({
      where: { id },
      update: rest,
      create: { dateOfBirth: new Date().toISOString(), ...rest },
    });
    console.log({ applicantUpsert });
  }
}
