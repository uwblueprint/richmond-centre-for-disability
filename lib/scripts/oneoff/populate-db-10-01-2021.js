/* eslint-disable */
const csv = require('csv-parser'); // CSV parser
const fs = require('fs'); // File system
const { PrismaClient } = require('@prisma/client'); // Prisma client

// First ID of records to insert
const STARTING_INDEX = 100;

// Prisma Client
const prisma = new PrismaClient();

/**
 * Get payment method based on string
 * @returns payment method as PaymentType enum
 */
function getPaymentMethod(paymentMethod) {
  switch (paymentMethod) {
    case 'AMEX':
      return 'AMEX';
    case 'MC':
      return 'MASTERCARD';
    case 'VISA':
      return 'VISA';
    case 'DC':
      return 'DEBIT';
    case 'CHQ':
      return 'CHEQUE';
    case 'CASH':
      return 'CASH';
    case 'MO':
      return 'MONEY_ORDER';
    default:
      return 'CASH';
  }
}

/**
 * Populate database with data from CSV file specified in command line arguments.
 * Sample data should contain pending applications. RCD sample permit data expiry dates are
 * adjusted 3 years earlier so that applicants have valid most recent APPs
 * Usage: `ts-node populate-db.ts <CSV filename>`
 * Created: October 1, 2021
 */
