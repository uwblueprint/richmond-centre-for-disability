import { PermitType } from '@lib/graphql/types';
import { PatientCondition } from '@lib/graphql/types';
import { NewApplication } from '@lib/graphql/types';

/** Physician assessment in forms */
export type PhysicianAssessment = Pick<
  NewApplication,
  'disability' | 'disabilityCertificationDate' | 'otherPatientCondition' | 'temporaryPermitExpiry'
> & {
  patientCondition: PatientCondition | null;
  permitType: PermitType | null;
};
