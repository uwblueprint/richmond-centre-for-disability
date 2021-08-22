import { gql } from '@apollo/client'; // gql tag
import { Application, ApplicationsFilter } from '@lib/graphql/types'; //GraphQL types

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
        applicantId
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
        | 'firstName'
        | 'lastName'
        | 'id'
        | 'createdAt'
        | 'permitType'
        | 'isRenewal'
        | 'applicantId'
      > & {
        applicationProcessing: Pick<ApplicationProcessing, 'status'>
      }
    >;
    totalCount: number;
  };
};
