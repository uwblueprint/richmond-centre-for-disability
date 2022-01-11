import { gql } from '@apollo/client'; // GraphQL queries
import {
  GeneratePermitHoldersReportResult,
  QueryGeneratePermitHoldersReportArgs,
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
