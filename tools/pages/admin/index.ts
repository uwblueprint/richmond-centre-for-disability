import gql from 'graphql-tag'; // gql tag
import { Application, ApplicationsFilter, ApplicationProcessing } from '@lib/graphql/types'; //GraphQL types

export const GET_APPLICATIONS_QUERY = gql`
  query GetApplicationsQuery($filter: ApplicationsFilter) {
    applications(filter: $filter) {
      result {
        firstName
        lastName
        id
        createdAt
        permitType
        isRenewal
        rcdUserId
        applicationProcessing {
          status
        }
      }
      totalCount
    }
  }
`;

export type GetApplicationsRequest = {
  filter: ApplicationsFilter;
};

export type GetApplicationsResponse = {
  applications: {
    result: ReadonlyArray<
      Pick<
        Application,
        'firstName' | 'lastName' | 'id' | 'createdAt' | 'permitType' | 'isRenewal' | 'rcdUserId'
      > & {
        applicationProcessing: Pick<ApplicationProcessing, 'status'>;
      }
    >;
    totalCount: number;
  };
};
