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

export type AccessibleConvertedVanLoadingMethod =
  | 'SIDE_LOADING'
  | 'END_LOADING';

export type Applicant = {
  __typename?: 'Applicant';
  id: Scalars['Int'];
  firstName: Scalars['String'];
  middleName: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  dateOfBirth: Scalars['Date'];
  gender: Gender;
  otherGender: Maybe<Scalars['String']>;
  phone: Scalars['String'];
  email: Maybe<Scalars['String']>;
  receiveEmailUpdates: Scalars['Boolean'];
  addressLine1: Scalars['String'];
  addressLine2: Maybe<Scalars['String']>;
  city: Scalars['String'];
  province: Province;
  country: Scalars['String'];
  postalCode: Scalars['String'];
  status: ApplicantStatus;
  mostRecentPermit: Maybe<Permit>;
  activePermit: Maybe<Permit>;
  permits: Array<Permit>;
  completedApplications: Array<Application>;
  guardian: Maybe<Guardian>;
  medicalInformation: MedicalInformation;
};

export type ApplicantStatus =
  | 'ACTIVE'
  | 'INACTIVE';

export type ApplicantsFilter = {
  order: Maybe<Array<Array<Scalars['String']>>>;
  permitStatus: Maybe<PermitStatus>;
  userStatus: Maybe<ApplicantStatus>;
  expiryDateRangeFrom: Maybe<Scalars['Date']>;
  expiryDateRangeTo: Maybe<Scalars['Date']>;
  search: Maybe<Scalars['String']>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
};

export type ApplicantsResult = {
  __typename?: 'ApplicantsResult';
  result: Array<Applicant>;
  totalCount: Scalars['Int'];
};

export type Application = {
  id: Scalars['Int'];
  firstName: Scalars['String'];
  middleName: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  phone: Scalars['String'];
  email: Maybe<Scalars['String']>;
  receiveEmailUpdates: Scalars['Boolean'];
  addressLine1: Scalars['String'];
  addressLine2: Maybe<Scalars['String']>;
  city: Scalars['String'];
  province: Province;
  country: Scalars['String'];
  postalCode: Scalars['String'];
  permitType: PermitType;
  paymentMethod: PaymentType;
  processingFee: Scalars['String'];
  donationAmount: Scalars['String'];
  paidThroughShopify: Scalars['Boolean'];
  shopifyPaymentStatus: Maybe<ShopifyPaymentStatus>;
  shopifyConfirmationNumber: Maybe<Scalars['String']>;
  shippingAddressSameAsHomeAddress: Scalars['Boolean'];
  shippingFullName: Scalars['String'];
  shippingAddressLine1: Scalars['String'];
  shippingAddressLine2: Maybe<Scalars['String']>;
  shippingCity: Scalars['String'];
  shippingProvince: Province;
  shippingCountry: Scalars['String'];
  shippingPostalCode: Scalars['String'];
  billingAddressSameAsHomeAddress: Scalars['Boolean'];
  billingFullName: Scalars['String'];
  billingAddressLine1: Scalars['String'];
  billingAddressLine2: Maybe<Scalars['String']>;
  billingCity: Scalars['String'];
  billingProvince: Province;
  billingCountry: Scalars['String'];
  billingPostalCode: Scalars['String'];
  type: ApplicationType;
  processing: ApplicationProcessing;
  applicant: Maybe<Applicant>;
  createdAt: Scalars['Date'];
};

export type ApplicationProcessing = {
  __typename?: 'ApplicationProcessing';
  status: ApplicationStatus;
  rejectedReason: Maybe<Scalars['String']>;
  appNumber: Maybe<Scalars['Int']>;
  appNumberEmployeeId: Maybe<Scalars['Int']>;
  appNumberUpdatedAt: Maybe<Scalars['Date']>;
  appHolepunched: Scalars['Boolean'];
  appHolepunchedEmployeeId: Maybe<Scalars['Int']>;
  appHolepunchedUpdatedAt: Maybe<Scalars['Date']>;
  walletCardCreated: Scalars['Boolean'];
  walletCardCreatedEmployeeId: Maybe<Scalars['Int']>;
  walletCardCreatedUpdatedAt: Maybe<Scalars['Date']>;
  reviewRequestCompleted: Scalars['Boolean'];
  reviewRequestCompletedEmployeeId: Maybe<Scalars['Int']>;
  reviewRequestCompletedUpdatedAt: Maybe<Scalars['Date']>;
  invoice: Maybe<Invoice>;
  documentsUrl: Maybe<Scalars['String']>;
  documentsS3ObjectKey: Maybe<Scalars['String']>;
  documentsUrlEmployeeId: Maybe<Scalars['Int']>;
  documentsUrlUpdatedAt: Maybe<Scalars['Date']>;
  appMailed: Scalars['Boolean'];
  appMailedEmployeeId: Maybe<Scalars['Int']>;
  appMailedUpdatedAt: Maybe<Scalars['Date']>;
};

export type ApplicationStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'REJECTED'
  | 'COMPLETED';

export type ApplicationType =
  | 'NEW'
  | 'RENEWAL'
  | 'REPLACEMENT';

export type ApplicationsFilter = {
  order: Maybe<Array<Array<Scalars['String']>>>;
  permitType: Maybe<PermitType>;
  requestType: Maybe<ApplicationType>;
  status: Maybe<ApplicationStatus>;
  search: Maybe<Scalars['String']>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
};

export type ApplicationsReportColumn =
  | 'USER_ID'
  | 'APPLICANT_NAME'
  | 'APPLICANT_DATE_OF_BIRTH'
  | 'APP_NUMBER'
  | 'APPLICATION_DATE'
  | 'PAYMENT_METHOD'
  | 'FEE_AMOUNT'
  | 'DONATION_AMOUNT'
  | 'TOTAL_AMOUNT';

export type ApplicationsResult = {
  __typename?: 'ApplicationsResult';
  result: Array<Application>;
  totalCount: Scalars['Int'];
};

export type ApproveApplicationInput = {
  id: Scalars['Int'];
};

export type ApproveApplicationResult = {
  __typename?: 'ApproveApplicationResult';
  ok: Scalars['Boolean'];
};

