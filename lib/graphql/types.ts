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
  ID: number;
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
  Walker = 'WALKER'
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
  status?: Maybe<ApplicantStatus>;
  applications?: Maybe<Array<Application>>;
  guardianId: Scalars['Int'];
  guardian: Guardian;
  medicalInformationId: Scalars['Int'];
  medicalInformation: MedicalInformation;
  permits: Array<Permit>;
  medicalHistory?: Maybe<Array<MedicalHistory>>;
  mostRecentPermit: Permit;
};

export enum ApplicantStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export type ApplicantsFilter = {
  order?: Maybe<Array<Array<Scalars['String']>>>;
  permitStatus?: Maybe<PermitStatus>;
  userStatus?: Maybe<UserStatus>;
  expiryDateRangeFrom?: Maybe<Scalars['Date']>;
  expiryDateRangeTo?: Maybe<Scalars['Date']>;
  search?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};

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
  permitType: PermitType;
  poaFormUrl?: Maybe<Scalars['String']>;
  applicantId?: Maybe<Scalars['Int']>;
  applicant?: Maybe<Applicant>;
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
  /** Permit */
  permit?: Maybe<Permit>;
};

export type ApplicationProcessing = {
  __typename?: 'ApplicationProcessing';
  id?: Maybe<Scalars['Int']>;
  status?: Maybe<ApplicationStatus>;
  appNumber?: Maybe<Scalars['Int']>;
  appHolepunched?: Maybe<Scalars['Boolean']>;
  walletCardCreated?: Maybe<Scalars['Boolean']>;
  invoiceNumber?: Maybe<Scalars['Int']>;
  documentUrls?: Maybe<Array<Maybe<Scalars['String']>>>;
  appMailed?: Maybe<Scalars['Boolean']>;
  applicationId?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['Date']>;
  updatedAt?: Maybe<Scalars['Date']>;
  application?: Maybe<Application>;
};

export enum ApplicationStatus {
  Pending = 'PENDING',
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
  Completed = 'COMPLETED'
}

export type ApplicationsFilter = {
  order?: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
  permitType?: Maybe<PermitType>;
  requestType?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  search?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};

export type ApplicationsFilterResult = {
  __typename?: 'ApplicationsFilterResult';
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  id: Scalars['ID'];
  createdAt: Scalars['Date'];
  applicationProcessing?: Maybe<ApplicationProcessing>;
  isRenewal: Scalars['Boolean'];
  permitType: PermitType;
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
  medicalInformation: CreateMedicalInformationInput;
  guardian: CreateGuardianInput;
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
  permitType: PermitType;
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

/** Fields to specify when creating a guardian record for an applicant */
export type CreateGuardianInput = {
  firstName: Scalars['String'];
  middleName?: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  addressLine1: Scalars['String'];
  addressLine2?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  province: Province;
  postalCode: Scalars['String'];
  phone: Scalars['String'];
  relationship: Scalars['String'];
  notes?: Maybe<Scalars['String']>;
};

/** Fields to specify when creating a medical information record for an applicant */
export type CreateMedicalInformationInput = {
  disability: Scalars['String'];
  affectsMobility: Scalars['Boolean'];
  mobilityAidRequired: Scalars['Boolean'];
  cannotWalk100m: Scalars['Boolean'];
  notes?: Maybe<Scalars['String']>;
  certificationDate?: Maybe<Scalars['Date']>;
  aid?: Maybe<Array<Aid>>;
  physicianMspNumber: Scalars['Int'];
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
  Other = 'OTHER'
}

export type Guardian = {
  __typename?: 'Guardian';
  id: Scalars['ID'];
  firstName: Scalars['String'];
  middleName?: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  addressLine1: Scalars['String'];
  addressLine2?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  province: Province;
  postalCode: Scalars['String'];
  phone: Scalars['String'];
  relationship: Scalars['String'];
  notes?: Maybe<Scalars['String']>;
};

export type MedicalHistory = {
  __typename?: 'MedicalHistory';
  applicationId: Scalars['ID'];
  physician: Physician;
};

export type MedicalInformation = {
  __typename?: 'MedicalInformation';
  id: Scalars['ID'];
  disability: Scalars['String'];
  affectsMobility: Scalars['Boolean'];
  mobilityAidRequired: Scalars['Boolean'];
  cannotWalk100m: Scalars['Boolean'];
  notes?: Maybe<Scalars['String']>;
  certificationDate?: Maybe<Scalars['Date']>;
  aid?: Maybe<Array<Aid>>;
  applicant: Applicant;
  applicantId: Scalars['Int'];
  physician: Physician;
  physicianId: Scalars['Int'];
};

export type Meta = {
  __typename?: 'Meta';
  orgName: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createApplicant: CreateApplicantResult;
  updateApplicant: UpdateApplicantResult;
  createEmployee: CreateEmployeeResult;
  createPhysician: CreatePhysicianResult;
  upsertPhysician: UpsertPhysicianResult;
  createApplication: CreateApplicationResult;
  createPermit: CreatePermitResult;
  updateMedicalInformation: UpdateMedicalInformationResult;
  updateGuardian: UpdateGuardianResult;
};


export type MutationCreateApplicantArgs = {
  input: CreateApplicantInput;
};


export type MutationUpdateApplicantArgs = {
  input: UpdateApplicantInput;
};


export type MutationCreateEmployeeArgs = {
  input: CreateEmployeeInput;
};


export type MutationCreatePhysicianArgs = {
  input: CreatePhysicianInput;
};


export type MutationUpsertPhysicianArgs = {
  input: UpsertPhysicianInput;
};


export type MutationCreateApplicationArgs = {
  input: CreateApplicationInput;
};


export type MutationCreatePermitArgs = {
  input: CreatePermitInput;
};


export type MutationUpdateMedicalInformationArgs = {
  input: UpdateMedicalInformationInput;
};


export type MutationUpdateGuardianArgs = {
  input: UpdateGuardianInput;
};

export enum PaymentType {
  Mastercard = 'MASTERCARD',
  Visa = 'VISA',
  Etransfer = 'ETRANSFER',
  Cash = 'CASH',
  Cheque = 'CHEQUE',
  Debit = 'DEBIT',
  MoneyOrder = 'MONEY_ORDER'
}

export type Permit = {
  __typename?: 'Permit';
  id: Scalars['ID'];
  rcdPermitId: Scalars['Int'];
  expiryDate: Scalars['Date'];
  receiptId?: Maybe<Scalars['Int']>;
  active: Scalars['Boolean'];
  application: Application;
  applicationId: Scalars['Int'];
  applicant: Applicant;
  applicantId: Scalars['Int'];
};

export enum PermitStatus {
  Valid = 'VALID',
  Expired = 'EXPIRED',
  ExpiringInThirtyDays = 'EXPIRING_IN_THIRTY_DAYS'
}

export enum PermitType {
  Permanent = 'PERMANENT',
  Temporary = 'TEMPORARY'
}

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
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
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
  Yt = 'YT'
}

