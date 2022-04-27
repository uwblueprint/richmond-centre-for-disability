import { gql } from '@apollo/client';
import { Applicant, QueryApplicantArgs } from '@lib/graphql/types';
import { AppHistoryRecord } from '@tools/admin/permit-holders/app-history';
import { CurrentApplication } from '@tools/admin/permit-holders/current-application';

/** Get basic applicant information */
export const GET_APPLICANT_QUERY = gql`
  query GetApplicant($id: Int!) {
    applicant(id: $id) {
      firstName
      middleName
      lastName
      status
      inactiveReason

      # Current application
      completedApplications {
        __typename
        id
        type
        permitType
        processing {
          status
          documentsUrl
          documentsS3ObjectKey
          invoice {
            s3ObjectUrl
            s3ObjectKey
          }
        }
        ... on NewApplication {
          disability
          disabilityCertificationDate
          patientCondition
          otherPatientCondition
          mobilityAids
          temporaryPermitExpiry
          usesAccessibleConvertedVan
          accessibleConvertedVanLoadingMethod
          requiresWiderParkingSpace
          requiresWiderParkingSpaceReason
          otherRequiresWiderParkingSpaceReason
        }
        ... on RenewalApplication {
          usesAccessibleConvertedVan
          accessibleConvertedVanLoadingMethod
          requiresWiderParkingSpace
          requiresWiderParkingSpaceReason
          otherRequiresWiderParkingSpaceReason
        }
      }

      # APP history
      permits {
        rcdPermitId
        expiryDate
        application {
          id
          type
          processing {
            documentsUrl
            documentsS3ObjectKey
            invoice {
              s3ObjectUrl
              s3ObjectKey
            }
          }
          ... on NewApplication {
            permitType
          }
        }
      }
    }
  }
`;

export type GetApplicantRequest = QueryApplicantArgs;

export type GetApplicantResponse = {
  applicant: Pick<
    Applicant,
    'firstName' | 'middleName' | 'lastName' | 'status' | 'inactiveReason'
  > & {
    completedApplications: Array<CurrentApplication>;
    permits: Array<AppHistoryRecord>;
  };
};
