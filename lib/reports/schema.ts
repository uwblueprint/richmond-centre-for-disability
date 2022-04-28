/**
 * GraphQL schema for report generation
 */

import { gql } from '@apollo/client';

export default gql`
  # Generate requests report
  input GenerateApplicationsReportInput {
    startDate: Date!
    endDate: Date!
    columns: [ApplicationsReportColumn!]!
  }

  # TODO: Return link to AWS S3 file
  type GenerateApplicationsReportResult {
    ok: Boolean!
    url: String
  }

  # Selectable columns in requests report
  enum ApplicationsReportColumn {
    USER_ID
    APPLICANT_NAME
    APPLICANT_DATE_OF_BIRTH
    APP_NUMBER
    APPLICATION_DATE
    PAYMENT_METHOD
    FEE_AMOUNT
    DONATION_AMOUNT
    TOTAL_AMOUNT
  }

  # Generate permit holders report
  input GeneratePermitHoldersReportInput {
    startDate: Date!
    endDate: Date!
    columns: [PermitHoldersReportColumn!]!
  }

  # TODO: Return link to AWS S3 file
  type GeneratePermitHoldersReportResult {
    ok: Boolean!
  }

  # Selectable columns in permit holders report
  enum PermitHoldersReportColumn {
    USER_ID
    APPLICANT_NAME
    APPLICANT_DATE_OF_BIRTH
    HOME_ADDRESS
    EMAIL
    PHONE_NUMBER
    GUARDIAN_POA_NAME
    GUARDIAN_POA_RELATION
    GUARDIAN_POA_ADDRESS
    RECENT_APP_NUMBER
    RECENT_APP_TYPE
    USER_STATUS
  }

  # Generate Accountant Report
  input GenerateAccountantReportInput {
    startDate: Date!
    endDate: Date!
  }

  # TODO: Return link to AWS S3 file
  type GenerateAccountantReportResult {
    ok: Boolean!
  }
`;
