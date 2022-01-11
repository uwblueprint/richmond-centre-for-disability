import { gql } from '@apollo/client';

// TODO: `guardian` should be optional in `CreateApplicantInput`
export default gql`
  # Applicant type
  type Applicant {
    id: ID!
    firstName: String!
    middleName: String
    lastName: String!
    dateOfBirth: Date!
    gender: Gender!
    otherGender: String
    phone: String!
    email: String
    receiveEmailUpdates: Boolean!
    addressLine1: String!
    addressLine2: String
    city: String!
    province: Province!
    country: String!
    postalCode: String!
    rcdUserId: Int
    status: ApplicantStatus!
    guardian: Guardian
    medicalInformation: MedicalInformation!
    # TODO: Medical history
    # TODO: File history
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

  input GeneratePermitHoldersReportInput {
    startDate: Date!
    endDate: Date!
    columns: [PermitHoldersReportColumn!]!
  }

  # TODO: Return link to AWS S3 file
  type GeneratePermitHoldersReportResult {
    ok: Boolean!
  }

  # Reason for ID verification failure
  enum VerifyIdentityFailureReason {
    IDENTITY_VERIFICATION_FAILED
    APP_DOES_NOT_EXPIRE_WITHIN_30_DAYS
  }
`;
