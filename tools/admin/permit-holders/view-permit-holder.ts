import { gql } from '@apollo/client';
import { Applicant, QueryApplicantArgs } from '@lib/graphql/types';
import { AppHistoryRecord } from '@tools/admin/permit-holders/app-history';
import { CurrentApplication } from '@tools/admin/permit-holders/current-application';
import { GuardianInformationCardData } from '@tools/admin/permit-holders/guardian-information';

/** Get basic applicant information */
export const GET_APPLICANT_QUERY = gql`
  query GetApplicant($id: Int!) {
    applicant(id: $id) {
      firstName
      middleName
      lastName
      status
      inactiveReason

      # Guardian
      guardian {
        firstName
        middleName
        lastName
        phone
        relationship
        addressLine1
        addressLine2
        city
        province
        country
        postalCode
        poaFormS3ObjectKey
        poaFormS3ObjectUrl
      }

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
    guardian: GuardianInformationCardData;
    completedApplications: Array<CurrentApplication>;
    permits: Array<AppHistoryRecord>;
  };
};
