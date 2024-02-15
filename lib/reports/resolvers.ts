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
import { formatFullName, formatPhoneNumber, formatPostalCode } from '@lib/utils/format'; // Formatting utils
import {
  formatDateTimeYYYYMMDDHHMMSS,
  formatDateYYYYMMDD,
  formatDateYYYYMMDDLocal,
} from '@lib/utils/date'; // Formatting utils
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
> = async (_, args, { prisma, session, logger }) => {
  const {
    input: { startDate, endDate: inputEndDate, columns },
  } = args;

  const columnsSet = new Set(columns);

  if (!session) {
    return { ok: false, error: 'Not authenticated', url: null };
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
          expiryDate: SortOrder.DESC,
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
      postalCode,
      dateOfBirth,
      guardian,
      permits,
      phone,
      ...applicant
    }) => {
      return {
        ...applicant,
        id,
        phone: formatPhoneNumber(phone),
        dateOfBirth: formatDateYYYYMMDD(dateOfBirth),
        applicantName: formatFullName(firstName, middleName, lastName),
        postalCode: formatPostalCode(postalCode),
        rcdPermitId: `#${permits[0].rcdPermitId}`,
        permitType: permits[0].type,
        guardianRelationship: guardian?.relationship,
        guardianPOAName:
          guardian && formatFullName(guardian.firstName, guardian.middleName, guardian.lastName),
        guardianAddressLine1: guardian && guardian.addressLine1,
        guardianAddressLine2: guardian && guardian.addressLine2,
        guardianCity: guardian && guardian.city,
        guardianPostalCode:
          guardian && guardian.postalCode && formatPostalCode(guardian.postalCode),
        guardianProvince: guardian && guardian.province,
      };
    }
  );

  const filteredColumns = PERMIT_HOLDERS_COLUMNS.filter(({ value }) => columnsSet.has(value));
  const csvHeaders: Array<{ id: string; title: string }> = [];
  for (const { name, reportColumnId } of filteredColumns) {
    if (typeof reportColumnId === 'string') {
      csvHeaders.push({ id: reportColumnId, title: name });
    } else {
      for (const [columnLabel, columnId] of reportColumnId) {
        csvHeaders.push({ id: columnId, title: columnLabel });
      }
    }
  }

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
    const message = `Error uploading permit holders report to AWS: ${error}`;
    logger.error({ error: message });
    throw new ApolloError(message);
  }
  return {
    ok: true,
    error: null,
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
> = async (_, args, { prisma, session, logger }) => {
  const {
    input: { startDate, endDate: inputEndDate, columns },
  } = args;

  if (!session) {
    return { ok: false, error: 'Not authenticated', url: null };
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
      secondPaymentMethod: true,
      secondProcessingFee: true,
      secondDonationAmount: true,
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

  // Formats the date fields and adds totalAmount, paymentRefunded, applicantName and rcdPermitId properties to allow for csv writing
  const csvApplications = applications.map(
    ({
      firstName,
      middleName,
      lastName,
      type,
      createdAt,
      processingFee,
      donationAmount,
      secondProcessingFee,
      secondDonationAmount,
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
        dateOfBirth: dateOfBirth && formatDateYYYYMMDD(dateOfBirth),
        applicationDate: createdAt ? formatDateYYYYMMDDLocal(createdAt, true) : null,
        applicantName: formatFullName(firstName, middleName, lastName),
        processingFee: `$${Prisma.Decimal.add(processingFee, secondProcessingFee || 0)}`,
        donationAmount: `$${Prisma.Decimal.add(donationAmount, secondDonationAmount || 0)}`,
        totalAmount: `$${Prisma.Decimal.add(
          Prisma.Decimal.add(processingFee, donationAmount),
          Prisma.Decimal.add(secondProcessingFee || 0, secondDonationAmount || 0)
        )}`,
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
    const message = `Error uploading applications report to AWS: ${error}`;
    logger.error({ error: message });
    throw new ApolloError(message);
  }

  return {
    ok: true,
    error: null,
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
> = async (_, args, { prisma, session, logger }) => {
  const {
    input: { startDate, endDate: inputEndDate },
  } = args;

  if (!session) {
    return { ok: false, error: 'Not authenticated', url: null };
  }

  const paymentTypeToString: Record<PaymentType, string> = {
    AMEX: 'American Express (Office)',
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

  const refundMethodGroups = await prisma.application.groupBy({
    by: ['paymentMethod'],
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
      applicationProcessing: {
        paymentRefunded: true,
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

  const refundAggregate = await prisma.application.aggregate({
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
      applicationProcessing: {
        paymentRefunded: true,
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

  const secondPaymentMethodGroups = await prisma.application.groupBy({
    by: ['secondPaymentMethod'],
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
      hasSecondPaymentMethod: true,
    },
    _sum: {
      secondProcessingFee: true,
      secondDonationAmount: true,
    },
    _count: {
      secondPaymentMethod: true,
    },
  });

  const secondRefundMethodGroups = await prisma.application.groupBy({
    by: ['secondPaymentMethod'],
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
      applicationProcessing: {
        paymentRefunded: true,
      },
      hasSecondPaymentMethod: true,
    },
    _sum: {
      secondProcessingFee: true,
      secondDonationAmount: true,
    },
    _count: {
      secondPaymentMethod: true,
    },
  });

  const secondTotalAggregate = await prisma.application.aggregate({
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
      hasSecondPaymentMethod: true,
    },
    _sum: {
      secondProcessingFee: true,
      secondDonationAmount: true,
    },
    _count: {
      secondPaymentMethod: true,
    },
  });

  const secondRefundAggregate = await prisma.application.aggregate({
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
      applicationProcessing: {
        paymentRefunded: true,
      },
      hasSecondPaymentMethod: true,
    },
    _sum: {
      secondProcessingFee: true,
      secondDonationAmount: true,
    },
    _count: {
      secondPaymentMethod: true,
    },
  });

  const summedPaymentMethodGroups: {
    [key: string]: {
      countIssued: Prisma.Decimal;
      processingFee: Prisma.Decimal;
      donationAmount: Prisma.Decimal;
      refundAmount: Prisma.Decimal;
      totalAmount: Prisma.Decimal;
    };
  } = {};

  for (const paymentMethodGroup of paymentMethodGroups) {
    const refundMethodGroup = refundMethodGroups.find(group => {
      return group.paymentMethod == paymentMethodGroup.paymentMethod;
    }) || { _sum: { processingFee: 0, donationAmount: 0 } };
    const rowName = paymentTypeToString[paymentMethodGroup.paymentMethod];
    const countIssued = paymentMethodGroup._count.paymentMethod || 0;
    const processingFee = paymentMethodGroup._sum.processingFee || 0;
    const donationAmount = paymentMethodGroup._sum.donationAmount || 0;
    const refundAmount = Prisma.Decimal.add(
      refundMethodGroup._sum.processingFee || 0,
      refundMethodGroup._sum.donationAmount || 0
    );
    const totalAmount = Prisma.Decimal.add(
      Prisma.Decimal.add(processingFee, donationAmount),
      -refundAmount
    );

    if (!summedPaymentMethodGroups[rowName]) {
      summedPaymentMethodGroups[rowName] = {
        countIssued: new Prisma.Decimal(0),
        processingFee: new Prisma.Decimal(0),
        donationAmount: new Prisma.Decimal(0),
        refundAmount: new Prisma.Decimal(0),
        totalAmount: new Prisma.Decimal(0),
      };
    }

    summedPaymentMethodGroups[rowName].countIssued = Prisma.Decimal.add(
      summedPaymentMethodGroups[rowName].countIssued,
      countIssued
    );
    summedPaymentMethodGroups[rowName].processingFee = Prisma.Decimal.add(
      summedPaymentMethodGroups[rowName].processingFee,
      processingFee
    );
    summedPaymentMethodGroups[rowName].donationAmount = Prisma.Decimal.add(
      summedPaymentMethodGroups[rowName].donationAmount,
      donationAmount
    );
    summedPaymentMethodGroups[rowName].refundAmount = Prisma.Decimal.add(
      summedPaymentMethodGroups[rowName].refundAmount,
      refundAmount
    );
    summedPaymentMethodGroups[rowName].totalAmount = Prisma.Decimal.add(
      summedPaymentMethodGroups[rowName].totalAmount,
      totalAmount
    );
  }

  for (const paymentMethodGroup of secondPaymentMethodGroups) {
    const refundMethodGroup = secondRefundMethodGroups.find(group => {
      return group.secondPaymentMethod == paymentMethodGroup.secondPaymentMethod;
    }) || { _sum: { secondProcessingFee: 0, secondDonationAmount: 0 } };
    if (!paymentMethodGroup.secondPaymentMethod) {
      continue;
    }
    const rowName = paymentTypeToString[paymentMethodGroup.secondPaymentMethod];
    const countIssued = paymentMethodGroup._count.secondPaymentMethod || 0;
    const processingFee = paymentMethodGroup._sum.secondProcessingFee || 0;
    const donationAmount = paymentMethodGroup._sum.secondDonationAmount || 0;
    const refundAmount = Prisma.Decimal.add(
      refundMethodGroup._sum.secondProcessingFee || 0,
      refundMethodGroup._sum.secondDonationAmount || 0
    );
    const totalAmount = Prisma.Decimal.add(
      Prisma.Decimal.add(processingFee, donationAmount),
      -refundAmount
    );

    if (!summedPaymentMethodGroups[rowName]) {
      summedPaymentMethodGroups[rowName] = {
        countIssued: new Prisma.Decimal(0),
        processingFee: new Prisma.Decimal(0),
        donationAmount: new Prisma.Decimal(0),
        refundAmount: new Prisma.Decimal(0),
        totalAmount: new Prisma.Decimal(0),
      };
    }

    summedPaymentMethodGroups[rowName].countIssued = Prisma.Decimal.add(
      summedPaymentMethodGroups[rowName].countIssued,
      countIssued
    );
    summedPaymentMethodGroups[rowName].processingFee = Prisma.Decimal.add(
      summedPaymentMethodGroups[rowName].processingFee,
      processingFee
    );
    summedPaymentMethodGroups[rowName].donationAmount = Prisma.Decimal.add(
      summedPaymentMethodGroups[rowName].donationAmount,
      donationAmount
    );
    summedPaymentMethodGroups[rowName].refundAmount = Prisma.Decimal.add(
      summedPaymentMethodGroups[rowName].refundAmount,
      refundAmount
    );
    summedPaymentMethodGroups[rowName].totalAmount = Prisma.Decimal.add(
      summedPaymentMethodGroups[rowName].totalAmount,
      totalAmount
    );
  }

  const csvAccountantReportRows = [];
  for (const rowName in summedPaymentMethodGroups) {
    const row = summedPaymentMethodGroups[rowName];
    csvAccountantReportRows.push({
      rowName,
      countIssued: row.countIssued,
      processingFee: `$${row.processingFee}`,
      donationAmount: `$${row.donationAmount}`,
      refundAmount: `$${row.refundAmount}`,
      totalAmount: `$${row.totalAmount}`,
    });
  }

  const countIssued =
    (totalAggregate._count.paymentMethod || 0) +
    (secondTotalAggregate._count.secondPaymentMethod || 0);
  const processingFee = Prisma.Decimal.add(
    totalAggregate._sum.processingFee || 0,
    secondTotalAggregate._sum.secondProcessingFee || 0
  );
  const donationAmount = Prisma.Decimal.add(
    totalAggregate._sum.donationAmount || 0,
    secondTotalAggregate._sum.secondDonationAmount || 0
  );
  const refundAmount = Prisma.Decimal.add(
    Prisma.Decimal.add(
      refundAggregate._sum.processingFee || 0,
      refundAggregate._sum.donationAmount || 0
    ),
    Prisma.Decimal.add(
      secondRefundAggregate._sum.secondDonationAmount || 0,
      secondRefundAggregate._sum.secondProcessingFee || 0
    )
  );
  const totalAmount = Prisma.Decimal.add(
    Prisma.Decimal.add(processingFee, donationAmount),
    -refundAmount
  );
  csvAccountantReportRows.push({
    rowName: 'Total',
    countIssued,
    processingFee: `$${processingFee}`,
    donationAmount: `$${donationAmount}`,
    refundAmount: `$${refundAmount}`,
    totalAmount: `$${totalAmount}`,
  });

  const csvHeaders = [
    { id: 'rowName', title: '' },
    { id: 'countIssued', title: 'Issued #' },
    { id: 'processingFee', title: 'Fees' },
    { id: 'donationAmount', title: 'Donation' },
    { id: 'refundAmount', title: 'Refund' },
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
    const message = `Error uploading accountant report to AWS: ${error}`;
    logger.error({ error: message });
    throw new ApolloError(message);
  }

  return {
    ok: true,
    error: null,
    url: signedUrl,
  };
};
