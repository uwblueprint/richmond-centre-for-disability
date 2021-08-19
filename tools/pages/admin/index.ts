import { gql } from '@apollo/client'; // gql tag
import { ApplicationsFilter, ApplicationsFilterResult } from '@lib/graphql/types'; //GraphQL types

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
    result: [ApplicationsFilterResult];
    totalCount: number;
  };
};
