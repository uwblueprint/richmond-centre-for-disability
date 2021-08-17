import { gql } from '@apollo/client'; // gql tag
import { UpsertPhysicianResult, MutationUpsertPhysicianArgs } from '@lib/types'; // GraphQL types

// Upsert physician mutation
export const UPSERT_PHYSICIAN_MUTATION = gql`
  mutation UpsertPhysician($input: UpsertPhysicianInput!) {
    upsertPhysician(input: $input) {
      ok
    }
  }
`;

// Upsert physician mutation arguments
export type UpsertPhysicianRequest = MutationUpsertPhysicianArgs;

// Upsert physician mutation result
export type UpsertPhysicianResponse = {
  upsertPhysician: UpsertPhysicianResult;
};
