import { gql } from '@apollo/client';
import {
  Application,
  ApplicationProcessing,
  Invoice,
  QueryApplicationArgs,
  RenewalApplication,
} from '@lib/graphql/types';
import { NewApplication } from '@prisma/client';

/** Get current application of an applicant */
// TODO: Add API for current application
export const GET_CURRENT_APPLICATION = gql`
  query GetApplicantCurrentApplication($id: Int!) {
    application(id: $id) {
      __typename
      id
      type
      permitType
      processing {
        status
        documentsUrl
        invoice {
          s3ObjectUrl
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
  }
`;

export type GetCurrentApplicationRequest = QueryApplicationArgs;

export type GetCurrentApplicationResponse = {
  application: Pick<Application, 'id' | 'permitType'> & {
    processing: Pick<ApplicationProcessing, 'status' | 'documentsUrl'> & {
      invoice: Pick<Invoice, 's3ObjectUrl'> | null;
    };
  } & (
      | ({ type: 'NEW' } & Pick<
          NewApplication,
          | 'disability'
          | 'disabilityCertificationDate'
          | 'patientCondition'
          | 'otherPatientCondition'
          | 'mobilityAids'
          | 'temporaryPermitExpiry'
          | 'usesAccessibleConvertedVan'
          | 'accessibleConvertedVanLoadingMethod'
          | 'requiresWiderParkingSpace'
          | 'requiresWiderParkingSpaceReason'
          | 'otherRequiresWiderParkingSpaceReason'
        >)
      | ({ type: 'RENEWAL' } & {
          disability: undefined;
          disabilityCertificationDate: undefined;
          patientCondition: undefined;
          otherPatientCondition: undefined;
          mobilityAids: undefined;
          temporaryPermitExpiry: undefined;
        } & Pick<
            RenewalApplication,
            | 'usesAccessibleConvertedVan'
            | 'accessibleConvertedVanLoadingMethod'
            | 'requiresWiderParkingSpace'
            | 'requiresWiderParkingSpaceReason'
            | 'otherRequiresWiderParkingSpaceReason'
          >)
      | ({ type: 'REPLACEMENT' } & {
          disability: undefined;
          disabilityCertificationDate: undefined;
          patientCondition: undefined;
          otherPatientCondition: undefined;
          mobilityAids: undefined;
          temporaryPermitExpiry: undefined;
          usesAccessibleConvertedVan: undefined;
          accessibleConvertedVanLoadingMethod: undefined;
          requiresWiderParkingSpace: undefined;
          requiresWiderParkingSpaceReason: undefined;
          otherRequiresWiderParkingSpaceReason: undefined;
        })
    );
};
