import { gql } from '@apollo/client'; // gql tag

export const FILTER_APPLICATIONS_QUERY = gql`
  query FilterApplicationsQuery($filter: ApplicationsFilter) {
    applications(filter: $filter) {
      firstName
      lastName
      id
      createdAt
      applicationProcessing {
        status
      }
    }
  }
`;
