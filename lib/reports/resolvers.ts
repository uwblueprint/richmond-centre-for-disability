import { createObjectCsvStringifier } from 'csv-writer';
import { Resolver } from '@lib/graphql/resolvers';
import {
  QueryGeneratePermitHoldersReportArgs,
  GeneratePermitHoldersReportResult,
  QueryGenerateApplicationsReportArgs,
  GenerateApplicationsReportResult,
  QueryGenerateAccountantReportArgs,
  GenerateAccountantReportResult,
  PaymentType,
} from '@lib/graphql/types';
import { SortOrder } from '@tools/types';
import { formatAddress, formatFullName, formatPhoneNumber } from '@lib/utils/format'; // Formatting utils
import { formatDateTimeYYYYMMDDHHMMSS } from '@lib/utils/date'; // Formatting utils
import { formatDate } from '@lib/utils/date'; // Date formatter util
import { APPLICATIONS_COLUMNS, PERMIT_HOLDERS_COLUMNS } from '@tools/admin/reports';
import { Prisma } from '@prisma/client';
import { getSignedUrlForS3, serverUploadToS3 } from '@lib/utils/s3-utils';
import { ApolloError } from 'apollo-server-micro';
import moment from 'moment';

/**
 * Generates csv with permit holders' info, given a start date, end date, and values from
 * PermitHoldersReportColumn that the user would like to have on the generated csv
 * @returns Whether a csv could be generated (ok), and an AWS S3 file link
 */
export const generatePermitHoldersReport: Resolver<
  QueryGeneratePermitHoldersReportArgs,
  GeneratePermitHoldersReportResult
> = async (_, args, { prisma, session }) => {
  const {
    input: { startDate, endDate: inputEndDate, columns },
  } = args;

  const columnsSet = new Set(columns);

  if (!session) {
    // TODO: Create error
    throw new ApolloError('Not authenticated');
  }

  // Calculate end date as beginning of the next day
  const endDate = moment.utc(inputEndDate).add(1, 'd').toDate();

  const applicants = await prisma.applicant.findMany({
    where: {
      permits: {
        some: {
          expiryDate: {
            gte: startDate,
            lt: endDate,
          },
        },
      },
    },
    select: {
      id: true,
      firstName: true,
      middleName: true,
      lastName: true,
      dateOfBirth: true,
      addressLine1: true,
      addressLine2: true,
      city: true,
      province: true,
      postalCode: true,
      email: true,
      phone: true,
      status: true,
      guardian: {
        select: {
          firstName: true,
          middleName: true,
          lastName: true,
          relationship: true,
          addressLine1: true,
          addressLine2: true,
          postalCode: true,
          city: true,
          province: true,
        },
      },
      // Fetches rcdPermitId from latest permit
      permits: {
        orderBy: {
          createdAt: SortOrder.DESC,
        },
        take: 1,
        select: {
          rcdPermitId: true,
          type: true,
        },
      },
    },
  });

  // Formats fields and adds properties to allow for csv writing
  const csvApplicants = applicants.map(
    ({
      id,
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      addressLine1,
      addressLine2,
      city,
      province,
      postalCode,
      guardian,
      permits,
      phone,
      ...applicant
    }) => {
      return {
        ...applicant,
        id,
        phone: formatPhoneNumber(phone),
        dateOfBirth: formatDate(dateOfBirth),
        applicantName: formatFullName(firstName, middleName, lastName),
        rcdPermitId: `#${permits[0].rcdPermitId}`,
        permitType: permits[0].type,
        homeAddress: formatAddress(addressLine1, addressLine2, city, postalCode, province),
        guardianRelationship: guardian?.relationship,
        guardianPOAName:
          guardian && formatFullName(guardian.firstName, guardian.middleName, guardian.lastName),
        guardianPOAAddress:
          guardian &&
          formatAddress(
            guardian.addressLine1,
            guardian.addressLine2,
            guardian.city,
            guardian.postalCode,
            guardian.province
          ),
      };
    }
  );

  const csvHeaders = PERMIT_HOLDERS_COLUMNS.filter(({ value }) => columnsSet.has(value)).map(
    ({ name, reportColumnId }) => ({ id: reportColumnId, title: name })
  );

  // Generate CSV string from csv object.
  const csvStringifier = createObjectCsvStringifier({
    header: csvHeaders,
  });

  const csvStringRecords = csvStringifier.stringifyRecords(csvApplicants);
  const csvStringHeader = csvStringifier.getHeaderString();
  const csvString = csvStringHeader + csvStringRecords;

  // CSV naming format permit-holders-report-{employeeID}-{timestamp}.csv
  const employeeID = session.id;
  const timestamp = formatDateTimeYYYYMMDDHHMMSS(new Date());
  const fileName = `permit-holders-report-${employeeID}-${timestamp}.csv`;
  const s3ObjectKey = `rcd/reports/${fileName}`;

  // Upload csv to s3
  let uploadedCSV;
  let signedUrl;
  try {
    // Upload file to s3
    uploadedCSV = await serverUploadToS3(csvString, s3ObjectKey);
    // Generate a signed URL to access the file
    signedUrl = getSignedUrlForS3(uploadedCSV.key, 10, true);
  } catch (error) {
    throw new ApolloError(`Error uploading permit holders report to AWS: ${error}`);
  }
  return {
    ok: true,
    url: signedUrl,
  };
};

