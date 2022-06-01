/**
 * GraphQL schema for applicants
 */

import { gql } from '@apollo/client';

export default gql`
  type Applicant {
    id: Int!

    # Personal
    firstName: String!
    middleName: String
    lastName: String!
    dateOfBirth: Date!
    gender: Gender!
    otherGender: String

    # Contact
    phone: String!
    email: String
    receiveEmailUpdates: Boolean!

    # Address
    addressLine1: String!
    addressLine2: String
    city: String!
    province: Province!
    country: String!
    postalCode: String!

    status: ApplicantStatus!
    inactiveReason: String

    mostRecentPermit: Permit
    activePermit: Permit
    permits: [Permit!]!
    mostRecentApplication: Application
    completedApplications: [Application!]!
    guardian: Guardian
    medicalInformation: MedicalInformation!
  }

  # Update applicant general information
  input UpdateApplicantGeneralInformationInput {
    # Applicant ID
    id: Int!

    # Personal
    firstName: String!
    middleName: String
    lastName: String!
    dateOfBirth: Date!
    gender: Gender!
    otherGender: String

    # Contact
    phone: String!
    email: String
    receiveEmailUpdates: Boolean!

    # Address (omit Province, Country)
    addressLine1: String!
    addressLine2: String
    city: String!
    postalCode: String!
  }

  type UpdateApplicantGeneralInformationResult {
    ok: Boolean!
    error: String
  }

  # Update applicant doctor information
  input UpdateApplicantDoctorInformationInput {
    # Applicant ID
    id: Int!

    # Personal
    firstName: String!
    lastName: String!
    mspNumber: String!
    phone: String!

    # Address
    addressLine1: String!
    addressLine2: String
    city: String!
    postalCode: String!
  }

  type UpdateApplicantDoctorInformationResult {
    ok: Boolean!
    error: String
  }

  # Update applicant guardian information
  input UpdateApplicantGuardianInformationInput {
    # Applicant ID
    id: Int!

    # Personal
    firstName: String!
    middleName: String
    lastName: String!
    phone: String!
    relationship: String!

    # Address (omit Province, Country)
    addressLine1: String!
    addressLine2: String
    city: String!
    postalCode: String!

    # POA form
    poaFormS3ObjectKey: String

    omitGuardianPoa: Boolean
  }

  type UpdateApplicantGuardianInformationResult {
    ok: Boolean!
  }

  # Set applicant as active
  input SetApplicantAsActiveInput {
    # Applicant ID
    id: Int!
  }

  type SetApplicantAsActiveResult {
    ok: Boolean!
  }

  # Set applicant as inactive
  input SetApplicantAsInactiveInput {
    # Applicant ID
    id: Int!

    reason: String!
  }

  type SetApplicantAsInactiveResult {
    ok: Boolean!
  }

  # Query many applicants
  input ApplicantsFilter {
    order: [[String!]!]
    permitStatus: PermitStatus
    userStatus: ApplicantStatus
    expiryDateRangeFrom: Date
    expiryDateRangeTo: Date
    search: String
    limit: Int
    offset: Int
  }

  type ApplicantsResult {
    result: [Applicant!]!
    totalCount: Int!
  }

  # Permit status enum for filtering applicants
  enum PermitStatus {
    ACTIVE
    EXPIRING
    EXPIRED
  }

  # ID verification for external applications
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

  # Reason for ID verification failure
  enum VerifyIdentityFailureReason {
    IDENTITY_VERIFICATION_FAILED
    APP_DOES_NOT_EXPIRE_WITHIN_30_DAYS
    USER_HOLDS_TEMPORARY_PERMIT
  }

  # Update Additional Notes for Applicant
  input UpdateApplicantNotesInput {
    id: Int!
    notes: String!
  }

  type UpdateApplicantNotesResult {
    ok: Boolean!
  }
`;