export type CompleteApplicationInput = {
  id: Scalars['Int'];
};

export type CompleteApplicationResult = {
  __typename?: 'CompleteApplicationResult';
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
  employee: Employee;
};

export type CreateExternalRenewalApplicationInput = {
  updatedAddress: Scalars['Boolean'];
  addressLine1: Maybe<Scalars['String']>;
  addressLine2: Maybe<Scalars['String']>;
  city: Maybe<Scalars['String']>;
  postalCode: Maybe<Scalars['String']>;
  updatedContactInfo: Scalars['Boolean'];
  phone: Maybe<Scalars['String']>;
  email: Maybe<Scalars['String']>;
  receiveEmailUpdates: Scalars['Boolean'];
  updatedPhysician: Scalars['Boolean'];
  physicianFirstName: Maybe<Scalars['String']>;
  physicianLastName: Maybe<Scalars['String']>;
  physicianMspNumber: Maybe<Scalars['Int']>;
  physicianPhone: Maybe<Scalars['String']>;
  physicianAddressLine1: Maybe<Scalars['String']>;
  physicianAddressLine2: Maybe<Scalars['String']>;
  physicianCity: Maybe<Scalars['String']>;
  physicianPostalCode: Maybe<Scalars['String']>;
  usesAccessibleConvertedVan: Scalars['Boolean'];
  accessibleConvertedVanLoadingMethod: Maybe<AccessibleConvertedVanLoadingMethod>;
  requiresWiderParkingSpace: Scalars['Boolean'];
  requiresWiderParkingSpaceReason: Maybe<RequiresWiderParkingSpaceReason>;
  otherRequiresWiderParkingSpaceReason: Maybe<Scalars['String']>;
  applicantId: Scalars['Int'];
};

export type CreateExternalRenewalApplicationResult = {
  __typename?: 'CreateExternalRenewalApplicationResult';
  ok: Scalars['Boolean'];
  applicationId: Maybe<Scalars['Int']>;
};

export type CreateNewApplicationInput = {
  firstName: Scalars['String'];
  middleName: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  dateOfBirth: Scalars['Date'];
  gender: Gender;
  otherGender: Maybe<Scalars['String']>;
  phone: Scalars['String'];
  email: Maybe<Scalars['String']>;
  receiveEmailUpdates: Scalars['Boolean'];
  addressLine1: Scalars['String'];
  addressLine2: Maybe<Scalars['String']>;
  city: Scalars['String'];
  postalCode: Scalars['String'];
  disability: Scalars['String'];
  disabilityCertificationDate: Scalars['Date'];
  patientCondition: PatientCondition;
  mobilityAids: Maybe<Array<MobilityAid>>;
  otherPatientCondition: Maybe<Scalars['String']>;
  permitType: PermitType;
  temporaryPermitExpiry: Maybe<Scalars['Date']>;
  physicianFirstName: Scalars['String'];
  physicianLastName: Scalars['String'];
  physicianMspNumber: Scalars['Int'];
  physicianPhone: Scalars['String'];
  physicianAddressLine1: Scalars['String'];
  physicianAddressLine2: Maybe<Scalars['String']>;
  physicianCity: Scalars['String'];
  physicianPostalCode: Scalars['String'];
  omitGuardianPoa: Scalars['Boolean'];
  guardianFirstName: Maybe<Scalars['String']>;
  guardianMiddleName: Maybe<Scalars['String']>;
  guardianLastName: Maybe<Scalars['String']>;
  guardianPhone: Maybe<Scalars['String']>;
  guardianRelationship: Maybe<Scalars['String']>;
  guardianAddressLine1: Maybe<Scalars['String']>;
  guardianAddressLine2: Maybe<Scalars['String']>;
  guardianCity: Maybe<Scalars['String']>;
  guardianPostalCode: Maybe<Scalars['String']>;
  poaFormS3ObjectKey: Maybe<Scalars['String']>;
  usesAccessibleConvertedVan: Scalars['Boolean'];
  accessibleConvertedVanLoadingMethod: Maybe<AccessibleConvertedVanLoadingMethod>;
  requiresWiderParkingSpace: Scalars['Boolean'];
  requiresWiderParkingSpaceReason: Maybe<RequiresWiderParkingSpaceReason>;
  otherRequiresWiderParkingSpaceReason: Maybe<Scalars['String']>;
  paymentMethod: PaymentType;
  donationAmount: Maybe<Scalars['String']>;
  shippingAddressSameAsHomeAddress: Scalars['Boolean'];
  shippingFullName: Maybe<Scalars['String']>;
  shippingAddressLine1: Maybe<Scalars['String']>;
  shippingAddressLine2: Maybe<Scalars['String']>;
  shippingCity: Maybe<Scalars['String']>;
  shippingProvince: Maybe<Province>;
  shippingCountry: Maybe<Scalars['String']>;
  shippingPostalCode: Maybe<Scalars['String']>;
  billingAddressSameAsHomeAddress: Scalars['Boolean'];
  billingFullName: Maybe<Scalars['String']>;
  billingAddressLine1: Maybe<Scalars['String']>;
  billingAddressLine2: Maybe<Scalars['String']>;
  billingCity: Maybe<Scalars['String']>;
  billingProvince: Maybe<Province>;
  billingCountry: Maybe<Scalars['String']>;
  billingPostalCode: Maybe<Scalars['String']>;
  applicantId: Maybe<Scalars['Int']>;
};

export type CreateNewApplicationResult = {
  __typename?: 'CreateNewApplicationResult';
  ok: Scalars['Boolean'];
  applicationId: Maybe<Scalars['Int']>;
};

