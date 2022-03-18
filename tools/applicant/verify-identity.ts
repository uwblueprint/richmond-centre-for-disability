import { gql } from '@apollo/client'; // gql tag
import {
  MutationVerifyIdentityArgs,
  VerifyIdentityFailureReason,
  VerifyIdentityResult,
} from '@lib/graphql/types'; // GraphQL types
import { object, string, number, date } from 'yup';

/**
 * Get the error message to render in the Alert component given the reason for identity
 * verification failure
 * @param failureReason Reason for identity verification failure
 * @returns Error message
 */
export const getErrorMessage = (failureReason: VerifyIdentityFailureReason): string => {
  // TODO: Replace with i18n translation keys
  switch (failureReason) {
    case 'IDENTITY_VERIFICATION_FAILED':
      return 'We did not find any user records matching the information you entered. Please try again.';
    case 'APP_DOES_NOT_EXPIRE_WITHIN_30_DAYS':
      return `Your current permit expiry date is too far away to request a renewal.
      Please check back when your permit is expiring within 30 days or less.`;
    default:
      return 'Unknown error';
  }
};

// Identity verification mutation
export const VERIFY_IDENTITY_MUTATION = gql`
  mutation VerifyIdentityMutation($input: VerifyIdentityInput!) {
    verifyIdentity(input: $input) {
      ok
      failureReason
      applicantId
    }
  }
`;

// Identity verification mutation arguments
export type VerifyIdentityRequest = MutationVerifyIdentityArgs;

// Identity verification mutation response
export type VerifyIdentityResponse = {
  verifyIdentity: VerifyIdentityResult;
};

export const verifyIdentitySchema = object({
  userId: number().required().positive().integer(),
  phoneNumberSuffix: string().matches(/^\d+$/).required().max(4, 'Must be exactly 4 digits'),
  dateOfBirth: date().required(),
});
