import { ApplicationsReportColumn, PermitHoldersReportColumn } from '@lib/graphql/types';

/**
 * Steps when generating reports for requests and permit holders
 */
export enum GenerateReportStep {
  SelectColumns = 1,
  Export = 2,
}

/** Ordered array of application requests column names and values */
export const APPLICATIONS_COLUMNS = [
  {
    name: 'User ID',
    value: ApplicationsReportColumn.UserId,
  },
  {
    name: 'Applicant Name',
    value: ApplicationsReportColumn.ApplicantName,
  },
  {
    name: 'Applicant DoB',
    value: ApplicationsReportColumn.ApplicantDateOfBirth,
  },
  {
    name: 'APP Number',
    value: ApplicationsReportColumn.AppNumber,
  },
  {
    name: 'Application Date',
    value: ApplicationsReportColumn.ApplicationDate,
  },
  {
    name: 'Payment Method',
    value: ApplicationsReportColumn.PaymentMethod,
  },
  {
    name: 'Fee Amount',
    value: ApplicationsReportColumn.FeeAmount,
  },
  {
    name: 'Donation Amount',
    value: ApplicationsReportColumn.DonationAmount,
  },
  {
    name: 'Total Amount',
    value: ApplicationsReportColumn.TotalAmount,
  },
];

/** Ordered array of permit holders column names and values */
export const PERMIT_HOLDERS_COLUMNS = [
  {
    name: 'User ID',
    value: PermitHoldersReportColumn.UserId,
  },
  {
    name: 'Applicant Name',
    value: PermitHoldersReportColumn.ApplicantName,
  },
  {
    name: 'Applicant DoB',
    value: PermitHoldersReportColumn.ApplicantDateOfBirth,
  },
  {
    name: 'Home Address',
    value: PermitHoldersReportColumn.HomeAddress,
  },
  {
    name: 'Email',
    value: PermitHoldersReportColumn.Email,
  },
  {
    name: 'Phone Number',
    value: PermitHoldersReportColumn.PhoneNumber,
  },
  {
    name: 'Guardian/POA Name',
    value: PermitHoldersReportColumn.GuardianPoaName,
  },
  {
    name: 'Guardian/POA Relation',
    value: PermitHoldersReportColumn.GuardianPoaRelation,
  },
  {
    name: 'Guardian/POA Address',
    value: PermitHoldersReportColumn.GuardianPoaAddress,
  },
  {
    name: 'Recent APP Number',
    value: PermitHoldersReportColumn.RecentAppNumber,
  },
  {
    name: 'Recent APP Type',
    value: PermitHoldersReportColumn.RecentAppType,
  },
  {
    name: 'User Status',
    value: PermitHoldersReportColumn.UserStatus,
  },
];
