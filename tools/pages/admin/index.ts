import { gql } from '@apollo/client'; // gql tag
import { Application, ApplicationsFilter } from '@lib/graphql/types'; //GraphQL types

export const FILTER_APPLICATIONS_QUERY = gql`
  query FilterApplicationsQuery($filter: ApplicationsFilter) {
    applications(filter: $filter) {
      result {
        firstName
        lastName
        id
        createdAt
        permitType
        isRenewal
        applicantId
        applicationProcessing {
          status
        }
      }
      totalCount
    }
  }
`;

export type FilterRequest = {
  filter: ApplicationsFilter;
};

export type FilterResponse = {
  applications: {
    result: [Application];
    totalCount: number;
  };
};
