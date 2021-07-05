/* eslint-disable */
/**********************************************************************
 *** THIS IS AN AUTO-GENERATED FILE. PLEASE DO NOT MODIFY DIRECTLY. ***
 **********************************************************************/
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Date custom scalar type */
  Date: any;
};

export enum Aid {
  Cane = 'CANE',
  ElectricChair = 'ELECTRIC_CHAIR',
  ManualChair = 'MANUAL_CHAIR',
  Scooter = 'SCOOTER',
  Walker = 'WALKER',
}

export type Applicant = {
  __typename?: 'Applicant';
  id: Scalars['ID'];
  firstName: Scalars['String'];
  middleName?: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  dateOfBirth: Scalars['Date'];
  gender: Gender;
  customGender?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  phone: Scalars['String'];
  province: Province;
  city: Scalars['String'];
  addressLine1: Scalars['String'];
  addressLine2?: Maybe<Scalars['String']>;
  postalCode: Scalars['String'];
  rcdUserId?: Maybe<Scalars['Int']>;
  acceptedTOC?: Maybe<Scalars['Date']>;
  /** status: ApplicantStatus */
  applications?: Maybe<Array<Application>>;
};

export enum ApplicantStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Deceased = 'DECEASED',
}

export type Application = {
  __typename?: 'Application';
  /** Applicant information */
  id: Scalars['ID'];
  firstName: Scalars['String'];
  middleName: Scalars['String'];
  lastName: Scalars['String'];
  dateOfBirth: Scalars['Date'];
  gender: Gender;
  customGender?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  phone: Scalars['String'];
  province: Province;
  city: Scalars['String'];
  addressLine1: Scalars['String'];
  addressLine2?: Maybe<Scalars['String']>;
  postalCode: Scalars['String'];
  notes?: Maybe<Scalars['String']>;
  rcdUserId?: Maybe<Scalars['Int']>;
  isRenewal: Scalars['Boolean'];
  poaFormUrl?: Maybe<Scalars['String']>;
  applicantId?: Maybe<Scalars['Int']>;
  /** Medical information */
  disability: Scalars['String'];
  affectsMobility: Scalars['Boolean'];
  mobilityAidRequired: Scalars['Boolean'];
  cannotWalk100m: Scalars['Boolean'];
  aid: Array<Aid>;
  /** Physician Information */
  physicianName: Scalars['String'];
  physicianMspNumber: Scalars['Int'];
  physicianAddressLine1: Scalars['String'];
  physicianAddressLine2?: Maybe<Scalars['String']>;
  physicianCity: Scalars['String'];
  physicianProvince: Province;
  physicianPostalCode: Scalars['String'];
  physicianPhone: Scalars['String'];
  physicianNotes?: Maybe<Scalars['String']>;
  /** Payment Information */
  processingFee: Scalars['Float'];
  donationAmount?: Maybe<Scalars['Float']>;
  paymentMethod: PaymentType;
  shopifyConfirmationNumber: Scalars['String'];
  /** Guardian */
  guardianFirstName?: Maybe<Scalars['String']>;
  guardianMiddleName?: Maybe<Scalars['String']>;
  guardianLastName?: Maybe<Scalars['String']>;
  guardianPhone?: Maybe<Scalars['String']>;
  guardianProvince?: Maybe<Province>;
  guardianCity?: Maybe<Scalars['String']>;
  guardianAddressLine1?: Maybe<Scalars['String']>;
  guardianAddressLine2?: Maybe<Scalars['String']>;
  guardianPostalCode?: Maybe<Scalars['String']>;
  guardianRelationship?: Maybe<Scalars['String']>;
  guardianNotes?: Maybe<Scalars['String']>;
};

export type CreateApplicantInput = {
  firstName: Scalars['String'];
  middleName?: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  dateOfBirth: Scalars['Date'];
  gender: Gender;
  customGender?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  phone: Scalars['String'];
  province: Province;
  city: Scalars['String'];
  addressLine1: Scalars['String'];
  addressLine2?: Maybe<Scalars['String']>;
  postalCode: Scalars['String'];
  rcdUserId?: Maybe<Scalars['Int']>;
  acceptedTOC?: Maybe<Scalars['Date']>;
};

export type CreateApplicantResult = {
  __typename?: 'CreateApplicantResult';
  ok: Scalars['Boolean'];
};

export type CreateApplicationInput = {
  /** Applicant information */
  firstName: Scalars['String'];
  middleName: Scalars['String'];
  lastName: Scalars['String'];
  dateOfBirth: Scalars['Date'];
  gender: Gender;
  customGender?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  phone: Scalars['String'];
  province: Province;
  city: Scalars['String'];
  addressLine1: Scalars['String'];
  addressLine2?: Maybe<Scalars['String']>;
  postalCode: Scalars['String'];
  notes?: Maybe<Scalars['String']>;
  rcdUserId?: Maybe<Scalars['Int']>;
  isRenewal: Scalars['Boolean'];
  poaFormUrl?: Maybe<Scalars['String']>;
  applicantId?: Maybe<Scalars['Int']>;
  /** Medical information */
  disability: Scalars['String'];
  affectsMobility: Scalars['Boolean'];
  mobilityAidRequired: Scalars['Boolean'];
  cannotWalk100m: Scalars['Boolean'];
  aid: Array<Aid>;
  /** Physician Information */
  physicianName: Scalars['String'];
  physicianMspNumber: Scalars['Int'];
  physicianAddressLine1: Scalars['String'];
  physicianAddressLine2?: Maybe<Scalars['String']>;
  physicianCity: Scalars['String'];
  physicianProvince: Province;
  physicianPostalCode: Scalars['String'];
  physicianPhone: Scalars['String'];
  physicianNotes?: Maybe<Scalars['String']>;
  /** Payment Information */
  processingFee: Scalars['Float'];
  donationAmount?: Maybe<Scalars['Float']>;
  paymentMethod: PaymentType;
  shopifyConfirmationNumber: Scalars['String'];
  /** Guardian */
  guardianFirstName?: Maybe<Scalars['String']>;
  guardianMiddleName?: Maybe<Scalars['String']>;
  guardianLastName?: Maybe<Scalars['String']>;
  guardianPhone?: Maybe<Scalars['String']>;
  guardianProvince?: Maybe<Province>;
  guardianCity?: Maybe<Scalars['String']>;
  guardianAddressLine1?: Maybe<Scalars['String']>;
  guardianAddressLine2?: Maybe<Scalars['String']>;
  guardianPostalCode?: Maybe<Scalars['String']>;
  guardianRelationship?: Maybe<Scalars['String']>;
  guardianNotes?: Maybe<Scalars['String']>;
};

