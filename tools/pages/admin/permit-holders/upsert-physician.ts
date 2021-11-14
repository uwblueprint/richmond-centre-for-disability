import gql from 'graphql-tag'; // gql tag
import { UpsertPhysicianResult, MutationUpsertPhysicianArgs } from '@lib/graphql/types'; // GraphQL types

// Upsert physician mutation
export const UPSERT_PHYSICIAN_MUTATION = gql`
  mutation UpsertPhysician($input: UpsertPhysicianInput!) {
    upsertPhysician(input: $input) {
      ok
      physicianId
    }
  }
`;

// Upsert physician mutation arguments
export type UpsertPhysicianRequest = MutationUpsertPhysicianArgs;

// Upsert physician mutation result
export type UpsertPhysicianResponse = {
  upsertPhysician: UpsertPhysicianResult;
};
