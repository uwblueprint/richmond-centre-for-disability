import {
  Applicant,
  Application,
  ApplicationProcessing,
  MedicalInformation,
  Permit,
  Physician,
  UserStatus,
} from '@lib/graphql/types';

//Applicant data to show in Personal Information Card component
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

//Permit data to be displayed in the App History Card component
export type PermitData = Pick<Permit, 'rcdPermitId' | 'expiryDate' | 'applicationId'> &
  Pick<Application, 'isRenewal'> &
  Pick<ApplicationProcessing, 'status'>;

//Application Processing data that will be displayed in the Attached Files Card component
export type PermitHolderAttachedFile = Pick<ApplicationProcessing, 'appNumber' | 'createdAt'> & {
  readonly fileUrl: string;
};

//Medical history data to show in Medical History Card component
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

//Physician data to show in DoctorInformationCard and PreviousDoctorsInformationModal
export type PreviousPhysicianData = Pick<Physician, 'name' | 'mspNumber' | 'phone'>;

/**
 * Type for data required in Set Permit Holder Status modal
 */
export type PermitHolderToUpdateStatus = {
  readonly id: number;
  readonly status: UserStatus;
};
