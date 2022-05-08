import {
  NewApplication,
  PermitType,
  PatientCondition,
  QueryApplicationArgs,
} from '@lib/graphql/types';
import { gql } from '@apollo/client';

/** Physician assessment in forms */
export type PhysicianAssessment = Pick<
  NewApplication,
  'disability' | 'disabilityCertificationDate' | 'otherPatientCondition' | 'temporaryPermitExpiry'
> & {
  patientCondition: PatientCondition | null;
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
  >;
};
