import { gql } from '@apollo/client'; // GraphQL queries
import {
  GeneratePermitHoldersReportResult,
  GenerateAccountantReportResult,
  QueryGeneratePermitHoldersReportArgs,
  QueryGenerateAccountantReportArgs,
} from '@lib/graphql/types';

export const GENERATE_PERMIT_HOLDERS_REPORT_QUERY = gql`
  query GeneratePermitHoldersReportQuery($input: GeneratePermitHoldersReportInput!) {
    generatePermitHoldersReport(input: $input) {
      ok
    }
  }
`;

// Generate applicants report query arguments
export type GeneratePermitHoldersReportRequest = QueryGeneratePermitHoldersReportArgs;

// Generate applicants report query result
export type GeneratePermitHoldersReportResponse = {
  generatePermitHoldersReport: GeneratePermitHoldersReportResult;
};

export const GENERATE_ACCOUNTANT_REPORT_QUERY = gql`
  query GenerateAccountantReportQuery($input: GenerateAccountantReportInput!) {
    generateAccountantReport(input: $input) {
      ok
    }
  }
`;

// Generate accountant report query arguments
export type GenerateAccountantReportRequest = QueryGenerateAccountantReportArgs;

// Generate accountant report query result
export type GenerateAccountantReportResponse = {
  generateAccountantReport: GenerateAccountantReportResult;
};
