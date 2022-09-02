import { gql } from '@apollo/client';
import { Applicant, QueryApplicantArgs } from '@lib/graphql/types';
import { AppHistoryRecord } from '@tools/admin/permit-holders/app-history';
import {
  CurrentApplication,
  MedicalInformationSectionData,
} from '@tools/admin/permit-holders/current-application';
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
      notes

      # Medical information
      medicalInformation {
        disability
        disabilityCertificationDate
        patientCondition
        otherPatientCondition
        mobilityAids
      }

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
      mostRecentApplication {
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
        permit {
          expiryDate
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
          permitType
          processing {
            documentsUrl
            documentsS3ObjectKey
            invoice {
              s3ObjectUrl
              s3ObjectKey
            }
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
    'firstName' | 'middleName' | 'lastName' | 'status' | 'inactiveReason' | 'notes'
  > & {
    medicalInformation: MedicalInformationSectionData;
    guardian: GuardianInformationCardData;
    mostRecentApplication: CurrentApplication | null;
    permits: Array<AppHistoryRecord>;
  };
};
