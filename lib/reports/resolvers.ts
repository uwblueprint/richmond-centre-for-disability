import { createObjectCsvWriter } from 'csv-writer';
import { Resolver } from '@lib/graphql/resolvers';
import {
  QueryGeneratePermitHoldersReportArgs,
  PermitHoldersReportColumn,
} from '@lib/graphql/types';
import { SortOrder } from '@tools/types';
import { formatDate } from '@lib/utils/format'; // Formatting utils

/**
 * Generates csv with permit holders' info, given a start date, end date, and values from
 * PermitHoldersReportColumn that the user would like to have on the generated csv
 * @returns Whether a csv could be generated (ok), and in the future an AWS S3 file link
 */
export const generatePermitHoldersReport: Resolver<QueryGeneratePermitHoldersReportArgs> = async (
  _,
  args,
  { prisma }
) => {
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
      rcdUserId: true,
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
          // TODO: Update permit table to include permit type
          // TODO: Once updated, fetch permitType from latest permit
          // permitType: true,
        },
      },
      // Fetches permitType from latest application
      // TODO: Update permit table to include permit type
      // TODO: Once updated, fetch field from latest permit instead and remove following code
      applications: {
        orderBy: {
          createdAt: SortOrder.DESC,
        },
        take: 1,
        select: {
          permitType: true,
        },
      },
    },
  });

  // Formats fields and adds properties to allow for csv writing
  const csvApplicants = applicants.map(applicant => {
    return {
      ...applicant,
      dateOfBirth: formatDate(applicant.dateOfBirth),
      applicantName: `${applicant.firstName}${
        applicant.middleName ? ` ${applicant.middleName}` : ''
      } ${applicant.lastName}`,
      rcdPermitId: applicant.permits[0].rcdPermitId,
      permitType: applicant.applications[0].permitType,
      homeAddress: `${applicant.addressLine1},${
        applicant.addressLine2 ? ` ${applicant.addressLine2},` : ''
      } ${applicant.city}, ${applicant.province} ${applicant.postalCode}`,
      guardianRelationship: applicant.guardian?.relationship,
      guardianPOAName: applicant.guardian
        ? `${applicant.guardian.firstName}${
            applicant.guardian?.middleName ? ` ${applicant.guardian.middleName}` : ''
          } ${applicant.guardian.lastName}`
        : '',
      guardianPOAAdress: applicant.guardian
        ? `${applicant.guardian.addressLine1}${
            applicant.guardian.addressLine2 ? ` ${applicant.guardian.addressLine2},` : ''
          } ${applicant.guardian.city}, ${applicant.guardian.province} ${
            applicant.guardian.postalCode
          }`
        : '',
    };
  });

  const csvHeaders = [];

  if (columnsSet.has(PermitHoldersReportColumn.UserId)) {
    csvHeaders.push({ id: 'rcdUserId', title: 'User ID' });
  }
  if (columnsSet.has(PermitHoldersReportColumn.ApplicantName)) {
    csvHeaders.push({ id: 'applicantName', title: 'Applicant Name' });
  }
  if (columnsSet.has(PermitHoldersReportColumn.ApplicantDateOfBirth)) {
    csvHeaders.push({ id: 'dateOfBirth', title: 'Applicant DoB' });
  }
  if (columnsSet.has(PermitHoldersReportColumn.HomeAddress)) {
    csvHeaders.push({ id: 'homeAddress', title: 'Home Address' });
  }
  if (columnsSet.has(PermitHoldersReportColumn.Email)) {
    csvHeaders.push({ id: 'email', title: 'Email' });
  }
  if (columnsSet.has(PermitHoldersReportColumn.PhoneNumber)) {
    csvHeaders.push({ id: 'phone', title: 'Phone Number' });
  }
  if (columnsSet.has(PermitHoldersReportColumn.GuardianPoaName)) {
    csvHeaders.push({ id: 'guardianPOAName', title: 'Guardian/POA Name' });
  }
  if (columnsSet.has(PermitHoldersReportColumn.GuardianPoaRelation)) {
    csvHeaders.push({ id: 'guardianRelationship', title: 'Guardian/POA Relation' });
  }
  if (columnsSet.has(PermitHoldersReportColumn.GuardianPoaAddress)) {
    csvHeaders.push({ id: 'guardianPOAAdress', title: 'Guardian/POA Address' });
  }
  if (columnsSet.has(PermitHoldersReportColumn.RecentAppNumber)) {
    csvHeaders.push({ id: 'rcdPermitId', title: 'Recent APP Number' });
  }
  if (columnsSet.has(PermitHoldersReportColumn.RecentAppType)) {
    csvHeaders.push({ id: 'permitType', title: 'Recent APP Type' });
  }
  if (columnsSet.has(PermitHoldersReportColumn.UserStatus)) {
    csvHeaders.push({ id: 'status', title: 'User Status' });
  }

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
export const generateApplicationsReport: Resolver = async (_, args, { prisma }) => {
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
      rcdUserId: columnsSet.has(ApplicationsReportColumn.UserId),
      firstName: columnsSet.has(ApplicationsReportColumn.ApplicantName),
      middleName: columnsSet.has(ApplicationsReportColumn.ApplicantName),
      lastName: columnsSet.has(ApplicationsReportColumn.ApplicantName),
      dateOfBirth: columnsSet.has(ApplicationsReportColumn.ApplicantDateOfBirth),
      createdAt: columnsSet.has(ApplicationsReportColumn.ApplicationDate),
      paymentMethod: columnsSet.has(ApplicationsReportColumn.PaymentMethod),
      processingFee:
        columnsSet.has(ApplicationsReportColumn.FeeAmount) ||
        columnsSet.has(ApplicationsReportColumn.TotalAmount),
      donationAmount:
        columnsSet.has(ApplicationsReportColumn.DonationAmount) ||
        columnsSet.has(ApplicationsReportColumn.TotalAmount),
      permit: {
        select: {
          rcdPermitId: true,
        },
      },
    },
  });

  // Formats the date fields and adds totalAmount, applicantName and rcdPermitId properties to allow for csv writing
  const csvApplications = applications.map(application => {
    return {
      ...application,
      dateOfBirth: formatDate(application.dateOfBirth),
      applicationDate: application.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: 'numeric',
        timeZone: 'America/Vancouver',
      }),
      applicantName: `${application.firstName}${
        application.middleName ? ` ${application.middleName}` : ''
      } ${application.lastName}`,
      totalAmount: (application.processingFee || 0) + (application?.donationAmount || 0),
      rcdPermitId: application.permit?.rcdPermitId,
    };
  });

  const csvHeaders = [];

  if (columnsSet.has(ApplicationsReportColumn.UserId)) {
    csvHeaders.push({ id: 'rcdUserId', title: 'User ID' });
  }
  if (columnsSet.has(ApplicationsReportColumn.ApplicantName)) {
    csvHeaders.push({ id: 'applicantName', title: 'Applicant Name' });
  }
  if (columnsSet.has(ApplicationsReportColumn.ApplicantDateOfBirth)) {
    csvHeaders.push({ id: 'dateOfBirth', title: 'Applicant DoB' });
  }
  if (columnsSet.has(ApplicationsReportColumn.AppNumber)) {
    csvHeaders.push({ id: 'rcdPermitId', title: 'APP Number' });
  }
  if (columnsSet.has(ApplicationsReportColumn.ApplicationDate)) {
    csvHeaders.push({ id: 'applicationDate', title: 'Application Date' });
  }
  if (columnsSet.has(ApplicationsReportColumn.PaymentMethod)) {
    csvHeaders.push({ id: 'paymentMethod', title: 'Payment Method' });
  }
  if (columnsSet.has(ApplicationsReportColumn.FeeAmount)) {
    csvHeaders.push({ id: 'processingFee', title: 'Fee Amount' });
  }
  if (columnsSet.has(ApplicationsReportColumn.DonationAmount)) {
    csvHeaders.push({ id: 'donationAmount', title: 'Donation Amount' });
  }
  if (columnsSet.has(ApplicationsReportColumn.TotalAmount)) {
    csvHeaders.push({ id: 'totalAmount', title: 'Total Amount' });
  }

  const csvWriter = createObjectCsvWriter({
    path: 'temp/file.csv',
    header: csvHeaders,
  });

  await csvWriter.writeRecords(csvApplications);

  return {
    ok: true,
  };
};