function populateDb() {
  const fileName = process.argv[2];

  if (!fileName) {
    console.log('Invalid CSV file specified');
  }

  // Parsed data
  const applicants = [];
  const permits = [];
  const guardians = [];
  const applications = [];
  const physicians = [];
  const medicalInformations = [];
  const applicationProcessings = [];

  /**
   * Extract the relevant fields from a CSV row and insert data into applicants, permits and applications tables
   * @param data parsed CSV data as a JS object
   * @param index the index of the row
   */
  function parseRow(data, index) {
    const physician = {
      id: parseInt(data.msp_number) || 90000 + index,
      name: `Doctor ${data.msp_number}`,
      mspNumber: parseInt(data.msp_number) || 90000 + index,
      addressLine1: `${data.msp_number} Doctor Rd.`,
      city: 'Richmond',
      province: 'BC',
      postalCode: 'A1B2C3',
      phone: '1234567890',
      status: 'ACTIVE',
    };

    const medicalInformation = {
      id: index,
      disability: data.disability,
      patientEligibility: data.eligibility.includes('Affected-Mobility')
        ? 'AFFECTS_MOBILITY'
        : data.eligibility.includes('Mobility Aid')
        ? 'MOBILITY_AID_REQUIRED'
        : data.eligibility.includes('Cannot-Walk-100m')
        ? 'CANNOT_WALK_100M'
        : 'OTHER',
      physicianId: parseInt(data.msp_number) || 90000 + index,
    };

    const guardian =
      data['guardian-firstName'] && data['guardian-lastame']
        ? {
            id: index,
            firstName: data['guardian-firstName'],
            lastName: data['guardian-lastame'],
            phone: data['guardian-telphone'],
            province: 'BC',
            city: 'Richmond',
            addressLine1: data['guardian-address'],
            postalCode: 'A1B2C3',
            relationship: data.relationship,
          }
        : null;

    const applicant = {
      id: index,
      rcdUserId: parseInt(data.userid) || 90000 + index,
      firstName: data.firstname,
      lastName: data.lastname,
      email: data.email_1 || data.email_2 || null,
      gender: data.gender === 'Male' ? 'MALE' : 'FEMALE',
      phone: data.telephone,
      province: data.prov,
      city: data.city,
      addressLine1: data.address,
      postalCode: data.postal_code,
      guardianId: guardian ? index : null,
      medicalInformationId: index,
      status: 'ACTIVE',
      dateOfBirth: new Date(data.DOB),
    };

    const applicationProcessing = {
      id: index,
    };

    const application = {
      id: index,
      rcdUserId: parseInt(data.userid) || 90000 + index,
      firstName: data.firstname,
      lastName: data.lastname,
      gender: data.gender === 'Male' ? 'MALE' : 'FEMALE',
      phone: data.telephone,
      province: data.prov,
      city: data.city,
      addressLine1: data.address,
      postalCode: data.postal_code,
      disability: data.eligibility,
      patientEligibility: data.eligibility.includes('Affected-Mobility')
        ? 'AFFECTS_MOBILITY'
        : data.eligibility.includes('Mobility Aid')
        ? 'MOBILITY_AID_REQUIRED'
        : data.eligibility.includes('Cannot-Walk-100m')
        ? 'CANNOT_WALK_100M'
        : 'OTHER',
      aid: [],
      physicianName: `Doctor ${data.msp_number}`,
      physicianMspNumber: parseInt(data.msp_number) || 90000 + index,
      physicianAddressLine1: `${data.msp_number} Doctor Rd.`,
      physicianCity: 'Richmond',
      physicianProvince: 'BC',
      physicianPostalCode: 'A1B2C3',
      physicianPhone: '1234567890',
      processingFee: parseInt(data.fee) || 90000 + index,
      donationAmount: parseInt(data.donation) || 0,
      paymentMethod: getPaymentMethod(data.pay_method),
      shopifyConfirmationNumber: data.receipt,
      applicantId: index,
      email: data.email_1 || data.email_2 || null,
      shippingFullName: `${data.firstname} ${data.lastname}`,
      shippingAddressLine1: data.address,
      shippingCity: data.city,
      shippingProvince: 'BC',
      shippingPostalCode: 'A1B2C3',
      billingFullName: `${data.firstname} ${data.lastname}`,
      applicationProcessingId: index,
      dateOfBirth: new Date(data.DOB),
    };

    const permitExpiryDate = new Date(data['permit expiry']);
    permitExpiryDate.setFullYear(permitExpiryDate.getFullYear() - 3);
    const permit = {
      rcdPermitId: parseInt(data.permit_no) || 90000 + index,
      applicantId: index,
      applicationId: index,
      expiryDate: permitExpiryDate,
      active: new Date().getTime() < permitExpiryDate.getTime(),
    };

    physicians.push(physician);
    medicalInformations.push(medicalInformation);
    if (guardian) {
      guardians.push(guardian);
    }
    applicants.push(applicant);
    applicationProcessings.push(applicationProcessing);
    applications.push(application);
    permits.push(permit);
  }

  let rowNumber = 0;

  // Pipe CSV data to data arrays and populate DB
  fs.createReadStream(fileName)
    .pipe(csv())
    .on('data', data => {
      parseRow(data, STARTING_INDEX + rowNumber++);
    })
    .on('end', async () => {
      // If no rows were parsed, we are done
      if (applicants.length === 0) {
        console.log('Nothing to be done.');
        return;
      }

      // Otherwise, upsert data
      // TODO: Reduce duplicate code and use seeding functions
      // Upsert physicians
      for (const physician of physicians) {
        const { mspNumber, ...rest } = physician;
        const physicianUpsert = await prisma.physician.upsert({
          where: { mspNumber },
          update: rest,
          create: physician,
        });
        console.log({ physicianUpsert });
      }

      // Upsert medical information
      for (const medicalInformation of medicalInformations) {
        const { id, ...rest } = medicalInformation;
        const medicalInformationUpsert = await prisma.medicalInformation.upsert({
          where: { id },
          update: rest,
          create: medicalInformation,
        });
        console.log({ medicalInformationUpsert });
      }

      // Upsert guardians
      for (const guardian of guardians) {
        const { id, ...rest } = guardian;
        const guardianUpsert = await prisma.guardian.upsert({
          where: { id },
          update: rest,
          create: guardian,
        });
        console.log({ guardianUpsert });
      }

      // Upsert applicants
      for (const applicant of applicants) {
        const { rcdUserId, ...rest } = applicant;
        const applicantUpsert = await prisma.applicant.upsert({
          where: { rcdUserId },
          update: rest,
          create: applicant,
        });
        console.log({ applicantUpsert });
      }

      // Upsert application processings
      for (const applicationProcessing of applicationProcessings) {
        const { id, ...rest } = applicationProcessing;
        const applicationProcessingUpsert = await prisma.applicationProcessing.upsert({
          where: { id },
          update: rest,
          create: applicationProcessing,
        });
        console.log({ applicationProcessingUpsert });
      }

      // Upsert applications
      for (const application of applications) {
        const { id, ...rest } = application;
        const applicationUpsert = await prisma.application.upsert({
          where: { id },
          update: rest,
          create: application,
        });
        console.log({ applicationUpsert });
      }

      // Upsert permits
      for (const permit of permits) {
        const { rcdPermitId, expiryDate = new Date().toISOString(), ...rest } = permit;
        const permitUpsert = await prisma.permit.upsert({
          where: { rcdPermitId },
          update: rest,
          create: { rcdPermitId, expiryDate, ...rest },
        });
        console.log({ permitUpsert });
      }

      process.exit(0);
    });
}

populateDb();
