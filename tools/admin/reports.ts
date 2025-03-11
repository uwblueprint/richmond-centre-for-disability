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
  reportColumnId: string | Array<[string, string]>;
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
    name: 'APP Number',
    value: 'APP_NUMBER',
    reportColumnId: 'rcdPermitId',
  },
  {
    name: 'Applicant DoB',
    value: 'APPLICANT_DATE_OF_BIRTH',
    reportColumnId: 'dateOfBirth',
  },
  {
    name: 'Phone Number',
    value: 'PHONE_NUMBER',
    reportColumnId: 'phone',
  },
  {
    name: 'Home Address',
    value: 'HOME_ADDRESS',
    reportColumnId: [
      ['Address', 'address'],
      ['City', 'city'],
      ['Province', 'province'],
      ['Postal Code', 'postalCode'],
    ],
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
    name: 'Second Payment Method',
    value: 'SECOND_PAYMENT_METHOD',
    reportColumnId: 'secondPaymentMethod',
  },
  {
    name: 'Second Fee Amount',
    value: 'SECOND_FEE_AMOUNT',
    reportColumnId: 'secondProcessingFee',
  },
  {
    name: 'Second Donation Amount',
    value: 'SECOND_DONATION_AMOUNT',
    reportColumnId: 'secondDonationAmount',
  },
  {
    name: 'Total Amount',
    value: 'TOTAL_AMOUNT',
    reportColumnId: 'totalAmount',
  },
  {
    name: 'Application Date',
    value: 'APPLICATION_DATE',
    reportColumnId: 'applicationDate',
  },
  {
    name: 'Invoice Receipt #',
    value: 'INVOICE_RECEIPT_NUMBER',
    reportColumnId: 'invoiceReceiptNumber',
  },
  {
    name: 'Tax Receipt #',
    value: 'TAX_RECEIPT_NUMBER',
    reportColumnId: 'taxReceiptNumber',
  },
];

/** Ordered array of permit holders column names and values */
export const PERMIT_HOLDERS_COLUMNS: Array<{
  name: string;
  value: PermitHoldersReportColumn;
  reportColumnId: string | Array<[string, string]>;
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
    name: 'Applicant Age',
    value: 'APPLICANT_AGE',
    reportColumnId: 'age',
  },
  {
    name: 'Home Address',
    value: 'HOME_ADDRESS',
    reportColumnId: [
      ['Address', 'address'],
      ['City', 'city'],
      ['Province', 'province'],
      ['Postal Code', 'postalCode'],
    ],
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
    reportColumnId: [
      ['Guardian/POA Address', 'guardianAddress'],
      ['Guardian/POA City', 'guardianCity'],
      ['Guardian/POA Province', 'guardianProvince'],
      ['Guardian/POA Postal Code', 'guardianPostalCode'],
    ],
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
    name: 'Recent APP Expiry Date',
    value: 'RECENT_APP_EXPIRY_DATE',
    reportColumnId: 'permitExpiryDate',
  },
  {
    name: 'User Status',
    value: 'USER_STATUS',
    reportColumnId: 'status',
  },
];