/**
 * Generates csv with applications' info, given a start date, end date, and values from
 * ApplicationsReportColumn that the user would like to have on the generated csv
 * @returns Whether a csv could be generated (ok), and an AWS S3 file link
 */
export const generateApplicationsReport: Resolver<
  QueryGenerateApplicationsReportArgs,
  GenerateApplicationsReportResult
> = async (_, args, { prisma, session }) => {
  const {
    input: { startDate, endDate: inputEndDate, columns },
  } = args;

  if (!session) {
    // TODO: Create error
    throw new ApolloError('Not authenticated');
  }

  const columnsSet = new Set(columns);

  // Calculate end date as beginning of the next day
  const endDate = moment.utc(inputEndDate).add(1, 'd').toDate();

  const applications = await prisma.application.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
    },
    select: {
      firstName: true,
      middleName: true,
      lastName: true,
      type: true,
      createdAt: true,
      paymentMethod: true,
      processingFee: true,
      donationAmount: true,
      applicant: {
        select: {
          id: true,
          dateOfBirth: true,
        },
      },
      newApplication: {
        select: {
          dateOfBirth: true,
        },
      },
      permit: {
        select: {
          rcdPermitId: true,
        },
      },
    },
  });

  // Formats the date fields and adds totalAmount, applicantName and rcdPermitId properties to allow for csv writing
  const csvApplications = applications.map(
    ({
      firstName,
      middleName,
      lastName,
      type,
      createdAt,
      processingFee,
      donationAmount,
      applicant,
      newApplication,
      permit,
      ...application
    }) => {
      let dateOfBirth: Date | null;
      switch (type) {
        case 'NEW':
          dateOfBirth = newApplication?.dateOfBirth || null;
          break;
        case 'RENEWAL':
        case 'REPLACEMENT':
          dateOfBirth = applicant?.dateOfBirth || null;
          break;
        default:
          dateOfBirth = null;
      }

      return {
        ...application,
        id: applicant?.id,
        dateOfBirth: dateOfBirth && formatDate(dateOfBirth),
        applicationDate: createdAt?.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: 'numeric',
          timeZone: 'America/Vancouver',
        }),
        applicantName: formatFullName(firstName, middleName, lastName),
        processingFee: `$${processingFee}`,
        donationAmount: `$${donationAmount}`,
        totalAmount: `$${processingFee.plus(donationAmount)}`,
        rcdPermitId: permit?.rcdPermitId ? `#${permit.rcdPermitId}` : null,
      };
    }
  );

  const csvHeaders = APPLICATIONS_COLUMNS.filter(({ value }) => columnsSet.has(value)).map(
    ({ name, reportColumnId }) => ({ id: reportColumnId, title: name })
  );

  // Generate CSV string from csv object.
  const csvStringifier = createObjectCsvStringifier({
    header: csvHeaders,
  });
  const csvStringRecords = csvStringifier.stringifyRecords(csvApplications);
  const csvStringHeader = csvStringifier.getHeaderString();
  const csvString = csvStringHeader + csvStringRecords;

  // CSV naming format reports/applications-report-{employeeID}-{timestamp}.csv
  const employeeID = session.id;
  const timestamp = formatDateTimeYYYYMMDDHHMMSS(new Date());
  const fileName = `applications-report-${employeeID}-${timestamp}.csv`;
  const s3ObjectKey = `rcd/reports/${fileName}`;

  // Upload csv to s3
  let uploadedCSV;
  let signedUrl;
  try {
    // Upload file to s3
    uploadedCSV = await serverUploadToS3(csvString, s3ObjectKey);
    // Generate a signed URL to access the file
    signedUrl = getSignedUrlForS3(uploadedCSV.key, 10, true);
  } catch (error) {
    throw new ApolloError(`Error uploading applications report to AWS: ${error}`);
  }

  return {
    ok: true,
    url: signedUrl,
  };
};

