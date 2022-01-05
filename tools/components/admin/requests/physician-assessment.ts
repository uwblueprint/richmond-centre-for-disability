import { Application } from '@lib/graphql/types';

/** Physician assessment in forms */
export type PhysicianAssessment = Pick<
  Application,
  'disability' | 'affectsMobility' | 'mobilityAidRequired' | 'cannotWalk100m' | 'permitType'
> & {
  //TODO: Update DB to account for these columns
  physicianCertificationDate: string;
  patientEligibilityDescription?: string;
  temporaryPermitExpiryDate?: string;
};
