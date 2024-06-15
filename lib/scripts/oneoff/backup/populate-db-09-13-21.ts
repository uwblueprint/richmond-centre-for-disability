/* eslint-disable */
import csv from 'csv-parser'; // CSV parser
import fs from 'fs'; // File system
import {
  ApplicantStatus,
  ApplicationStatus,
  Gender,
  PaymentType,
  PhysicianStatus,
  Province,
} from '@lib/graphql/types'; // GraphQL types
import {
  UpsertApplicant,
  UpsertApplication,
  UpsertApplicationProcessing,
  UpsertGuardian,
  UpsertMedicalInformation,
  UpsertPermit,
  UpsertPhysician,
} from '@prisma/types'; // Seeding types

// First ID of records to insert
const STARTING_INDEX = 10;

// Type of JS object parsed from CSV row
type CsvRow = {
  userid: string;
  permit_before: string;
  initial_apply_org: string;
  lastname: string;
  firstname: string;
  address: string;
  city: string;
  prov: string;
  postal_code: string;
  telephone: string;
  email_1: string;
  email_2: string;
  DOB: string;
  gender: string;
  application_date: string;
  permit_no: string;
  fee: string;
  donation: string;
  pay_method: string;
  disability: string;
  eligibility: string;
  certification_date: string;
  'permit expiry': string;
  receipt: string;
  'guardian-lastame': string;
  'guardian-firstName': string;
  'guardian-address': string;
  'guardian-unit': string;
  'guardian-telphone': string;
  relationship: string;
  'guardian-notes': string;
  physician: string;
  msp_number: string;
  notes: string;
  tax_receipt: string;
  tr_mailing_method: string;
  tr_firstname: string;
  tr_lastname: string;
  tr_address: string;
  tr_unit: string;
  tr_city: string;
  tr_province: string;
  tr_postalcode: string;
  tr_tel: string;
  tr_email: string;
};

/**
 * Get payment method based on string
 * @returns payment method as PaymentType enum
 */
function getPaymentMethod(paymentMethod: string): PaymentType {
  switch (paymentMethod) {
    case 'AMEX':
      return PaymentType.Amex;
    case 'MC':
      return PaymentType.Mastercard;
    case 'VISA':
      return PaymentType.Visa;
    case 'DC':
      return PaymentType.Debit;
    case 'CHQ':
      return PaymentType.Cheque;
    case 'CASH':
      return PaymentType.Cash;
    case 'MO':
      return PaymentType.MoneyOrder;
    default:
      return PaymentType.Cash;
  }
}

/**
 * Populate database with data from CSV file specified in command line arguments
 * Usage: `ts-node populate-db.ts <CSV filename>`
 * Created: September 13, 2021
 */
function populateDb() {
  const fileName = process.argv[2];

  if (!fileName) {
    console.log('Invalid CSV file specified');
  }

  // Parsed data
  const applicants: UpsertApplicant[] = [];
  const permits: UpsertPermit[] = [];
  const guardians: UpsertGuardian[] = [];
  const applications: UpsertApplication[] = [];
  const physicians: UpsertPhysician[] = [];
  const medicalInformations: UpsertMedicalInformation[] = [];
  const applicationProcessings: UpsertApplicationProcessing[] = [];

  /**
   * Extract the relevant fields from a CSV row and insert data into applicants, permits and applications tables
   * @param data parsed CSV data as a JS object
   * @param index the index of the row
   */
  function parseRow(data: CsvRow, index: number) {
    const physician: UpsertPhysician = {
      id: index,
      name: `Doctor ${data.msp_number}`,
      mspNumber: parseInt(data.msp_number),
      addressLine1: `${data.msp_number} Doctor Rd.`,
      city: 'Richmond',
      province: Province.Bc,
      postalCode: 'A1B2C3',
      phone: '1234567890',
      status: PhysicianStatus.Active,
    };

    const medicalInformation: UpsertMedicalInformation = {
      id: index,
      disability: data.disability,
      affectsMobility: data.eligibility.includes('Affected-Mobility'),
      mobilityAidRequired: data.eligibility.includes('Mobility Aid'),
      cannotWalk100m: data.eligibility.includes('Cannot-Walk-100m'),
      physicianId: index,
    };

    const guardian: UpsertGuardian | null =
      data['guardian-firstName'] && data['guardian-lastame']
        ? {
            id: index,
            firstName: data['guardian-firstName'],
            lastName: data['guardian-lastame'],
            phone: data['guardian-telphone'],
            province: Province.Bc,
            city: 'Richmond',
            addressLine1: data['guardian-address'],
            postalCode: 'A1B2C3',
            relationship: data.relationship,
          }
        : null;

    const applicant: UpsertApplicant = {
      id: index,
      rcdUserId: parseInt(data.userid),
      firstName: data.firstname,
      lastName: data.lastname,
      email: data.email_1 || data.email_2,
      gender: data.gender === 'Male' ? Gender.Male : Gender.Female,
      phone: data.telephone,
      province: data.prov as Province,
      city: data.city,
      addressLine1: data.address,
      postalCode: data.postal_code,
      guardianId: guardian ? index : null,
      medicalInformationId: index,
      status: ApplicantStatus.Active,
    };

    const applicationProcessing: UpsertApplicationProcessing = {
      id: index,
      status: ApplicationStatus.Completed,
      appNumber: parseInt(data.permit_no),
      appHolepunched: true,
      walletCardCreated: true,
      invoiceNumber: parseInt(data.receipt),
      documentUrls: [],
      appMailed: true,
    };

    const application: UpsertApplication = {
      id: index,
      rcdUserId: parseInt(data.userid),
      firstName: data.firstname,
      lastName: data.lastname,
      gender: data.gender as Gender,
      phone: data.telephone,
      province: data.prov as Province,
      city: data.city,
      addressLine1: data.address,
      postalCode: data.postal_code,
      disability: data.eligibility,
      aid: [],
      physicianName: `Doctor ${data.msp_number}`,
      physicianMspNumber: parseInt(data.msp_number),
      physicianAddressLine1: `${data.msp_number} Doctor Rd.`,
      physicianCity: 'Richmond',
      physicianProvince: Province.Bc,
      physicianPostalCode: 'A1B2C3',
      physicianPhone: '1234567890',
      processingFee: parseInt(data.fee),
      paymentMethod: getPaymentMethod(data.pay_method),
      shopifyConfirmationNumber: data.receipt,
      applicantId: index,
      email: data.email_1 || data.email_2 || null,
      shippingFullName: `${data.firstname} ${data.lastname}`,
      shippingAddressLine1: data.address,
      shippingCity: data.city,
      shippingProvince: Province.Bc,
      shippingPostalCode: 'A1B2C3',
      billingFullName: `${data.firstname} ${data.lastname}`,
      applicationProcessingId: index,
      paidThroughShopify: false,
      shopifyPaymentStatus: null,
      shopifyOrderNumber: null,
    };

    const permit: UpsertPermit = {
      rcdPermitId: parseInt(data.permit_no),
      applicantId: index,
      applicationId: index,
      expiryDate: new Date(data['permit expiry']),
      active: new Date().getTime() < new Date(data['permit expiry']).getTime(),
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

  // Pipe CSV data to `data`
  fs.createReadStream(fileName)
    .pipe(csv())
    .on('data', (data: CsvRow) => {
      parseRow(data, STARTING_INDEX + rowNumber++);
    });

  // If no rows were parsed, we are done
  if (applicants.length === 0) {
    console.log('Nothing to be done.');
    return;
  }

  // Otherwise, upsert data
  // TODO
}

populateDb();
