/**
 * GraphQL schema for applicants
 */

import { gql } from '@apollo/client';

export default gql`
  type Applicant {
    id: ID!

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

    rcdUserId: Int
    status: ApplicantStatus!

    guardian: Guardian
    medicalInformation: MedicalInformation!
    # TODO: Medical history
    # TODO: File history
  }

  # Update applicant general information
  input UpdateApplicantGeneralInformationInput {
    # Applicant ID
    id: ID!

    # Personal
    firstName: String!
    middleName: String
    lastName: String!
    dateOfBirth: Date!
    gender: Gender!

    # Contact
    phone: String!
    email: String

    # Address (omit Province, Country)
    addressLine1: String!
    addressLine2: String
    city: String!
    postalCode: String!
  }

  type UpdateApplicantGeneralInformationResult {
    ok: Boolean!
  }

  # Update applicant doctor information
  input UpdateApplicantDoctorInformationInput {
    # Applicant ID
    id: ID!

    # Personal
    firstName: String!
    lastName: String!
    mspNumber: Int!
    phone: String!

    # Address
    addressLine1: String!
    addressLine2: String
    city: String!
    postalCode: String!
  }

  type UpdateApplicantDoctorInformationResult {
    ok: Boolean!
  }

  # Update applicant guardian information
  input UpdateApplicantGuardianInformationInput {
    # Applicant ID
    id: ID!

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
  }

  type UpdateApplicantGuardianInformationResult {
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
    EXPIRING_SOON
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
  }
`;