export type CreateApplicationResult = {
  __typename?: 'CreateApplicationResult';
  ok: Scalars['Boolean'];
};

export type CreateEmployeeInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  role: Role;
};

export type CreateEmployeeResult = {
  __typename?: 'CreateEmployeeResult';
  ok: Scalars['Boolean'];
};

export type CreatePermitInput = {
  rcdPermitId: Scalars['Int'];
  expiryDate: Scalars['Date'];
  receiptId?: Maybe<Scalars['Int']>;
  active: Scalars['Boolean'];
  applicationId: Scalars['Int'];
  applicantId: Scalars['Int'];
};

export type CreatePermitResult = {
  __typename?: 'CreatePermitResult';
  ok: Scalars['Boolean'];
};

export type CreatePhysicianInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  mspNumber: Scalars['Int'];
  addressLine1: Scalars['String'];
  addressLine2?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  province: Province;
  postalCode: Scalars['String'];
  phone: Scalars['String'];
  status: PhysicianStatus;
  notes?: Maybe<Scalars['String']>;
};

export type CreatePhysicianResult = {
  __typename?: 'CreatePhysicianResult';
  ok: Scalars['Boolean'];
};

export type Employee = {
  __typename?: 'Employee';
  id: Scalars['ID'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  role: Role;
};

export enum Gender {
  Male = 'MALE',
  Female = 'FEMALE',
  Other = 'OTHER',
}

export type Meta = {
  __typename?: 'Meta';
  orgName: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createApplicant: CreateApplicantResult;
  createEmployee: CreateEmployeeResult;
  createPhysician: CreatePhysicianResult;
  createApplication: CreateApplicationResult;
  createPermit: CreatePermitResult;
};

export type MutationCreateApplicantArgs = {
  input: CreateApplicantInput;
};

export type MutationCreateEmployeeArgs = {
  input: CreateEmployeeInput;
};

export type MutationCreatePhysicianArgs = {
  input: CreatePhysicianInput;
};

export type MutationCreateApplicationArgs = {
  input: CreateApplicationInput;
};

export type MutationCreatePermitArgs = {
  input: CreatePermitInput;
};

export enum PaymentType {
  Mastercard = 'MASTERCARD',
  Visa = 'VISA',
  Etransfer = 'ETRANSFER',
  Cash = 'CASH',
  Cheque = 'CHEQUE',
  Debit = 'DEBIT',
  MoneyOrder = 'MONEY_ORDER',
}

export type Permit = {
  __typename?: 'Permit';
  id: Scalars['ID'];
  rcdPermitId: Scalars['Int'];
  expiryDate: Scalars['Date'];
  receiptId?: Maybe<Scalars['Int']>;
  active: Scalars['Boolean'];
  applicationId: Scalars['Int'];
  applicantId: Scalars['Int'];
};

export type Physician = {
  __typename?: 'Physician';
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  mspNumber: Scalars['Int'];
  addressLine1: Scalars['String'];
  addressLine2?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  province: Province;
  postalCode: Scalars['String'];
  phone: Scalars['String'];
  status: PhysicianStatus;
  notes?: Maybe<Scalars['String']>;
};

export enum PhysicianStatus {
  Deceased = 'DECEASED',
  Cancelled = 'CANCELLED',
  Retired = 'RETIRED',
  Active = 'ACTIVE',
  Resigned = 'RESIGNED',
  TemporarilyInactive = 'TEMPORARILY_INACTIVE',
  Relocated = 'RELOCATED',
}

export enum Province {
  Bc = 'BC',
  Ab = 'AB',
  Sk = 'SK',
  Mb = 'MB',
  On = 'ON',
  Qc = 'QC',
  Ns = 'NS',
  Pe = 'PE',
  Nl = 'NL',
  Nb = 'NB',
  Nu = 'NU',
  Nt = 'NT',
  Yt = 'YT',
}

export type Query = {
  __typename?: 'Query';
  meta: Meta;
  applicants?: Maybe<Array<Applicant>>;
  employees?: Maybe<Array<Employee>>;
  physicians?: Maybe<Array<Physician>>;
  applications?: Maybe<Array<Application>>;
  permits?: Maybe<Array<Permit>>;
};

export enum Role {
  Admin = 'ADMIN',
  Accounting = 'ACCOUNTING',
  Secretary = 'SECRETARY',
}
