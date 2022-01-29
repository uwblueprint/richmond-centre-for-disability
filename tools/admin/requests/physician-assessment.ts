import { PermitType } from '@lib/graphql/types';
import { PatientCondition } from '@lib/graphql/types';
import { NewApplication } from '@lib/graphql/types';

/** Physician assessment in forms */
export type PhysicianAssessment = Pick<NewApplication, 'disability'> & {
  patientCondition: PatientCondition | null;
  permitType: PermitType | null;
  //TODO: Update DB to account for these columns
  physicianCertificationDate: string;
  patientEligibilityDescription?: string;
  temporaryPermitExpiryDate?: string;
};
