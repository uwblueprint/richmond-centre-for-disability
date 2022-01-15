import { createObjectCsvWriter } from 'csv-writer';
import { Resolver } from '@lib/graphql/resolvers';
import {
  QueryGeneratePermitHoldersReportArgs,
  GeneratePermitHoldersReportResult,
  QueryGenerateApplicationsReportArgs,
  GenerateApplicationsReportResult,
} from '@lib/graphql/types';
import { SortOrder } from '@tools/types';
import { formatAddress, formatDate, formatFullName } from '@lib/utils/format'; // Formatting utils
import { APPLICATIONS_COLUMNS, PERMIT_HOLDERS_COLUMNS } from '@tools/admin/reports';

/**
 * Generates csv with permit holders' info, given a start date, end date, and values from
 * PermitHoldersReportColumn that the user would like to have on the generated csv
 * @returns Whether a csv could be generated (ok), and in the future an AWS S3 file link
 */
export const generatePermitHoldersReport: Resolver<
  QueryGeneratePermitHoldersReportArgs,
  GeneratePermitHoldersReportResult
> = async (_, args, { prisma }) => {
  const {
    input: { startDate, endDate, columns },
  } = args;

  const columnsSet = new Set(columns);

  const applicants = await prisma.applicant.findMany({
    where: {
      permits: {
        some: {
          expiryDate: {
            gte: startDate,
            lte: endDate,
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
      ...applicant
    }) => {
      return {
        ...applicant,
        id,
        dateOfBirth: formatDate(dateOfBirth),
        applicantName: formatFullName(firstName, middleName, lastName),
        rcdPermitId: permits[0].rcdPermitId,
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

  const csvWriter = createObjectCsvWriter({
    path: 'temp/file-permit-holders.csv',
    header: csvHeaders,
  });

  await csvWriter.writeRecords(csvApplicants);

  return {
    ok: true,
  };
};

/**
 * Generates csv with applications' info, given a start date, end date, and values from
 * ApplicationsReportColumn that the user would like to have on the generated csv
 * @returns Whether a csv could be generated (ok), and in the future an AWS S3 file link
 */
export const generateApplicationsReport: Resolver<
  QueryGenerateApplicationsReportArgs,
  GenerateApplicationsReportResult
> = async (_, args, { prisma }) => {
  const {
    input: { startDate, endDate, columns },
  } = args;

  const columnsSet = new Set(columns);

  const applications = await prisma.application.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
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
        dateOfBirth: dateOfBirth && formatDate(dateOfBirth),
        applicationDate: createdAt.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: 'numeric',
          timeZone: 'America/Vancouver',
        }),
        applicantName: formatFullName(firstName, middleName, lastName),
        totalAmount: processingFee.plus(donationAmount),
        rcdPermitId: permit?.rcdPermitId,
      };
    }
  );

  const csvHeaders = APPLICATIONS_COLUMNS.filter(({ value }) => columnsSet.has(value)).map(
    ({ name, reportColumnId }) => ({ id: reportColumnId, title: name })
  );

  const csvWriter = createObjectCsvWriter({
    path: 'temp/file.csv',
    header: csvHeaders,
  });

  await csvWriter.writeRecords(csvApplications);

  return {
    ok: true,
  };
};
