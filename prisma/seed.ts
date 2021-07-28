/* eslint-disable no-console */
import prisma from '../prisma/index'; // Relative path required, path aliases throw error with seed command
import {
  Role,
  Gender,
  Province,
  PaymentType,
  Aid,
  ReasonForReplacement,
} from '../lib/graphql/types'; // Relative path required for seed script

/**
 * Main program
 */
const main = async () => {
  if (process.env.NODE_ENV === 'production') {
    await prodSeed();
  } else {
    await devSeed();
  }
};
/**
 * Production seeding
 */
const prodSeed = async () => {
  const employees = [
    {
      firstName: 'Oustan',
      lastName: 'Ding',
      email: 'oustanding+employee@uwblueprint.org',
    },
  ];
  await employeeUpsert(employees);
};
/**
 * Development seeding
 */
const devSeed = async () => {
  // Upsert employees
  const employees = [
    {
      firstName: 'Oustan',
      lastName: 'Ding',
      email: 'oustanding+employee@uwblueprint.org',
    },
    {
      firstName: 'Christian',
      lastName: 'Chan',
      email: 'christianchan+employee@uwblueprint.org',
    },
    {
      firstName: 'Jihad',
      lastName: 'Bunkheila',
      email: 'jihadbunkheila+employee@uwblueprint.org',
    },
    {
      firstName: 'Angela',
      lastName: 'Dietz',
      email: 'angeladietz+employee@uwblueprint.org',
    },
    {
      firstName: 'Emilio',
      lastName: 'Mena',
      email: 'emiliomena+employee@uwblueprint.org',
    },
    {
      firstName: 'Jeffrey',
      lastName: 'Zhang',
      email: 'jeffreyzhang+employee@uwblueprint.org',
    },
    {
      firstName: 'Jennifer',
      lastName: 'Tsai',
      email: 'jennifertsai+employee@uwblueprint.org',
    },
  ];
  await employeeUpsert(employees);

  // Upsert applicants
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
    },
  ];
  await applicantUpsert(applicants);

  // Upsert applications
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
  await applicationUpsert(applications);

  // Upsert replacements
  const replacements = [
    {
      id: 1,
      reason: ReasonForReplacement.Lost,
      lostTimestamp: new Date(),
      lostLocation: 'The library',
      description: 'I lost my APP at the library',
      applicationId: 2,
    },
  ];
  await replacementUpsert(replacements);

  // Upsert application processings
  const applicationProcessings = [
    {
      id: 1,
      applicationId: 1,
    },
    {
      id: 2,
      applicationId: 2,
    },
  ];
  await applicationProcessingUpsert(applicationProcessings);

  // Upsert permits
  const permits = [{ rcdPermitId: 1, applicantId: 1, applicationId: 1 }];
  await permitUpsert(permits);
};

/**
 * Upsert employees
 * @param employees - Employees to upsert
 */
const employeeUpsert = async (
  employees: { firstName: string; lastName: string; email: string }[]
) => {
  const employeeUpserts = [];
  for (const employee of employees) {
    const employeeUpsert = await prisma.employee.upsert({
      where: { email: employee.email },
      update: {
        role: Role.Admin,
        firstName: employee.firstName,
        lastName: employee.lastName,
        emailVerified: new Date().toISOString(),
      },
      create: {
        role: Role.Admin,
        email: employee.email,
        firstName: employee.firstName,
        lastName: employee.lastName,
        emailVerified: new Date().toISOString(),
      },
    });
    employeeUpserts.push(employeeUpsert);
    console.log({ employeeUpsert });
  }
};

/**
 * Upsert applicants
 * @param applicants - Applicants to upsert
 */
const applicantUpsert = async (
  applicants: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    gender: Gender;
    phone: string;
    province: Province;
    city: string;
    addressLine1: string;
    postalCode: string;
  }[]
) => {
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
};

/**
 * Upsert applications
 * @param applications - Applications to upsert
 */
const applicationUpsert = async (
  applications: {
    id: number;
    firstName: string;
    lastName: string;
    gender: Gender;
    phone: string;
    province: Province;
    city: string;
    addressLine1: string;
    postalCode: string;
    disability: string;
    aid: Aid[];
    physicianName: string;
    physicianMspNumber: number;
    physicianAddressLine1: string;
    physicianCity: string;
    physicianProvince: Province;
    physicianPostalCode: string;
    physicianPhone: string;
    processingFee: number;
    paymentMethod: PaymentType;
    shopifyConfirmationNumber: string;
  }[]
) => {
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
};

/**
 * Upsert replacement applications
 * @param replacements - Replacement records to upsert
 */
const replacementUpsert = async (
  replacements: {
    id: number;
    reason: ReasonForReplacement;
    lostTimestamp?: Date;
    lostLocation?: string;
    stolenPoliceFileNumber?: number;
    stolenJurisdiction?: string;
    stolenPoliceOfficerName?: string;
    description?: string;
    applicationId: number;
  }[]
) => {
  const replacementUpserts = [];
  for (const replacement of replacements) {
    const { id, ...rest } = replacement;
    const replacementUpsert = await prisma.replacement.upsert({
      where: { id },
      update: { ...rest },
      create: replacement,
    });
    replacementUpserts.push(replacementUpsert);
    console.log({ replacementUpsert });
  }
};

/**
 * Upsert application processing records
 * @param applicationProcessings - Application processing records to upsert
 */
const applicationProcessingUpsert = async (
  applicationProcessings: {
    id: number;
    applicationId: number;
  }[]
) => {
  const applicationProcessingUpserts = [];
  for (const applicationProcessing of applicationProcessings) {
    const { id, ...rest } = applicationProcessing;
    const applicationProcessingUpsert = await prisma.applicationProcessing.upsert({
      where: { id },
      update: { ...rest },
      create: applicationProcessing,
    });
    applicationProcessingUpserts.push(applicationProcessingUpsert);
    console.log({ applicationProcessingUpsert });
  }
};

/**
 * Upsert permits
 * @param permits - Permits to upsert
 */
const permitUpsert = async (
  permits: {
    rcdPermitId: number;
    applicantId: number;
    applicationId: number;
  }[]
) => {
  const permitUpserts = [];
  for (const permit of permits) {
    const { rcdPermitId, ...rest } = permit;
    const permitUpsert = await prisma.permit.upsert({
      where: { rcdPermitId },
      update: { ...rest },
      create: { rcdPermitId, expiryDate: new Date().toISOString(), ...rest },
    });
    permitUpserts.push(permitUpsert);
    console.log({ permitUpsert });
  }
};

// Execute seeding
main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
