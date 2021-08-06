/* eslint-disable no-console */
// Relative paths required, path aliases throw error with seed command
import prisma from '../index'; // Prisma client
import { Gender, Province } from '../../lib/graphql/types'; // GraphQL types

// Seed data
const applicants = [
  {
    id: 1,
    firstName: 'Applicant',
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
  },
  {
    id: 2,
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
  },
];

/**
 * Upsert applicants
 */
export default async function applicantUpsert(): Promise<void> {
  const applicantUpserts = [];
  for (const applicant of applicants) {
    const { email, ...rest } = applicant;
    const applicantUpsert = await prisma.applicant.upsert({
      where: { email },
      update: { ...rest },
      create: { email, dateOfBirth: new Date().toISOString(), ...rest },
    });
    applicantUpserts.push(applicantUpsert);
    console.log({ applicantUpsert });
  }
}
