import { gql } from '@apollo/client';
import {
  MutationUpdateApplicationAdditionalInformationArgs,
  NewApplication,
  QueryApplicationArgs,
  RenewalApplication,
  UpdateApplicationAdditionalInformationResult,
} from '@lib/graphql/types';

/** Additional questions in forms */
export type AdditionalInformationFormData = Pick<
  NewApplication | RenewalApplication,
  | 'accessibleConvertedVanLoadingMethod'
  | 'requiresWiderParkingSpaceReason'
  | 'otherRequiresWiderParkingSpaceReason'
> & {
  usesAccessibleConvertedVan: boolean | null;
  requiresWiderParkingSpace: boolean | null;
};

/** Get additional information of application */
export const GET_ADDITIONAL_INFORMATION = gql`
  query GetAdditionalInformation($id: Int!) {
    application(id: $id) {
      __typename
      ... on NewApplication {
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

export type GetAdditionalInformationRequest = QueryApplicationArgs;

export type GetAdditionalInformationResponse = {
  application: Pick<
    NewApplication | RenewalApplication,
    | 'usesAccessibleConvertedVan'
    | 'accessibleConvertedVanLoadingMethod'
    | 'requiresWiderParkingSpace'
    | 'requiresWiderParkingSpaceReason'
    | 'otherRequiresWiderParkingSpaceReason'
  >;
};

/** Update additional information of application */
export const UPDATE_ADDITIONAL_INFORMATION = gql`
  mutation UpdateApplicationAdditionalInformation(
    $input: UpdateApplicationAdditionalInformationInput!
  ) {
    updateApplicationAdditionalInformation(input: $input) {
      ok
      error
    }
  }
`;

export type UpdateAdditionalInformationRequest = MutationUpdateApplicationAdditionalInformationArgs;

export type UpdateAdditionalInformationResponse = {
  updateApplicationAdditionalInformation: UpdateApplicationAdditionalInformationResult;
};
