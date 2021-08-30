import {
  Applicant,
  Application,
  ApplicationProcessing,
  MedicalInformation,
  Permit,
  Physician,
} from '@lib/graphql/types';

export type ApplicantData = Pick<
  Applicant,
  | 'id'
  | 'rcdUserId'
  | 'firstName'
  | 'lastName'
  | 'gender'
  | 'dateOfBirth'
  | 'email'
  | 'phone'
  | 'province'
  | 'city'
  | 'addressLine1'
  | 'addressLine2'
  | 'postalCode'
  | 'status'
>;

export type PermitData = Pick<Permit, 'rcdPermitId' | 'expiryDate' | 'applicationId'> &
  Pick<Application, 'isRenewal'> &
  Pick<ApplicationProcessing, 'status'>;

export type PermitHolderAttachedFile = Pick<ApplicationProcessing, 'appNumber' | 'createdAt'> & {
  readonly fileUrl: string;
};

export type MedicalHistoryEntry = Pick<MedicalInformation, 'disability' | 'createdAt'> & {
  readonly applicantApplication: Pick<
    Application,
    | 'disability'
    | 'affectsMobility'
    | 'mobilityAidRequired'
    | 'cannotWalk100m'
    | 'aid'
    | 'createdAt'
  >;
};

export type PreviousPhysicianData = Pick<Physician, 'name' | 'mspNumber' | 'phone'>;
