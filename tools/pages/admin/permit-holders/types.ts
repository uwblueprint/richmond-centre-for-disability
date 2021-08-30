import {
  Applicant,
  Application,
  ApplicationProcessing,
  MedicalInformation,
  Permit,
  Physician,
} from '@lib/graphql/types';

//Used in PermitHolderHeader and PersonalInformationCard components
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

//Used in AppHistoryCard component
export type PermitData = Pick<Permit, 'rcdPermitId' | 'expiryDate' | 'applicationId'> &
  Pick<Application, 'isRenewal'> &
  Pick<ApplicationProcessing, 'status'>;

//Used in [permitHolderId].tsx
export type PermitHolderAttachedFile = Pick<ApplicationProcessing, 'appNumber' | 'createdAt'> & {
  readonly fileUrl: string;
};

//Used in MedicalHistoyCard component
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

//Used in DoctorInformationCard and PreviousDoctorsInformationModal
export type PreviousPhysicianData = Pick<Physician, 'name' | 'mspNumber' | 'phone'>;
