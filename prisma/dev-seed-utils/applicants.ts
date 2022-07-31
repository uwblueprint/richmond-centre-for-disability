/* eslint-disable no-console */
// Relative paths required, path aliases throw error with seed command
import prisma from '../index'; // Prisma client
import { UpsertApplicant } from '../types'; // Seeding types

// Seed data
const applicants: Array<UpsertApplicant> = [
  {
    id: 1,
    firstName: 'Applicant',
    middleName: 'Middle-One',
    lastName: 'One',
    dateOfBirth: new Date('2001-01-01'),
    gender: 'MALE',
    phone: '1234567890',
    email: 'applicantone@email.com',
    receiveEmailUpdates: true,
    province: 'BC',
    city: 'Richmond',
    addressLine1: '123 Richmond St.',
    postalCode: 'X0X0X0',
    guardian: {
      firstName: 'Guardian',
      middleName: null,
      lastName: 'One',
      phone: '1234567890',
      city: 'Richmond',
      addressLine1: '123 Richmond St.',
      addressLine2: null,
      postalCode: 'X0X0X0',
      relationship: 'Father',
    },
    medicalInformation: {
      disability: 'Fractured knee',
      disabilityCertificationDate: new Date('2021-01-01'),
      patientCondition: ['AFFECTS_MOBILITY'],
      mobilityAids: [],
      otherPatientCondition: null,
      physician: {
        mspNumber: '12345',
        firstName: 'Doctor',
        lastName: 'One',
        phone: '1234567889',
        addressLine1: '162 University Ave.',
        addressLine2: null,
        city: 'Waterloo',
        postalCode: 'A1B2C3',
      },
    },
    status: 'ACTIVE',
  },
  {
    id: 2,
    firstName: 'Applicant',
    middleName: null,
    lastName: 'Two',
    dateOfBirth: new Date('1930-03-29'),
    gender: 'FEMALE',
    phone: '0987654321',
    email: 'applicanttwo@email.com',
    receiveEmailUpdates: false,
    province: 'BC',
    city: 'Surrey',
    addressLine1: '321 Surrey St.',
    postalCode: 'A1B2C3',
    guardian: {
      firstName: 'Guardian',
      middleName: 'Middle',
      lastName: 'Two',
      phone: '0987654321',
      city: 'Surrey',
      addressLine1: '321 Surrey St.',
      addressLine2: null,
      postalCode: 'A1B2C3',
      relationship: 'Mother',
    },
    medicalInformation: {
      disability: 'Sprained ankle',
      disabilityCertificationDate: new Date('2021-02-02'),
      patientCondition: ['MOBILITY_AID_REQUIRED'],
      mobilityAids: ['WALKER'],
      otherPatientCondition: null,
      physician: {
        mspNumber: '12346',
        firstName: 'Doctor',
        lastName: 'Two',
        phone: '2345678901',
        addressLine1: '163 University Ave.',
        addressLine2: null,
        city: 'Burnaby',
        postalCode: 'N1M2K3',
      },
    },
    status: 'ACTIVE',
  },
  {
    id: 3,
    firstName: 'Applicant',
    middleName: null,
    lastName: 'Three',
    dateOfBirth: new Date('1970-01-01'),
    gender: 'MALE',
    phone: '4567891234',
    email: 'applicantthree@email.com',
    receiveEmailUpdates: true,
    province: 'BC',
    city: 'Vancouver',
    addressLine1: '456 BC Way',
    postalCode: 'B1C2D3',
    // No guardian
    medicalInformation: {
      disability: 'Sprained ankle',
      disabilityCertificationDate: new Date('2021-03-03'),
      patientCondition: ['CANNOT_WALK_100M'],
      mobilityAids: ['SCOOTER', 'CANE'],
      otherPatientCondition: null,
      physician: {
        // Same as applicant 2
        mspNumber: '12346',
        firstName: 'Doctor',
        lastName: 'Two',
        phone: '2345678901',
        addressLine1: '163 University Ave.',
        addressLine2: null,
        city: 'Burnaby',
        postalCode: 'N1M2K3',
      },
    },
    status: 'INACTIVE',
  },
  {
    id: 4,
    firstName: 'Applicant',
    middleName: null,
    lastName: 'Four',
    dateOfBirth: new Date('1930-03-29'),
    gender: 'FEMALE',
    phone: '0987654321',
    email: 'applicantfour@email.com',
    receiveEmailUpdates: false,
    province: 'BC',
    city: 'Surrey',
    addressLine1: '421 Surrey St.',
    postalCode: 'A1B2C3',
    guardian: {
      firstName: 'Guardian',
      middleName: 'Middle',
      lastName: 'Four',
      phone: '0987654322',
      city: 'Surrey',
      addressLine1: '321 Surrey St.',
      addressLine2: null,
      postalCode: 'A1B2C3',
      relationship: 'Brother',
    },
    medicalInformation: {
      disability: 'Broken ankle',
      disabilityCertificationDate: new Date('2021-04-04'),
      patientCondition: ['MOBILITY_AID_REQUIRED'],
      mobilityAids: ['WALKER'],
      otherPatientCondition: null,
      physician: {
        mspNumber: '12344',
        firstName: 'Doctor',
        lastName: 'Four',
        phone: '2345678904',
        addressLine1: '164 University Ave.',
        addressLine2: null,
        city: 'Burnaby',
        postalCode: 'N1M2K3',
      },
    },
    status: 'ACTIVE',
  },
];

/**
 * Upsert applicants
 * @param data Custom applicant data to be upserted
 */
export default async function applicantUpsert(data?: UpsertApplicant[]): Promise<void> {
  for (const applicant of data || applicants) {
    const {
      id,
      guardian,
      medicalInformation: { physician, ...medicalInformation },
      ...rest
    } = applicant;
    const applicantUpsert = await prisma.applicant.upsert({
      where: { id },
      create: {
        ...rest,
        ...(guardian && { guardian: { create: guardian } }),
        medicalInformation: {
          create: {
            ...medicalInformation,
            physician: {
              connectOrCreate: { where: { mspNumber: physician.mspNumber }, create: physician },
            },
          },
        },
      },
      update: {
        ...rest,
        ...(guardian && { guardian: { create: guardian } }),
        medicalInformation: {
          create: {
            ...medicalInformation,
            physician: {
              connectOrCreate: { where: { mspNumber: physician.mspNumber }, create: physician },
            },
          },
        },
      },
    });
    console.log({ applicantUpsert });
  }
}
