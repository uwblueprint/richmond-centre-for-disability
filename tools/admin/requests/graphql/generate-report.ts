import { gql } from '@apollo/client'; // GraphQL queries
import {
  QueryGenerateApplicationsReportArgs,
  GenerateApplicationsReportResult,
} from '@lib/graphql/types';

export const GENERATE_APPLICATIONS_REPORT_QUERY = gql`
  query GenerateApplicationsReportQuery($input: GenerateApplicationsReportInput!) {
    generateApplicationsReport(input: $input) {
      ok
      link
    }
  }
`;

// Generate applicants report query arguments
export type GenerateApplicationsReportRequest = QueryGenerateApplicationsReportArgs;

// Generate applicants report query result
export type GenerateApplicationsReportResponse = {
  generateApplicationsReport: GenerateApplicationsReportResult;
};
