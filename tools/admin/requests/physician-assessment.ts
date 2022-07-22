import {
  NewApplication,
  PermitType,
  QueryApplicationArgs,
  MutationUpdateApplicationPhysicianAssessmentArgs,
  UpdateApplicationPhysicianAssessmentResult,
} from '@lib/graphql/types';
import { gql } from '@apollo/client';

/** Physician assessment in forms */
export type PhysicianAssessment = Pick<
  NewApplication,
  | 'disability'
  | 'disabilityCertificationDate'
  | 'otherPatientCondition'
  | 'temporaryPermitExpiry'
  | 'mobilityAids'
  | 'otherMobilityAids'
  | 'patientCondition'
> & {
  permitType: PermitType | null;
};

/** Get physician assessment information of an application */
export const GET_PHYSICIAN_ASSESSMENT = gql`
  query GetPhysicianAssessment($id: Int!) {
    application(id: $id) {
      id
      __typename
      ... on NewApplication {
        disability
        disabilityCertificationDate
        otherPatientCondition
        temporaryPermitExpiry
        patientCondition
        permitType
        mobilityAids
        otherMobilityAids
      }
    }
  }
`;

export type GetPhysicianAssessmentRequest = QueryApplicationArgs;

export type GetPhysicianAssessmentResponse = {
  application: Pick<
    NewApplication,
    | 'patientCondition'
    | 'permitType'
    | 'disability'
    | 'disabilityCertificationDate'
    | 'otherPatientCondition'
    | 'temporaryPermitExpiry'
    | 'mobilityAids'
    | 'otherMobilityAids'
  >;
};

/** Update physician assessment of application */
export const UPDATE_PHYSICIAN_ASSESSMENT = gql`
  mutation UpdateApplicationPhysicianAssessment(
    $input: UpdateApplicationPhysicianAssessmentInput!
  ) {
    updateApplicationPhysicianAssessment(input: $input) {
      ok
      error
    }
  }
`;

export type UpdatePhysicianAssessmentRequest = MutationUpdateApplicationPhysicianAssessmentArgs;

export type UpdatePhysicianAssessmentResponse = {
  updateApplicationPhysicianAssessment: UpdateApplicationPhysicianAssessmentResult;
};
