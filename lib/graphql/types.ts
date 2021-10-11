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
  middleName: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  dateOfBirth: Scalars['Date'];
  gender: Gender;
  customGender: Maybe<Scalars['String']>;
  email: Maybe<Scalars['String']>;
  phone: Scalars['String'];
  province: Province;
  city: Scalars['String'];
  addressLine1: Scalars['String'];
  addressLine2: Maybe<Scalars['String']>;
  postalCode: Scalars['String'];
  rcdUserId: Maybe<Scalars['Int']>;
  acceptedTos: Maybe<Scalars['Date']>;
  status: Maybe<ApplicantStatus>;
  inactiveReason: Maybe<Scalars['String']>;
  activePermit: Maybe<Permit>;
  applications: Maybe<Array<Application>>;
  guardianId: Maybe<Scalars['Int']>;
  guardian: Maybe<Guardian>;
  medicalInformationId: Scalars['Int'];
  medicalInformation: MedicalInformation;
  permits: Array<Permit>;
  medicalHistory: Maybe<Array<MedicalHistory>>;
  mostRecentPermit: Permit;
  fileHistory: Array<ApplicationFileAttachments>;
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
  customGender: Maybe<Scalars['String']>;
  email: Maybe<Scalars['String']>;
  phone: Scalars['String'];
  province: Province;
  city: Scalars['String'];
  addressLine1: Scalars['String'];
  addressLine2: Maybe<Scalars['String']>;
  postalCode: Scalars['String'];
  notes: Maybe<Scalars['String']>;
  rcdUserId: Maybe<Scalars['Int']>;
  isRenewal: Scalars['Boolean'];
  permitType: PermitType;
  poaFormUrl: Maybe<Scalars['String']>;
  applicantId: Maybe<Scalars['Int']>;
  applicant: Maybe<Applicant>;
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
  physicianAddressLine2: Maybe<Scalars['String']>;
  physicianCity: Scalars['String'];
  physicianProvince: Province;
  physicianPostalCode: Scalars['String'];
  physicianPhone: Scalars['String'];
  physicianNotes: Maybe<Scalars['String']>;
  /** Payment Information */
  shippingFullName: Maybe<Scalars['String']>;
  shippingAddressLine1: Maybe<Scalars['String']>;
  shippingAddressLine2: Maybe<Scalars['String']>;
  shippingCity: Maybe<Scalars['String']>;
  shippingProvince: Maybe<Province>;
  /** shippingCountry: String */
  shippingPostalCode: Maybe<Scalars['String']>;
  billingFullName: Maybe<Scalars['String']>;
  billingAddressLine1: Maybe<Scalars['String']>;
  billingAddressLine2: Maybe<Scalars['String']>;
  billingCity: Maybe<Scalars['String']>;
  billingProvince: Maybe<Province>;
  /** billingCountry: String */
  billingPostalCode: Maybe<Scalars['String']>;
  shippingAddressSameAsHomeAddress: Scalars['Boolean'];
  billingAddressSameAsHomeAddress: Scalars['Boolean'];
  processingFee: Scalars['Float'];
  donationAmount: Maybe<Scalars['Float']>;
  paymentMethod: PaymentType;
  shopifyConfirmationNumber: Scalars['String'];
  /** Guardian */
  guardianFirstName: Maybe<Scalars['String']>;
  guardianMiddleName: Maybe<Scalars['String']>;
  guardianLastName: Maybe<Scalars['String']>;
  guardianPhone: Maybe<Scalars['String']>;
  guardianProvince: Maybe<Province>;
  guardianCity: Maybe<Scalars['String']>;
  guardianAddressLine1: Maybe<Scalars['String']>;
  guardianAddressLine2: Maybe<Scalars['String']>;
  guardianPostalCode: Maybe<Scalars['String']>;
  guardianRelationship: Maybe<Scalars['String']>;
  guardianNotes: Maybe<Scalars['String']>;
  /** Permit */
  permit: Maybe<Permit>;
  /** Application Processing */
  applicationProcessing: Maybe<ApplicationProcessing>;
  /** Replacement */
  replacement: Maybe<Replacement>;
  /** Misc */
  createdAt: Scalars['Date'];
};

export type ApplicationFileAttachments = {
  __typename?: 'ApplicationFileAttachments';
  documentUrls: Maybe<Array<Scalars['String']>>;
  appNumber: Maybe<Scalars['Int']>;
  createdAt: Scalars['Date'];
};