export type Query = {
  __typename?: 'Query';
  meta: Meta;
  applicants?: Maybe<QueryApplicantsResult>;
  applicant?: Maybe<Applicant>;
  employees?: Maybe<Array<Employee>>;
  physicians?: Maybe<Array<Physician>>;
  applications?: Maybe<QueryApplicationsResult>;
  permits?: Maybe<Array<Permit>>;
};


export type QueryApplicantsArgs = {
  filter?: Maybe<ApplicantsFilter>;
};


export type QueryApplicantArgs = {
  id: Scalars['ID'];
};

export type QueryApplicantsResult = {
  __typename?: 'QueryApplicantsResult';
  result: Array<Applicant>;
  totalCount: Scalars['Int'];
};

export type QueryApplicationsArgs = {
  filter?: Maybe<ApplicationsFilter>;
};

export type QueryApplicationsResult = {
  __typename?: 'QueryApplicationsResult';
  result?: Maybe<Array<Maybe<ApplicationsFilterResult>>>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type QueryEmployeeInput = {
  id?: Maybe<Scalars['ID']>;
};

export enum ReasonForReplacement {
  Lost = 'LOST',
  Stolen = 'STOLEN',
  Other = 'OTHER'
}

export enum Role {
  Admin = 'ADMIN',
  Accounting = 'ACCOUNTING',
  Secretary = 'SECRETARY'
}

export type UpdateApplicantInput = {
  id: Scalars['ID'];
  firstName?: Maybe<Scalars['String']>;
  middleName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['Date']>;
  gender?: Maybe<Gender>;
  customGender?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  province?: Maybe<Province>;
  city?: Maybe<Scalars['String']>;
  addressLine1?: Maybe<Scalars['String']>;
  addressLine2?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
  rcdUserId?: Maybe<Scalars['Int']>;
};

export type UpdateApplicantResult = {
  __typename?: 'UpdateApplicantResult';
  ok: Scalars['Boolean'];
};

export type UpdateGuardianInput = {
  applicantId: Scalars['Int'];
  firstName?: Maybe<Scalars['String']>;
  middleName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  addressLine1?: Maybe<Scalars['String']>;
  addressLine2?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  province?: Maybe<Province>;
  postalCode?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  relationship?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
};

export type UpdateGuardianResult = {
  __typename?: 'UpdateGuardianResult';
  ok: Scalars['Boolean'];
};

export type UpdateMedicalInformationInput = {
  applicantId: Scalars['Int'];
  disability?: Maybe<Scalars['String']>;
  affectsMobility?: Maybe<Scalars['Boolean']>;
  mobilityAidRequired?: Maybe<Scalars['Boolean']>;
  cannotWalk100m?: Maybe<Scalars['Boolean']>;
  notes?: Maybe<Scalars['String']>;
  certificationDate?: Maybe<Scalars['Date']>;
  aid?: Maybe<Array<Aid>>;
};

export type UpdateMedicalInformationResult = {
  __typename?: 'UpdateMedicalInformationResult';
  ok: Scalars['Boolean'];
};

export type UpsertPhysicianInput = {
  mspNumber: Scalars['Int'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  addressLine1: Scalars['String'];
  addressLine2?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  province: Province;
  postalCode: Scalars['String'];
  phone: Scalars['String'];
  status: PhysicianStatus;
  notes?: Maybe<Scalars['String']>;
};

export type UpsertPhysicianResult = {
  __typename?: 'UpsertPhysicianResult';
  ok: Scalars['Boolean'];
};

export enum UserStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}