export type CreateRenewalApplicationInput = {
  firstName: Scalars['String'];
  middleName: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  phone: Scalars['String'];
  email: Maybe<Scalars['String']>;
  receiveEmailUpdates: Scalars['Boolean'];
  addressLine1: Scalars['String'];
  addressLine2: Maybe<Scalars['String']>;
  city: Scalars['String'];
  postalCode: Scalars['String'];
  physicianFirstName: Scalars['String'];
  physicianLastName: Scalars['String'];
  physicianMspNumber: Scalars['Int'];
  physicianPhone: Scalars['String'];
  physicianAddressLine1: Scalars['String'];
  physicianAddressLine2: Maybe<Scalars['String']>;
  physicianCity: Scalars['String'];
  physicianPostalCode: Scalars['String'];
  usesAccessibleConvertedVan: Scalars['Boolean'];
  accessibleConvertedVanLoadingMethod: Maybe<AccessibleConvertedVanLoadingMethod>;
  requiresWiderParkingSpace: Scalars['Boolean'];
  requiresWiderParkingSpaceReason: Maybe<RequiresWiderParkingSpaceReason>;
  otherRequiresWiderParkingSpaceReason: Maybe<Scalars['String']>;
  paymentMethod: PaymentType;
  donationAmount: Maybe<Scalars['String']>;
  paidThroughShopify: Scalars['Boolean'];
  shopifyPaymentStatus: Maybe<ShopifyPaymentStatus>;
  shopifyConfirmationNumber: Maybe<Scalars['String']>;
  shippingAddressSameAsHomeAddress: Scalars['Boolean'];
  shippingFullName: Maybe<Scalars['String']>;
  shippingAddressLine1: Maybe<Scalars['String']>;
  shippingAddressLine2: Maybe<Scalars['String']>;
  shippingCity: Maybe<Scalars['String']>;
  shippingProvince: Maybe<Province>;
  shippingCountry: Maybe<Scalars['String']>;
  shippingPostalCode: Maybe<Scalars['String']>;
  billingAddressSameAsHomeAddress: Scalars['Boolean'];
  billingFullName: Maybe<Scalars['String']>;
  billingAddressLine1: Maybe<Scalars['String']>;
  billingAddressLine2: Maybe<Scalars['String']>;
  billingCity: Maybe<Scalars['String']>;
  billingProvince: Maybe<Province>;
  billingCountry: Maybe<Scalars['String']>;
  billingPostalCode: Maybe<Scalars['String']>;
  applicantId: Scalars['Int'];
};

export type CreateRenewalApplicationResult = {
  __typename?: 'CreateRenewalApplicationResult';
  ok: Scalars['Boolean'];
  applicationId: Maybe<Scalars['Int']>;
};

export type CreateReplacementApplicationInput = {
  firstName: Scalars['String'];
  middleName: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  phone: Scalars['String'];
  email: Maybe<Scalars['String']>;
  addressLine1: Scalars['String'];
  addressLine2: Maybe<Scalars['String']>;
  city: Scalars['String'];
  postalCode: Scalars['String'];
  reason: ReasonForReplacement;
  lostTimestamp: Maybe<Scalars['Date']>;
  lostLocation: Maybe<Scalars['String']>;
  stolenPoliceFileNumber: Maybe<Scalars['Int']>;
  stolenJurisdiction: Maybe<Scalars['String']>;
  stolenPoliceOfficerName: Maybe<Scalars['String']>;
  eventDescription: Maybe<Scalars['String']>;
  paymentMethod: PaymentType;
  donationAmount: Maybe<Scalars['String']>;
  shippingAddressSameAsHomeAddress: Scalars['Boolean'];
  shippingFullName: Maybe<Scalars['String']>;
  shippingAddressLine1: Maybe<Scalars['String']>;
  shippingAddressLine2: Maybe<Scalars['String']>;
  shippingCity: Maybe<Scalars['String']>;
  shippingProvince: Maybe<Province>;
  shippingCountry: Maybe<Scalars['String']>;
  shippingPostalCode: Maybe<Scalars['String']>;
  billingAddressSameAsHomeAddress: Scalars['Boolean'];
  billingFullName: Maybe<Scalars['String']>;
  billingAddressLine1: Maybe<Scalars['String']>;
  billingAddressLine2: Maybe<Scalars['String']>;
  billingCity: Maybe<Scalars['String']>;
  billingProvince: Maybe<Province>;
  billingCountry: Maybe<Scalars['String']>;
  billingPostalCode: Maybe<Scalars['String']>;
  applicantId: Scalars['Int'];
};

export type CreateReplacementApplicationResult = {
  __typename?: 'CreateReplacementApplicationResult';
  ok: Scalars['Boolean'];
  applicationId: Maybe<Scalars['Int']>;
};


export type DeleteEmployeeInput = {
  id: Scalars['Int'];
};

export type DeleteEmployeeResult = {
  __typename?: 'DeleteEmployeeResult';
  ok: Scalars['Boolean'];
  employee: Employee;
};