export type ApplicationProcessing = {
  __typename?: 'ApplicationProcessing';
  id: Scalars['ID'];
  status: ApplicationStatus;
  appNumber: Maybe<Scalars['Int']>;
  appHolepunched: Scalars['Boolean'];
  walletCardCreated: Scalars['Boolean'];
  invoiceNumber: Maybe<Scalars['Int']>;
  documentUrls: Maybe<Array<Scalars['String']>>;
  appMailed: Scalars['Boolean'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  application: Application;
};

export enum ApplicationStatus {
  Pending = 'PENDING',
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
  Completed = 'COMPLETED'
}

export type ApplicationsFilter = {
  order?: Maybe<Array<Maybe<Array<Scalars['String']>>>>;
  permitType?: Maybe<PermitType>;
  requestType?: Maybe<Scalars['String']>;
  status?: Maybe<ApplicationStatus>;
  search?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};

export type CompleteApplicationResult = {
  __typename?: 'CompleteApplicationResult';
  ok: Scalars['Boolean'];
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
  acceptedTos?: Maybe<Scalars['Date']>;
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
  email?: Maybe<Scalars['String']>;
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
  name: Scalars['String'];
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

export type CreateRenewalApplicationInput = {
  applicantId: Scalars['Int'];
  updatedAddress: Scalars['Boolean'];
  updatedContactInfo: Scalars['Boolean'];
  updatedPhysician: Scalars['Boolean'];
  /** Personal address info (must be provided if updatedAddress === true) */
  addressLine1?: Maybe<Scalars['String']>;
  addressLine2?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
  /** Contact info (at least one must be provided if updatedContactInfo === true) */
  phone?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  /** Doctor info (must be provided if updatedDoctor === true) */
  physicianName?: Maybe<Scalars['String']>;
  physicianMspNumber?: Maybe<Scalars['Int']>;
  physicianAddressLine1?: Maybe<Scalars['String']>;
  physicianAddressLine2?: Maybe<Scalars['String']>;
  physicianCity?: Maybe<Scalars['String']>;
  physicianPostalCode?: Maybe<Scalars['String']>;
  physicianPhone?: Maybe<Scalars['String']>;
};

export type CreateRenewalApplicationResult = {
  __typename?: 'CreateRenewalApplicationResult';
  ok: Scalars['Boolean'];
};


export type DeleteEmployeeResult = {
  __typename?: 'DeleteEmployeeResult';
  ok: Scalars['Boolean'];
};

export type Employee = {
  __typename?: 'Employee';
  id: Scalars['ID'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  role: Role;
  active: Scalars['Boolean'];
};

export type EmployeesFilter = {
  order?: Maybe<Array<Array<Scalars['String']>>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
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
  middleName: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  addressLine1: Scalars['String'];
  addressLine2: Maybe<Scalars['String']>;
  city: Scalars['String'];
  province: Province;
  postalCode: Scalars['String'];
  phone: Scalars['String'];
  relationship: Scalars['String'];
  notes: Maybe<Scalars['String']>;
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
  notes: Maybe<Scalars['String']>;
  certificationDate: Maybe<Scalars['Date']>;
  aid: Maybe<Array<Aid>>;
  applicant: Applicant;
  applicantId: Scalars['Int'];
  physician: Physician;
  physicianId: Scalars['Int'];
  createdAt: Scalars['Date'];
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
  updateEmployee: UpdateEmployeeResult;
  deleteEmployee: DeleteEmployeeResult;
  createPhysician: CreatePhysicianResult;
  upsertPhysician: UpsertPhysicianResult;
  createApplication: CreateApplicationResult;
  createRenewalApplication: CreateRenewalApplicationResult;
  updateApplication: UpdateApplicationResult;
  createPermit: CreatePermitResult;
  updateMedicalInformation: UpdateMedicalInformationResult;
  updateGuardian: UpdateGuardianResult;
  updateApplicationProcessing: UpdateApplicationProcessingResult;
  completeApplication: CompleteApplicationResult;
  verifyIdentity: VerifyIdentityResult;
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


export type MutationUpdateEmployeeArgs = {
  input: UpdateEmployeeInput;
};


export type MutationDeleteEmployeeArgs = {
  id: Scalars['ID'];
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


export type MutationCreateRenewalApplicationArgs = {
  input: CreateRenewalApplicationInput;
};


export type MutationUpdateApplicationArgs = {
  input: UpdateApplicationInput;
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


export type MutationUpdateApplicationProcessingArgs = {
  input: UpdateApplicationProcessingInput;
};


export type MutationCompleteApplicationArgs = {
  applicationId: Scalars['ID'];
};


export type MutationVerifyIdentityArgs = {
  input: VerifyIdentityInput;
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
  receiptId: Maybe<Scalars['Int']>;
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
  name: Scalars['String'];
  mspNumber: Scalars['Int'];
  addressLine1: Scalars['String'];
  addressLine2: Maybe<Scalars['String']>;
  city: Scalars['String'];
  province: Province;
  postalCode: Scalars['String'];
  phone: Scalars['String'];
  status: PhysicianStatus;
  notes: Maybe<Scalars['String']>;
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
  applicants: Maybe<QueryApplicantsResult>;
  applicant: Maybe<Applicant>;
  employees: Maybe<QueryEmployeesResult>;
  employee: Maybe<Employee>;
  physicians: Maybe<Array<Physician>>;
  applications: Maybe<QueryApplicationsResult>;
  application: Maybe<Application>;
  permits: Maybe<Array<Permit>>;
};


export type QueryApplicantsArgs = {
  filter: Maybe<ApplicantsFilter>;
};


export type QueryApplicantArgs = {
  id: Scalars['ID'];
};


export type QueryEmployeesArgs = {
  filter: Maybe<EmployeesFilter>;
};


export type QueryEmployeeArgs = {
  id: Scalars['ID'];
};


export type QueryApplicationsArgs = {
  filter: Maybe<ApplicationsFilter>;
};


export type QueryApplicationArgs = {
  id: Scalars['ID'];
};

export type QueryApplicantsResult = {
  __typename?: 'QueryApplicantsResult';
  result: Array<Applicant>;
  totalCount: Scalars['Int'];
};

export type QueryApplicationsResult = {
  __typename?: 'QueryApplicationsResult';
  result: Array<Application>;
  totalCount: Scalars['Int'];
};

export type QueryEmployeeInput = {
  id?: Maybe<Scalars['ID']>;
};

export type QueryEmployeesResult = {
  __typename?: 'QueryEmployeesResult';
  result: Array<Employee>;
  totalCount: Scalars['Int'];
};

export enum ReasonForReplacement {
  Lost = 'LOST',
  Stolen = 'STOLEN',
  Other = 'OTHER'
}

export type Replacement = {
  __typename?: 'Replacement';
  id: Scalars['ID'];
  reason: ReasonForReplacement;
  lostTimestamp: Maybe<Scalars['Date']>;
  lostLocation: Maybe<Scalars['String']>;
  stolenPoliceFileNumber: Maybe<Scalars['Int']>;
  stolenJurisdiction: Maybe<Scalars['String']>;
  stolenPoliceOfficerName: Maybe<Scalars['String']>;
  description: Maybe<Scalars['String']>;
  applicationId: Scalars['ID'];
};

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
  inactiveReason?: Maybe<Scalars['String']>;
  rcdUserId?: Maybe<Scalars['Int']>;
};

export type UpdateApplicantResult = {
  __typename?: 'UpdateApplicantResult';
  ok: Scalars['Boolean'];
};

export type UpdateApplicationInput = {
  id: Scalars['ID'];
  /** Applicant information */
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
  notes?: Maybe<Scalars['String']>;
  rcdUserId?: Maybe<Scalars['Int']>;
  isRenewal?: Maybe<Scalars['Boolean']>;
  poaFormUrl?: Maybe<Scalars['String']>;
  applicantId?: Maybe<Scalars['Int']>;
  /** Medical information */
  disability?: Maybe<Scalars['String']>;
  affectsMobility?: Maybe<Scalars['Boolean']>;
  mobilityAidRequired?: Maybe<Scalars['Boolean']>;
  cannotWalk100m?: Maybe<Scalars['Boolean']>;
  /** NOTE: Might need to change this to accept a single Aid object, and push to the aid array */
  aid?: Maybe<Array<Aid>>;
  /** Physician Information */
  physicianName?: Maybe<Scalars['String']>;
  physicianMspNumber?: Maybe<Scalars['Int']>;
  physicianAddressLine1?: Maybe<Scalars['String']>;
  physicianAddressLine2?: Maybe<Scalars['String']>;
  physicianCity?: Maybe<Scalars['String']>;
  physicianProvince?: Maybe<Province>;
  physicianPostalCode?: Maybe<Scalars['String']>;
  physicianPhone?: Maybe<Scalars['String']>;
  physicianNotes?: Maybe<Scalars['String']>;
  /** Payment Information */
  shippingFullName?: Maybe<Scalars['String']>;
  shippingAddressLine1?: Maybe<Scalars['String']>;
  shippingAddressLine2?: Maybe<Scalars['String']>;
  shippingCity?: Maybe<Scalars['String']>;
  shippingProvince?: Maybe<Province>;
  /** shippingCountry: String */
  shippingPostalCode?: Maybe<Scalars['String']>;
  billingFullName?: Maybe<Scalars['String']>;
  billingAddressLine1?: Maybe<Scalars['String']>;
  billingAddressLine2?: Maybe<Scalars['String']>;
  billingCity?: Maybe<Scalars['String']>;
  billingProvince?: Maybe<Province>;
  /** billingCountry: String */
  billingPostalCode?: Maybe<Scalars['String']>;
  shippingAddressSameAsHomeAddress?: Maybe<Scalars['Boolean']>;
  billingAddressSameAsHomeAddress?: Maybe<Scalars['Boolean']>;
  processingFee?: Maybe<Scalars['Float']>;
  donationAmount?: Maybe<Scalars['Float']>;
  paymentMethod?: Maybe<PaymentType>;
  shopifyConfirmationNumber?: Maybe<Scalars['String']>;
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

export type UpdateApplicationProcessingInput = {
  applicationId: Scalars['ID'];
  status?: Maybe<ApplicationStatus>;
  appNumber?: Maybe<Scalars['Int']>;
  appHolepunched?: Maybe<Scalars['Boolean']>;
  walletCardCreated?: Maybe<Scalars['Boolean']>;
  invoiceNumber?: Maybe<Scalars['Int']>;
  documentUrl?: Maybe<Scalars['String']>;
  appMailed?: Maybe<Scalars['Boolean']>;
};

export type UpdateApplicationProcessingResult = {
  __typename?: 'UpdateApplicationProcessingResult';
  ok: Scalars['Boolean'];
};

export type UpdateApplicationResult = {
  __typename?: 'UpdateApplicationResult';
  ok: Scalars['Boolean'];
};

export type UpdateEmployeeInput = {
  id: Scalars['ID'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  role: Role;
};

export type UpdateEmployeeResult = {
  __typename?: 'UpdateEmployeeResult';
  ok: Scalars['Boolean'];
  employee: Employee;
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
  physicianId?: Maybe<Scalars['Int']>;
};

export type UpdateMedicalInformationResult = {
  __typename?: 'UpdateMedicalInformationResult';
  ok: Scalars['Boolean'];
};

export type UpsertPhysicianInput = {
  mspNumber: Scalars['Int'];
  name: Scalars['String'];
  addressLine1: Scalars['String'];
  addressLine2?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  province?: Maybe<Province>;
  postalCode: Scalars['String'];
  phone: Scalars['String'];
  status?: Maybe<PhysicianStatus>;
  notes?: Maybe<Scalars['String']>;
};

export type UpsertPhysicianResult = {
  __typename?: 'UpsertPhysicianResult';
  ok: Scalars['Boolean'];
  physicianId: Scalars['Int'];
};

export enum UserStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export enum VerifyIdentityFailureReason {
  IdentityVerificationFailed = 'IDENTITY_VERIFICATION_FAILED',
  AppDoesNotExpireWithin_30Days = 'APP_DOES_NOT_EXPIRE_WITHIN_30_DAYS'
}

export type VerifyIdentityInput = {
  userId: Scalars['Int'];
  phoneNumberSuffix: Scalars['String'];
  dateOfBirth: Scalars['Date'];
  acceptedTos: Scalars['Date'];
};

export type VerifyIdentityResult = {
  __typename?: 'VerifyIdentityResult';
  ok: Scalars['Boolean'];
  failureReason: Maybe<VerifyIdentityFailureReason>;
  applicantId: Maybe<Scalars['Int']>;
};
