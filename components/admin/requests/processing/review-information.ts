import { gql } from '@apollo/client'; // GraphQL queries
import { Application, QueryApplicationArgs, NewApplication } from '@lib/graphql/types';

// Queries an Application by ID along with the associated permit, replacement, applicationProcessing, and applicant
export const GET_REVIEW_INFORMATION_QUERY = gql`
  query GetApplication($id: Int!) {
    application(id: $id) {
      __typename
      id
      type
      ... on NewApplication {
        guardianFirstName
        guardianMiddleName
        guardianLastName
        guardianAddressLine1
        guardianAddressLine2
        guardianCity
        guardianPostalCode
        guardianPhone
        guardianRelationship
      }
    }
  }
`;

// Get application request type
export type GetReviewInformationRequest = QueryApplicationArgs;

// Get application response type
// TODO: Account for application types
export type GetReviewInformationResponse = {
  application: Pick<Application, 'id' | 'type'> &
    Pick<
      NewApplication,
      | 'guardianFirstName'
      | 'guardianMiddleName'
      | 'guardianLastName'
      | 'guardianAddressLine1'
      | 'guardianAddressLine2'
      | 'guardianCity'
      | 'guardianPostalCode'
      | 'guardianPhone'
      | 'guardianRelationship'
      | 'guardianCountry'
      | 'guardianProvince'
    >;
};
