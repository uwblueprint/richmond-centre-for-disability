// TODO: `guardian` should be optional in `CreateApplicantInput`
export default `
  type Applicant {
    id: ID!
    firstName: String!
    middleName: String
    lastName: String!
    dateOfBirth: Date!
    gender: Gender!
    customGender: String
    email: String
    phone: String!
    province: Province!
    city: String!
    addressLine1: String!
    addressLine2: String
    postalCode: String!
    rcdUserId: Int
    acceptedTos: Date
    status: ApplicantStatus
    inactiveReason: String
    activePermit: Permit
    applications: [Application!]
    guardianId: Int
    guardian: Guardian
    medicalInformationId: Int!
    medicalInformation: MedicalInformation!
    permits: [Permit!]!
    medicalHistory: [MedicalHistory!]
    mostRecentPermit: Permit!
    mostRecentRenewal: Application
    mostRecentApplication: Application
    fileHistory: [ApplicationFileAttachments!]!
  }

  input CreateApplicantInput {
    firstName: String!
    middleName: String
    lastName: String!
    dateOfBirth: Date!
    gender: Gender!
    customGender: String
    email: String
    phone: String!
    province: Province!
    city: String!
    addressLine1: String!
    addressLine2: String
    postalCode: String!
    rcdUserId: Int
    acceptedTos: Date
    medicalInformation: CreateMedicalInformationInput!
    guardian: CreateGuardianInput!
  }

  type CreateApplicantResult {
    ok: Boolean!
  }

  type MedicalHistory {
    applicationId: ID!
    physician: Physician!
  }

  input UpdateApplicantInput {
    id: ID!
    firstName: String
    middleName: String
    lastName: String
    dateOfBirth: Date
    gender: Gender
    customGender: String
    email: String
    phone: String
    province: Province
    city: String
    addressLine1: String
    addressLine2: String
    postalCode: String
    inactiveReason: String
    rcdUserId: Int
  }

  type UpdateApplicantResult {
    ok: Boolean!
  }

  input ApplicantsFilter {
    order: [[String!]!]
    permitStatus: PermitStatus
    userStatus: UserStatus
    expiryDateRangeFrom: Date
    expiryDateRangeTo: Date
    search: String
    limit: Int
    offset: Int
  }

  type QueryApplicantsResult {
    result: [Applicant!]!
    totalCount: Int!
  }

  input VerifyIdentityInput {
    userId: Int!
    phoneNumberSuffix: String!
    dateOfBirth: Date!
    acceptedTos: Date!
  }

  type VerifyIdentityResult {
    ok: Boolean!
    failureReason: VerifyIdentityFailureReason
    applicantId: Int
  }

  enum VerifyIdentityFailureReason {
    IDENTITY_VERIFICATION_FAILED
    APP_DOES_NOT_EXPIRE_WITHIN_30_DAYS
  }
`;
