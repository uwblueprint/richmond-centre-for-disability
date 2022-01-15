import { gql } from '@apollo/client';
import { CompleteApplicationResult, MutationCompleteApplicationArgs } from '@lib/graphql/types';

/** Complete application */
export const COMPLETE_APPLICATION_MUTATION = gql`
  mutation CompleteApplication($input: CompleteApplicationInput!) {
    completeApplication(input: $input) {
      ok
    }
  }
`;

// Complete application request type
export type CompleteApplicationRequest = MutationCompleteApplicationArgs;

// Complete application response type
export type CompleteApplicationResponse = {
  completeApplication: CompleteApplicationResult;
};