export type Employee = {
  __typename?: 'Employee';
  id: Scalars['Int'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  role: Role;
};

export type EmployeesFilter = {
  order: Maybe<Array<Array<Scalars['String']>>>;
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
};

export type EmployeesResult = {
  __typename?: 'EmployeesResult';
  result: Array<Employee>;
  totalCount: Scalars['Int'];
};

export type Gender =
  | 'MALE'
  | 'FEMALE'
  | 'OTHER';

export type GenerateAccountantReportInput = {
  startDate: Scalars['Date'];
  endDate: Scalars['Date'];
};

export type GenerateAccountantReportResult = {
  __typename?: 'GenerateAccountantReportResult';
  ok: Scalars['Boolean'];
};

export type GenerateApplicationsReportInput = {
  startDate: Scalars['Date'];
  endDate: Scalars['Date'];
  columns: Array<ApplicationsReportColumn>;
};

export type GenerateApplicationsReportResult = {
  __typename?: 'GenerateApplicationsReportResult';
  ok: Scalars['Boolean'];
};

export type GeneratePermitHoldersReportInput = {
  startDate: Scalars['Date'];
  endDate: Scalars['Date'];
  columns: Array<PermitHoldersReportColumn>;
};

export type GeneratePermitHoldersReportResult = {
  __typename?: 'GeneratePermitHoldersReportResult';
  ok: Scalars['Boolean'];
};

export type Guardian = {
  __typename?: 'Guardian';
  firstName: Scalars['String'];
  middleName: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  phone: Scalars['String'];
  relationship: Scalars['String'];
  addressLine1: Scalars['String'];
  addressLine2: Maybe<Scalars['String']>;
  city: Scalars['String'];
  province: Province;
  country: Scalars['String'];
  postalCode: Scalars['String'];
};

export type Invoice = {
  __typename?: 'Invoice';
  invoiceNumber: Scalars['Int'];
  s3ObjectKey: Maybe<Scalars['String']>;
  s3ObjectUrl: Maybe<Scalars['String']>;
  employee: Employee;
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
};

export type MedicalInformation = {
  __typename?: 'MedicalInformation';
  id: Scalars['Int'];
  disability: Scalars['String'];
  disabilityCertificationDate: Scalars['Date'];
  patientCondition: PatientCondition;
  mobilityAids: Maybe<Array<MobilityAid>>;
  otherPatientCondition: Maybe<Scalars['String']>;
  physician: Physician;
};

export type MobilityAid =
  | 'CANE'
  | 'ELECTRIC_CHAIR'
  | 'MANUAL_CHAIR'
  | 'SCOOTER'
  | 'WALKER';

export type Mutation = {
  __typename?: 'Mutation';
  updateApplicantGeneralInformation: Maybe<UpdateApplicantGeneralInformationResult>;
  updateApplicantDoctorInformation: Maybe<UpdateApplicantDoctorInformationResult>;
  updateApplicantGuardianInformation: Maybe<UpdateApplicantGuardianInformationResult>;
  setApplicantAsActive: Maybe<SetApplicantAsActiveResult>;
  setApplicantAsInactive: Maybe<SetApplicantAsInactiveResult>;
  verifyIdentity: VerifyIdentityResult;
  createNewApplication: Maybe<CreateNewApplicationResult>;
  createRenewalApplication: Maybe<CreateRenewalApplicationResult>;
  createExternalRenewalApplication: CreateExternalRenewalApplicationResult;
  createReplacementApplication: Maybe<CreateReplacementApplicationResult>;
  updateApplicationGeneralInformation: Maybe<UpdateApplicationGeneralInformationResult>;
  updateNewApplicationGeneralInformation: Maybe<UpdateApplicationGeneralInformationResult>;
  updateApplicationDoctorInformation: Maybe<UpdateApplicationDoctorInformationResult>;
  updateApplicationAdditionalInformation: Maybe<UpdateApplicationAdditionalInformationResult>;
  updateApplicationPaymentInformation: Maybe<UpdateApplicationPaymentInformationResult>;
  updateApplicationReasonForReplacement: Maybe<UpdateApplicationReasonForReplacementResult>;
  updateApplicationPhysicianAssessment: Maybe<UpdateApplicationPhysicianAssessmentResult>;
  approveApplication: Maybe<ApproveApplicationResult>;
  rejectApplication: Maybe<RejectApplicationResult>;
  completeApplication: Maybe<CompleteApplicationResult>;
  updateApplicationProcessingAssignAppNumber: Maybe<UpdateApplicationProcessingAssignAppNumberResult>;
  updateApplicationProcessingHolepunchParkingPermit: Maybe<UpdateApplicationProcessingHolepunchParkingPermitResult>;
  updateApplicationProcessingCreateWalletCard: Maybe<UpdateApplicationProcessingCreateWalletCardResult>;
  updateApplicationProcessingReviewRequestInformation: Maybe<UpdateApplicationProcessingReviewRequestInformationResult>;
  updateApplicationProcessingGenerateInvoice: Maybe<UpdateApplicationProcessingGenerateInvoiceResult>;
  updateApplicationProcessingUploadDocuments: Maybe<UpdateApplicationProcessingUploadDocumentsResult>;
  updateApplicationProcessingMailOut: Maybe<UpdateApplicationProcessingMailOutResult>;
  createEmployee: CreateEmployeeResult;
  updateEmployee: UpdateEmployeeResult;
  deleteEmployee: DeleteEmployeeResult;
};


export type MutationUpdateApplicantGeneralInformationArgs = {
  input: UpdateApplicantGeneralInformationInput;
};


export type MutationUpdateApplicantDoctorInformationArgs = {
  input: UpdateApplicantDoctorInformationInput;
};


export type MutationUpdateApplicantGuardianInformationArgs = {
  input: UpdateApplicantGuardianInformationInput;
};


export type MutationSetApplicantAsActiveArgs = {
  input: SetApplicantAsActiveInput;
};


export type MutationSetApplicantAsInactiveArgs = {
  input: SetApplicantAsInactiveInput;
};


export type MutationVerifyIdentityArgs = {
  input: VerifyIdentityInput;
};


export type MutationCreateNewApplicationArgs = {
  input: CreateNewApplicationInput;
};


export type MutationCreateRenewalApplicationArgs = {
  input: CreateRenewalApplicationInput;
};


export type MutationCreateExternalRenewalApplicationArgs = {
  input: CreateExternalRenewalApplicationInput;
};


export type MutationCreateReplacementApplicationArgs = {
  input: CreateReplacementApplicationInput;
};


export type MutationUpdateApplicationGeneralInformationArgs = {
  input: UpdateApplicationGeneralInformationInput;
};


export type MutationUpdateNewApplicationGeneralInformationArgs = {
  input: UpdateNewApplicationGeneralInformationInput;
};


export type MutationUpdateApplicationDoctorInformationArgs = {
  input: UpdateApplicationDoctorInformationInput;
};


export type MutationUpdateApplicationAdditionalInformationArgs = {
  input: UpdateApplicationAdditionalInformationInput;
};


export type MutationUpdateApplicationPaymentInformationArgs = {
  input: UpdateApplicationPaymentInformationInput;
};


export type MutationUpdateApplicationReasonForReplacementArgs = {
  input: UpdateApplicationReasonForReplacementInput;
};


export type MutationUpdateApplicationPhysicianAssessmentArgs = {
  input: UpdateApplicationPhysicianAssessmentInput;
};


export type MutationApproveApplicationArgs = {
  input: ApproveApplicationInput;
};


export type MutationRejectApplicationArgs = {
  input: RejectApplicationInput;
};


export type MutationCompleteApplicationArgs = {
  input: CompleteApplicationInput;
};


export type MutationUpdateApplicationProcessingAssignAppNumberArgs = {
  input: UpdateApplicationProcessingAssignAppNumberInput;
};


export type MutationUpdateApplicationProcessingHolepunchParkingPermitArgs = {
  input: UpdateApplicationProcessingHolepunchParkingPermitInput;
};


export type MutationUpdateApplicationProcessingCreateWalletCardArgs = {
  input: UpdateApplicationProcessingCreateWalletCardInput;
};


export type MutationUpdateApplicationProcessingReviewRequestInformationArgs = {
  input: UpdateApplicationProcessingReviewRequestInformationInput;
};


export type MutationUpdateApplicationProcessingGenerateInvoiceArgs = {
  input: UpdateApplicationProcessingGenerateInvoiceInput;
};


export type MutationUpdateApplicationProcessingUploadDocumentsArgs = {
  input: UpdateApplicationProcessingUploadDocumentsInput;
};


export type MutationUpdateApplicationProcessingMailOutArgs = {
  input: UpdateApplicationProcessingMailOutInput;
};


export type MutationCreateEmployeeArgs = {
  input: CreateEmployeeInput;
};


export type MutationUpdateEmployeeArgs = {
  input: UpdateEmployeeInput;
};


export type MutationDeleteEmployeeArgs = {
  input: DeleteEmployeeInput;
};

export type NewApplication = Application & {
  __typename?: 'NewApplication';
  id: Scalars['Int'];
  firstName: Scalars['String'];
  middleName: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  dateOfBirth: Scalars['Date'];
  gender: Gender;
  otherGender: Maybe<Scalars['String']>;
  phone: Scalars['String'];
  email: Maybe<Scalars['String']>;
  receiveEmailUpdates: Scalars['Boolean'];
  addressLine1: Scalars['String'];
  addressLine2: Maybe<Scalars['String']>;
  city: Scalars['String'];
  province: Province;
  country: Scalars['String'];
  postalCode: Scalars['String'];
  disability: Scalars['String'];
  disabilityCertificationDate: Scalars['Date'];
  patientCondition: PatientCondition;
  mobilityAids: Maybe<Array<MobilityAid>>;
  otherPatientCondition: Maybe<Scalars['String']>;
  permitType: PermitType;
  temporaryPermitExpiry: Maybe<Scalars['Date']>;
  physicianFirstName: Scalars['String'];
  physicianLastName: Scalars['String'];
  physicianMspNumber: Scalars['Int'];
  physicianPhone: Scalars['String'];
  physicianAddressLine1: Scalars['String'];
  physicianAddressLine2: Maybe<Scalars['String']>;
  physicianCity: Scalars['String'];
  physicianProvince: Province;
  physicianCountry: Scalars['String'];
  physicianPostalCode: Scalars['String'];
  guardianFirstName: Maybe<Scalars['String']>;
  guardianMiddleName: Maybe<Scalars['String']>;
  guardianLastName: Maybe<Scalars['String']>;
  guardianPhone: Maybe<Scalars['String']>;
  guardianRelationship: Maybe<Scalars['String']>;
  guardianAddressLine1: Maybe<Scalars['String']>;
  guardianAddressLine2: Maybe<Scalars['String']>;
  guardianCity: Maybe<Scalars['String']>;
  guardianProvince: Maybe<Province>;
  guardianCountry: Maybe<Scalars['String']>;
  guardianPostalCode: Maybe<Scalars['String']>;
  poaFormS3ObjectKey: Maybe<Scalars['String']>;
  usesAccessibleConvertedVan: Scalars['Boolean'];
  accessibleConvertedVanLoadingMethod: Maybe<AccessibleConvertedVanLoadingMethod>;
  requiresWiderParkingSpace: Scalars['Boolean'];
  requiresWiderParkingSpaceReason: Maybe<RequiresWiderParkingSpaceReason>;
  otherRequiresWiderParkingSpaceReason: Maybe<Scalars['String']>;
  paymentMethod: PaymentType;
  processingFee: Scalars['String'];
  donationAmount: Scalars['String'];
  paidThroughShopify: Scalars['Boolean'];
  shopifyPaymentStatus: Maybe<ShopifyPaymentStatus>;
  shopifyConfirmationNumber: Maybe<Scalars['String']>;
  shippingAddressSameAsHomeAddress: Scalars['Boolean'];
  shippingFullName: Scalars['String'];
  shippingAddressLine1: Scalars['String'];
  shippingAddressLine2: Maybe<Scalars['String']>;
  shippingCity: Scalars['String'];
  shippingProvince: Province;
  shippingCountry: Scalars['String'];
  shippingPostalCode: Scalars['String'];
  billingAddressSameAsHomeAddress: Scalars['Boolean'];
  billingFullName: Scalars['String'];
  billingAddressLine1: Scalars['String'];
  billingAddressLine2: Maybe<Scalars['String']>;
  billingCity: Scalars['String'];
  billingProvince: Province;
  billingCountry: Scalars['String'];
  billingPostalCode: Scalars['String'];
  type: ApplicationType;
  processing: ApplicationProcessing;
  applicant: Maybe<Applicant>;
  createdAt: Scalars['Date'];
};

export type PatientCondition =
  | 'AFFECTS_MOBILITY'
  | 'MOBILITY_AID_REQUIRED'
  | 'CANNOT_WALK_100M'
  | 'OTHER';

export type PaymentType =
  | 'MASTERCARD'
  | 'VISA'
  | 'ETRANSFER'
  | 'CASH'
  | 'CHEQUE'
  | 'DEBIT'
  | 'SHOPIFY';

export type Permit = {
  __typename?: 'Permit';
  rcdPermitId: Scalars['Int'];
  type: PermitType;
  expiryDate: Scalars['Date'];
  active: Scalars['Boolean'];
  application: Application;
};

export type PermitHoldersReportColumn =
  | 'USER_ID'
  | 'APPLICANT_NAME'
  | 'APPLICANT_DATE_OF_BIRTH'
  | 'HOME_ADDRESS'
  | 'EMAIL'
  | 'PHONE_NUMBER'
  | 'GUARDIAN_POA_NAME'
  | 'GUARDIAN_POA_RELATION'
  | 'GUARDIAN_POA_ADDRESS'
  | 'RECENT_APP_NUMBER'
  | 'RECENT_APP_TYPE'
  | 'USER_STATUS';

export type PermitStatus =
  | 'ACTIVE'
  | 'EXPIRING'
  | 'EXPIRED';

export type PermitType =
  | 'PERMANENT'
  | 'TEMPORARY';

export type Physician = {
  __typename?: 'Physician';
  mspNumber: Scalars['Int'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  phone: Scalars['String'];
  status: PhysicianStatus;
  addressLine1: Scalars['String'];
  addressLine2: Maybe<Scalars['String']>;
  city: Scalars['String'];
  province: Province;
  country: Scalars['String'];
  postalCode: Scalars['String'];
};

export type PhysicianStatus =
  | 'ACTIVE'
  | 'INACTIVE';

export type Province =
  | 'BC'
  | 'AB'
  | 'SK'
  | 'MB'
  | 'ON'
  | 'QC'
  | 'NS'
  | 'PE'
  | 'NL'
  | 'NB'
  | 'NU'
  | 'NT'
  | 'YT';

export type Query = {
  __typename?: 'Query';
  applicants: Maybe<ApplicantsResult>;
  applicant: Maybe<Applicant>;
  applications: Maybe<ApplicationsResult>;
  application: Maybe<Application>;
  employees: Maybe<EmployeesResult>;
  employee: Maybe<Employee>;
  generateApplicationsReport: Maybe<GenerateApplicationsReportResult>;
  generatePermitHoldersReport: Maybe<GeneratePermitHoldersReportResult>;
  generateAccountantReport: Maybe<GenerateAccountantReportResult>;
};


export type QueryApplicantsArgs = {
  filter: Maybe<ApplicantsFilter>;
};


export type QueryApplicantArgs = {
  id: Scalars['Int'];
};


export type QueryApplicationsArgs = {
  filter: Maybe<ApplicationsFilter>;
};


export type QueryApplicationArgs = {
  id: Scalars['Int'];
};


export type QueryEmployeesArgs = {
  filter: Maybe<EmployeesFilter>;
};


export type QueryEmployeeArgs = {
  id: Scalars['Int'];
};


export type QueryGenerateApplicationsReportArgs = {
  input: GenerateApplicationsReportInput;
};


export type QueryGeneratePermitHoldersReportArgs = {
  input: GeneratePermitHoldersReportInput;
};


export type QueryGenerateAccountantReportArgs = {
  input: GenerateAccountantReportInput;
};

export type ReasonForReplacement =
  | 'LOST'
  | 'STOLEN'
  | 'OTHER';

export type RejectApplicationInput = {
  id: Scalars['Int'];
  reason: Scalars['String'];
};

export type RejectApplicationResult = {
  __typename?: 'RejectApplicationResult';
  ok: Scalars['Boolean'];
};

export type RenewalApplication = Application & {
  __typename?: 'RenewalApplication';
  id: Scalars['Int'];
  firstName: Scalars['String'];
  middleName: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  phone: Scalars['String'];
  email: Maybe<Scalars['String']>;
  receiveEmailUpdates: Scalars['Boolean'];
  addressLine1: Scalars['String'];
  addressLine2: Maybe<Scalars['String']>;
  city: Scalars['String'];
  province: Province;
  country: Scalars['String'];
  postalCode: Scalars['String'];
  permitType: PermitType;
  physicianFirstName: Scalars['String'];
  physicianLastName: Scalars['String'];
  physicianMspNumber: Scalars['Int'];
  physicianPhone: Scalars['String'];
  physicianAddressLine1: Scalars['String'];
  physicianAddressLine2: Maybe<Scalars['String']>;
  physicianCity: Scalars['String'];
  physicianProvince: Province;
  physicianCountry: Scalars['String'];
  physicianPostalCode: Scalars['String'];
  usesAccessibleConvertedVan: Scalars['Boolean'];
  accessibleConvertedVanLoadingMethod: Maybe<AccessibleConvertedVanLoadingMethod>;
  requiresWiderParkingSpace: Scalars['Boolean'];
  requiresWiderParkingSpaceReason: Maybe<RequiresWiderParkingSpaceReason>;
  otherRequiresWiderParkingSpaceReason: Maybe<Scalars['String']>;
  paymentMethod: PaymentType;
  processingFee: Scalars['String'];
  donationAmount: Scalars['String'];
  paidThroughShopify: Scalars['Boolean'];
  shopifyPaymentStatus: Maybe<ShopifyPaymentStatus>;
  shopifyConfirmationNumber: Maybe<Scalars['String']>;
  shippingAddressSameAsHomeAddress: Scalars['Boolean'];
  shippingFullName: Scalars['String'];
  shippingAddressLine1: Scalars['String'];
  shippingAddressLine2: Maybe<Scalars['String']>;
  shippingCity: Scalars['String'];
  shippingProvince: Province;
  shippingCountry: Scalars['String'];
  shippingPostalCode: Scalars['String'];
  billingAddressSameAsHomeAddress: Scalars['Boolean'];
  billingFullName: Scalars['String'];
  billingAddressLine1: Scalars['String'];
  billingAddressLine2: Maybe<Scalars['String']>;
  billingCity: Scalars['String'];
  billingProvince: Province;
  billingCountry: Scalars['String'];
  billingPostalCode: Scalars['String'];
  type: ApplicationType;
  processing: ApplicationProcessing;
  applicant: Applicant;
  createdAt: Scalars['Date'];
};

export type ReplacementApplication = Application & {
  __typename?: 'ReplacementApplication';
  id: Scalars['Int'];
  firstName: Scalars['String'];
  middleName: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  phone: Scalars['String'];
  email: Maybe<Scalars['String']>;
  receiveEmailUpdates: Scalars['Boolean'];
  addressLine1: Scalars['String'];
  addressLine2: Maybe<Scalars['String']>;
  city: Scalars['String'];
  province: Province;
  country: Scalars['String'];
  postalCode: Scalars['String'];
  permitType: PermitType;
  paymentMethod: PaymentType;
  processingFee: Scalars['String'];
  donationAmount: Scalars['String'];
  paidThroughShopify: Scalars['Boolean'];
  shopifyPaymentStatus: Maybe<ShopifyPaymentStatus>;
  shopifyConfirmationNumber: Maybe<Scalars['String']>;
  shippingAddressSameAsHomeAddress: Scalars['Boolean'];
  shippingFullName: Scalars['String'];
  shippingAddressLine1: Scalars['String'];
  shippingAddressLine2: Maybe<Scalars['String']>;
  shippingCity: Scalars['String'];
  shippingProvince: Province;
  shippingCountry: Scalars['String'];
  shippingPostalCode: Scalars['String'];
  billingAddressSameAsHomeAddress: Scalars['Boolean'];
  billingFullName: Scalars['String'];
  billingAddressLine1: Scalars['String'];
  billingAddressLine2: Maybe<Scalars['String']>;
  billingCity: Scalars['String'];
  billingProvince: Province;
  billingCountry: Scalars['String'];
  billingPostalCode: Scalars['String'];
  reason: ReasonForReplacement;
  lostTimestamp: Maybe<Scalars['Date']>;
  lostLocation: Maybe<Scalars['String']>;
  stolenPoliceFileNumber: Maybe<Scalars['Int']>;
  stolenJurisdiction: Maybe<Scalars['String']>;
  stolenPoliceOfficerName: Maybe<Scalars['String']>;
  eventDescription: Maybe<Scalars['String']>;
  type: ApplicationType;
  processing: ApplicationProcessing;
  applicant: Applicant;
  createdAt: Scalars['Date'];
};

export type RequiresWiderParkingSpaceReason =
  | 'HAS_ACCESSIBLE_VAN'
  | 'MEDICAL_REASONS'
  | 'OTHER';

export type Role =
  | 'ADMIN'
  | 'ACCOUNTING'
  | 'SECRETARY';

export type SetApplicantAsActiveInput = {
  id: Scalars['Int'];
};

export type SetApplicantAsActiveResult = {
  __typename?: 'SetApplicantAsActiveResult';
  ok: Scalars['Boolean'];
};

export type SetApplicantAsInactiveInput = {
  id: Scalars['Int'];
  reason: Scalars['String'];
};

export type SetApplicantAsInactiveResult = {
  __typename?: 'SetApplicantAsInactiveResult';
  ok: Scalars['Boolean'];
};

export type ShopifyPaymentStatus =
  | 'PENDING'
  | 'RECEIVED';

export type UpdateApplicantDoctorInformationInput = {
  id: Scalars['Int'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  mspNumber: Scalars['Int'];
  phone: Scalars['String'];
  addressLine1: Scalars['String'];
  addressLine2: Maybe<Scalars['String']>;
  city: Scalars['String'];
  postalCode: Scalars['String'];
};

export type UpdateApplicantDoctorInformationResult = {
  __typename?: 'UpdateApplicantDoctorInformationResult';
  ok: Scalars['Boolean'];
};

export type UpdateApplicantGeneralInformationInput = {
  id: Scalars['Int'];
  firstName: Scalars['String'];
  middleName: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  dateOfBirth: Scalars['Date'];
  gender: Gender;
  phone: Scalars['String'];
  email: Maybe<Scalars['String']>;
  addressLine1: Scalars['String'];
  addressLine2: Maybe<Scalars['String']>;
  city: Scalars['String'];
  postalCode: Scalars['String'];
};

export type UpdateApplicantGeneralInformationResult = {
  __typename?: 'UpdateApplicantGeneralInformationResult';
  ok: Scalars['Boolean'];
};

export type UpdateApplicantGuardianInformationInput = {
  id: Scalars['Int'];
  firstName: Scalars['String'];
  middleName: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  phone: Scalars['String'];
  relationship: Scalars['String'];
  addressLine1: Scalars['String'];
  addressLine2: Maybe<Scalars['String']>;
  city: Scalars['String'];
  postalCode: Scalars['String'];
};

export type UpdateApplicantGuardianInformationResult = {
  __typename?: 'UpdateApplicantGuardianInformationResult';
  ok: Scalars['Boolean'];
};

export type UpdateApplicationAdditionalInformationInput = {
  id: Scalars['Int'];
  usesAccessibleConvertedVan: Scalars['Boolean'];
  accessibleConvertedVanLoadingMethod: Maybe<AccessibleConvertedVanLoadingMethod>;
  requiresWiderParkingSpace: Scalars['Boolean'];
  requiresWiderParkingSpaceReason: Maybe<RequiresWiderParkingSpaceReason>;
  otherRequiresWiderParkingSpaceReason: Maybe<Scalars['String']>;
};

export type UpdateApplicationAdditionalInformationResult = {
  __typename?: 'UpdateApplicationAdditionalInformationResult';
  ok: Scalars['Boolean'];
};

export type UpdateApplicationDoctorInformationInput = {
  id: Scalars['Int'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  mspNumber: Scalars['Int'];
  phone: Scalars['String'];
  addressLine1: Scalars['String'];
  addressLine2: Maybe<Scalars['String']>;
  city: Scalars['String'];
  postalCode: Scalars['String'];
};

export type UpdateApplicationDoctorInformationResult = {
  __typename?: 'UpdateApplicationDoctorInformationResult';
  ok: Scalars['Boolean'];
};

export type UpdateApplicationGeneralInformationInput = {
  id: Scalars['Int'];
  firstName: Scalars['String'];
  middleName: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  phone: Scalars['String'];
  email: Maybe<Scalars['String']>;
  receiveEmailUpdates: Maybe<Scalars['Boolean']>;
  addressLine1: Scalars['String'];
  addressLine2: Maybe<Scalars['String']>;
  city: Scalars['String'];
  postalCode: Scalars['String'];
};

export type UpdateApplicationGeneralInformationResult = {
  __typename?: 'UpdateApplicationGeneralInformationResult';
  ok: Scalars['Boolean'];
};

export type UpdateApplicationPaymentInformationInput = {
  id: Scalars['Int'];
  paymentMethod: PaymentType;
  donationAmount: Maybe<Scalars['String']>;
  shippingAddressSameAsHomeAddress: Scalars['Boolean'];
  shippingFullName: Maybe<Scalars['String']>;
  shippingAddressLine1: Maybe<Scalars['String']>;
  shippingAddressLine2: Maybe<Scalars['String']>;
  shippingCity: Maybe<Scalars['String']>;
  shippingProvince: Maybe<Province>;
  shippingCountry: Maybe<Scalars['String']>;
  shippingPostalCode: Maybe<Scalars['String']>;
  billingAddressSameAsHomeAddress: Scalars['Boolean'];
  billingFullName: Maybe<Scalars['String']>;
  billingAddressLine1: Maybe<Scalars['String']>;
  billingAddressLine2: Maybe<Scalars['String']>;
  billingCity: Maybe<Scalars['String']>;
  billingProvince: Maybe<Province>;
  billingCountry: Maybe<Scalars['String']>;
  billingPostalCode: Maybe<Scalars['String']>;
};

export type UpdateApplicationPaymentInformationResult = {
  __typename?: 'UpdateApplicationPaymentInformationResult';
  ok: Scalars['Boolean'];
};

export type UpdateApplicationPhysicianAssessmentInput = {
  id: Scalars['Int'];
  disability: Scalars['String'];
  disabilityCertificationDate: Scalars['Date'];
  patientCondition: PatientCondition;
  mobilityAids: Maybe<Array<MobilityAid>>;
  otherPatientCondition: Maybe<Scalars['String']>;
  temporaryPermitExpiry: Maybe<Scalars['Date']>;
};

export type UpdateApplicationPhysicianAssessmentResult = {
  __typename?: 'UpdateApplicationPhysicianAssessmentResult';
  ok: Scalars['Boolean'];
};

export type UpdateApplicationProcessingAssignAppNumberInput = {
  applicationId: Scalars['Int'];
  appNumber: Maybe<Scalars['Int']>;
};

export type UpdateApplicationProcessingAssignAppNumberResult = {
  __typename?: 'UpdateApplicationProcessingAssignAppNumberResult';
  ok: Scalars['Boolean'];
};

export type UpdateApplicationProcessingCreateWalletCardInput = {
  applicationId: Scalars['Int'];
  walletCardCreated: Scalars['Boolean'];
};

export type UpdateApplicationProcessingCreateWalletCardResult = {
  __typename?: 'UpdateApplicationProcessingCreateWalletCardResult';
  ok: Scalars['Boolean'];
};

export type UpdateApplicationProcessingGenerateInvoiceInput = {
  applicationId: Scalars['Int'];
};

export type UpdateApplicationProcessingGenerateInvoiceResult = {
  __typename?: 'UpdateApplicationProcessingGenerateInvoiceResult';
  ok: Scalars['Boolean'];
};

export type UpdateApplicationProcessingHolepunchParkingPermitInput = {
  applicationId: Scalars['Int'];
  appHolepunched: Scalars['Boolean'];
};

export type UpdateApplicationProcessingHolepunchParkingPermitResult = {
  __typename?: 'UpdateApplicationProcessingHolepunchParkingPermitResult';
  ok: Scalars['Boolean'];
};

export type UpdateApplicationProcessingMailOutInput = {
  applicationId: Scalars['Int'];
  appMailed: Scalars['Boolean'];
};

export type UpdateApplicationProcessingMailOutResult = {
  __typename?: 'UpdateApplicationProcessingMailOutResult';
  ok: Scalars['Boolean'];
};

export type UpdateApplicationProcessingReviewRequestInformationInput = {
  applicationId: Scalars['Int'];
  reviewRequestCompleted: Scalars['Boolean'];
};

export type UpdateApplicationProcessingReviewRequestInformationResult = {
  __typename?: 'UpdateApplicationProcessingReviewRequestInformationResult';
  ok: Scalars['Boolean'];
};

export type UpdateApplicationProcessingUploadDocumentsInput = {
  applicationId: Scalars['Int'];
  documentsUrl: Maybe<Scalars['String']>;
};

export type UpdateApplicationProcessingUploadDocumentsResult = {
  __typename?: 'UpdateApplicationProcessingUploadDocumentsResult';
  ok: Scalars['Boolean'];
};

export type UpdateApplicationReasonForReplacementInput = {
  id: Scalars['Int'];
  reason: ReasonForReplacement;
  lostTimestamp: Maybe<Scalars['Date']>;
  lostLocation: Maybe<Scalars['String']>;
  stolenPoliceFileNumber: Maybe<Scalars['Int']>;
  stolenJurisdiction: Maybe<Scalars['String']>;
  stolenPoliceOfficerName: Maybe<Scalars['String']>;
  eventDescription: Maybe<Scalars['String']>;
};

export type UpdateApplicationReasonForReplacementResult = {
  __typename?: 'UpdateApplicationReasonForReplacementResult';
  ok: Scalars['Boolean'];
};

export type UpdateEmployeeInput = {
  id: Scalars['Int'];
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

export type UpdateNewApplicationGeneralInformationInput = {
  id: Scalars['Int'];
  firstName: Scalars['String'];
  middleName: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  dateOfBirth: Scalars['Date'];
  gender: Gender;
  otherGender: Maybe<Scalars['String']>;
  phone: Scalars['String'];
  email: Maybe<Scalars['String']>;
  receiveEmailUpdates: Maybe<Scalars['Boolean']>;
  addressLine1: Scalars['String'];
  addressLine2: Maybe<Scalars['String']>;
  city: Scalars['String'];
  postalCode: Scalars['String'];
};

export type UpsertPhysicianInput = {
  mspNumber: Scalars['Int'];
  name: Scalars['String'];
  addressLine1: Scalars['String'];
  addressLine2: Maybe<Scalars['String']>;
  city: Scalars['String'];
  province: Maybe<Province>;
  postalCode: Scalars['String'];
  phone: Scalars['String'];
  status: Maybe<PhysicianStatus>;
  notes: Maybe<Scalars['String']>;
};

export type UpsertPhysicianResult = {
  __typename?: 'UpsertPhysicianResult';
  ok: Scalars['Boolean'];
  physicianId: Scalars['Int'];
};

export type VerifyIdentityFailureReason =
  | 'IDENTITY_VERIFICATION_FAILED'
  | 'APP_DOES_NOT_EXPIRE_WITHIN_30_DAYS'
  | 'USER_HOLDS_TEMPORARY_PERMIT';

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
