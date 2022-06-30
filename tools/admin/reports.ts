import { ApplicationsReportColumn, PermitHoldersReportColumn } from '@lib/graphql/types';

/**
 * Steps when generating reports for requests and permit holders
 */
export enum GenerateReportStep {
  SelectColumns = 1,
  Export = 2,
}

/** Ordered array of application requests column names and values */
export const APPLICATIONS_COLUMNS: Array<{
  name: string;
  value: ApplicationsReportColumn;
  reportColumnId: string;
}> = [
  {
    name: 'User ID',
    value: 'USER_ID',
    reportColumnId: 'id',
  },
  {
    name: 'Applicant Name',
    value: 'APPLICANT_NAME',
    reportColumnId: 'applicantName',
  },
  {
    name: 'Applicant DoB',
    value: 'APPLICANT_DATE_OF_BIRTH',
    reportColumnId: 'dateOfBirth',
  },
  {
    name: 'APP Number',
    value: 'APP_NUMBER',
    reportColumnId: 'rcdPermitId',
  },
  {
    name: 'Application Date',
    value: 'APPLICATION_DATE',
    reportColumnId: 'applicationDate',
  },
  {
    name: 'Payment Method',
    value: 'PAYMENT_METHOD',
    reportColumnId: 'paymentMethod',
  },
  {
    name: 'Fee Amount',
    value: 'FEE_AMOUNT',
    reportColumnId: 'processingFee',
  },
  {
    name: 'Donation Amount',
    value: 'DONATION_AMOUNT',
    reportColumnId: 'donationAmount',
  },
  {
    name: 'Total Amount',
    value: 'TOTAL_AMOUNT',
    reportColumnId: 'totalAmount',
  },
];

/** Ordered array of permit holders column names and values */
export const PERMIT_HOLDERS_COLUMNS: Array<{
  name: string;
  value: PermitHoldersReportColumn;
  reportColumnId: string;
}> = [
  {
    name: 'User ID',
    value: 'USER_ID',
    reportColumnId: 'id',
  },
  {
    name: 'Applicant Name',
    value: 'APPLICANT_NAME',
    reportColumnId: 'applicantName',
  },
  {
    name: 'Applicant DoB',
    value: 'APPLICANT_DATE_OF_BIRTH',
    reportColumnId: 'dateOfBirth',
  },
  {
    name: 'Home Address',
    value: 'HOME_ADDRESS',
    reportColumnId: 'homeAddress',
  },
  {
    name: 'Email',
    value: 'EMAIL',
    reportColumnId: 'email',
  },
  {
    name: 'Phone Number',
    value: 'PHONE_NUMBER',
    reportColumnId: 'phone',
  },
  {
    name: 'Guardian/POA Name',
    value: 'GUARDIAN_POA_NAME',
    reportColumnId: 'guardianPOAName',
  },
  {
    name: 'Guardian/POA Relation',
    value: 'GUARDIAN_POA_RELATION',
    reportColumnId: 'guardianRelationship',
  },
  {
    name: 'Guardian/POA Address',
    value: 'GUARDIAN_POA_ADDRESS',
    reportColumnId: 'guardianPOAAddress',
  },
  {
    name: 'Recent APP Number',
    value: 'RECENT_APP_NUMBER',
    reportColumnId: 'rcdPermitId',
  },
  {
    name: 'Recent APP Type',
    value: 'RECENT_APP_TYPE',
    reportColumnId: 'permitType',
  },
  {
    name: 'User Status',
    value: 'USER_STATUS',
    reportColumnId: 'status',
  },
];
