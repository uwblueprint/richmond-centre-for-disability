import { Applicant, Application } from '@lib/graphql/types'; // Applicant type

/** Applicant type for Personal Information Card of View Request page */
export type PersonalInformationCardApplicant = Pick<
  Applicant,
  | 'id'
  | 'firstName'
  | 'middleName'
  | 'lastName'
  | 'rcdUserId'
  | 'email'
  | 'phone'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'province'
  | 'postalCode'
> &
  Pick<Application, 'receiveEmailUpdates'> & {
    readonly mostRecentAppNumber: number;
    readonly mostRecentAppExpiryDate: Date;
  };