/**
 * Generates csv with accountants' info, given a start date and end date
 * @returns Whether a csv could be generated (ok), and an AWS S3 file link
 */
export const generateAccountantReport: Resolver<
  QueryGenerateAccountantReportArgs,
  GenerateAccountantReportResult
> = async (_, args, { prisma, session }) => {
  const {
    input: { startDate, endDate: inputEndDate },
  } = args;

  if (!session) {
    // TODO: Create error
    throw new ApolloError('Not authenticated');
  }

  const paymentTypeToString: Record<PaymentType, string> = {
    MASTERCARD: 'Mastercard (Office)',
    VISA: 'Visa (Office)',
    CASH: 'Cash',
    DEBIT: 'Interac - Debit (Office)',
    SHOPIFY: 'Shopify',
    ETRANSFER: 'E-Transfer',
    CHEQUE: 'Cheque',
  };

  // Calculate end date as beginning of the next day
  const endDate = moment.utc(inputEndDate).add(1, 'd').toDate();

  const paymentMethodGroups = await prisma.application.groupBy({
    by: ['paymentMethod'],
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
    },
    _sum: {
      processingFee: true,
      donationAmount: true,
    },
    _count: {
      paymentMethod: true,
    },
  });

  const totalAggregate = await prisma.application.aggregate({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      processingFee: true,
      donationAmount: true,
    },
    _count: {
      paymentMethod: true,
    },
  });

  const csvAccountantReportRows = [];
  for (const paymentMethodGroup of paymentMethodGroups) {
    csvAccountantReportRows.push({
      rowName: paymentTypeToString[paymentMethodGroup.paymentMethod],
      countIssued: paymentMethodGroup._count.paymentMethod,
      processingFee: `$${paymentMethodGroup._sum.processingFee || 0}`,
      donationAmount: `$${paymentMethodGroup._sum.donationAmount || 0}`,
      totalAmount: `$${Prisma.Decimal.add(
        paymentMethodGroup._sum.donationAmount || 0,
        paymentMethodGroup._sum.processingFee || 0
      )}`,
    });
  }
  csvAccountantReportRows.push({
    rowName: 'Total',
    countIssued: totalAggregate._count.paymentMethod || 0,
    processingFee: `$${totalAggregate._sum.processingFee || 0}`,
    donationAmount: `$${totalAggregate._sum.donationAmount || 0}`,
    totalAmount: `$${Prisma.Decimal.add(
      totalAggregate._sum.donationAmount || 0,
      totalAggregate._sum.processingFee || 0
    )}`,
  });

  const csvHeaders = [
    { id: 'rowName', title: '' },
    { id: 'countIssued', title: 'Issued #' },
    { id: 'processingFee', title: 'Fees' },
    { id: 'donationAmount', title: 'Donation' },
    { id: 'totalAmount', title: 'Total' },
  ];

  // Generate CSV string from csv object.
  const csvStringifier = createObjectCsvStringifier({
    header: csvHeaders,
  });
  const csvStringRecords = csvStringifier.stringifyRecords(csvAccountantReportRows);
  const csvStringHeader = csvStringifier.getHeaderString();
  const csvString = csvStringHeader + csvStringRecords;

  // CSV naming format accounting-report-{employeeID}-{timestamp}.csv
  const employeeID = session.id;
  const timestamp = formatDateTimeYYYYMMDDHHMMSS(new Date());
  const fileName = `accounting-report-${employeeID}-${timestamp}.csv`;
  const s3ObjectKey = `rcd/reports/${fileName}`;

  // Upload csv to s3
  let uploadedCSV;
  let signedUrl;
  try {
    // Upload file to s3
    uploadedCSV = await serverUploadToS3(csvString, s3ObjectKey);
    // Generate a signed URL to access the file
    signedUrl = getSignedUrlForS3(uploadedCSV.key, 10, true);
  } catch (error) {
    throw new ApolloError(`Error uploading accountant report to AWS: ${error}`);
  }

  return {
    ok: true,
    url: signedUrl,
  };
};
