/**
 * Global GraphQL API schema
 */

import { gql } from '@apollo/client';

export default gql`
  type Query {
    # Applicants
    applicants(filter: ApplicantsFilter): ApplicantsResult
    applicant(id: Int!): Applicant

    # Applications
    applications(filter: ApplicationsFilter): ApplicationsResult
    application(id: Int!): Application

    # Employees
    employees(filter: EmployeesFilter): EmployeesResult
    employee(id: Int!): Employee

    # Reports
    generateApplicationsReport(
      input: GenerateApplicationsReportInput!
    ): GenerateApplicationsReportResult
    generatePermitHoldersReport(
      input: GeneratePermitHoldersReportInput!
    ): GeneratePermitHoldersReportResult
    generateAccountantReport(input: GenerateAccountantReportInput!): GenerateAccountantReportResult

    # Physicians
    physicians(filter: PhysiciansFilter): PhysiciansResult
    comparePhysicians(input: ComparePhysiciansInput!): ComparePhysiciansResult
  }

  type Mutation {
    # Applicants
    updateApplicantGeneralInformation(
      input: UpdateApplicantGeneralInformationInput!
    ): UpdateApplicantGeneralInformationResult
    updateApplicantDoctorInformation(
      input: UpdateApplicantDoctorInformationInput!
    ): UpdateApplicantDoctorInformationResult
    updateApplicantGuardianInformation(
      input: UpdateApplicantGuardianInformationInput!
    ): UpdateApplicantGuardianInformationResult
    setApplicantAsActive(input: SetApplicantAsActiveInput!): SetApplicantAsActiveResult
    setApplicantAsInactive(input: SetApplicantAsInactiveInput!): SetApplicantAsInactiveResult
    verifyIdentity(input: VerifyIdentityInput!): VerifyIdentityResult!
    updateApplicantNotes(input: UpdateApplicantNotesInput!): UpdateApplicantNotesResult!
    deleteApplicant(input: DeleteApplicantInput!): DeleteApplicantResult!

    # Applications
    createNewApplication(input: CreateNewApplicationInput!): CreateNewApplicationResult
    createRenewalApplication(input: CreateRenewalApplicationInput!): CreateRenewalApplicationResult
    createExternalRenewalApplication(
      input: CreateExternalRenewalApplicationInput!
    ): CreateExternalRenewalApplicationResult!
    createReplacementApplication(
      input: CreateReplacementApplicationInput!
    ): CreateReplacementApplicationResult
    updateApplicationGeneralInformation(
      input: UpdateApplicationGeneralInformationInput!
    ): UpdateApplicationGeneralInformationResult
    updateNewApplicationGeneralInformation(
      input: UpdateNewApplicationGeneralInformationInput!
    ): UpdateApplicationGeneralInformationResult
    updateApplicationDoctorInformation(
      input: UpdateApplicationDoctorInformationInput!
    ): UpdateApplicationDoctorInformationResult
    updateApplicationGuardianInformation(
      input: UpdateApplicationGuardianInformationInput!
    ): UpdateApplicationGuardianInformationResult
    updateApplicationAdditionalInformation(
      input: UpdateApplicationAdditionalInformationInput!
    ): UpdateApplicationAdditionalInformationResult
    updateApplicationPaymentInformation(
      input: UpdateApplicationPaymentInformationInput!
    ): UpdateApplicationPaymentInformationResult
    updateApplicationReasonForReplacement(
      input: UpdateApplicationReasonForReplacementInput!
    ): UpdateApplicationReasonForReplacementResult
    updateApplicationPhysicianAssessment(
      input: UpdateApplicationPhysicianAssessmentInput!
    ): UpdateApplicationPhysicianAssessmentResult
    deleteApplication(input: DeleteApplicationInput!): DeleteApplicationResult!

    # Application processing
    approveApplication(input: ApproveApplicationInput!): ApproveApplicationResult
    rejectApplication(input: RejectApplicationInput!): RejectApplicationResult
    completeApplication(input: CompleteApplicationInput!): CompleteApplicationResult
    updateApplicationProcessingAssignAppNumber(
      input: UpdateApplicationProcessingAssignAppNumberInput!
    ): UpdateApplicationProcessingAssignAppNumberResult
    updateApplicationProcessingHolepunchParkingPermit(
      input: UpdateApplicationProcessingHolepunchParkingPermitInput!
    ): UpdateApplicationProcessingHolepunchParkingPermitResult
    updateApplicationProcessingCreateWalletCard(
      input: UpdateApplicationProcessingCreateWalletCardInput!
    ): UpdateApplicationProcessingCreateWalletCardResult
    updateApplicationProcessingReviewRequestInformation(
      input: UpdateApplicationProcessingReviewRequestInformationInput!
    ): UpdateApplicationProcessingReviewRequestInformationResult
    updateApplicationProcessingGenerateInvoice(
      input: UpdateApplicationProcessingGenerateInvoiceInput!
    ): UpdateApplicationProcessingGenerateInvoiceResult
    updateApplicationProcessingUploadDocuments(
      input: UpdateApplicationProcessingUploadDocumentsInput!
    ): UpdateApplicationProcessingUploadDocumentsResult
    updateApplicationProcessingMailOut(
      input: UpdateApplicationProcessingMailOutInput!
    ): UpdateApplicationProcessingMailOutResult
    updateApplicationProcessingRefundPayment(
      input: UpdateApplicationProcessingRefundPaymentInput!
    ): UpdateApplicationProcessingRefundPaymentResult

    # Employees
    createEmployee(input: CreateEmployeeInput!): CreateEmployeeResult!
    updateEmployee(input: UpdateEmployeeInput!): UpdateEmployeeResult!
    deleteEmployee(input: DeleteEmployeeInput!): DeleteEmployeeResult!
    setEmployeeAsActive(input: SetEmployeeAsActiveInput!): SetEmployeeAsActiveResult!
  }

  # Scalars

  scalar Date

  # Enums

  enum Role {
    ADMIN
    ACCOUNTING
    SECRETARY
  }

  enum Province {
    BC
    AB
    SK
    MB
    ON
    QC
    NS
    PE
    NL
    NB
    NU
    NT
    YT
  }

  enum PaymentType {
    AMEX
    MASTERCARD
    VISA
    ETRANSFER
    CASH
    CHEQUE
    DEBIT
    SHOPIFY
  }

  enum ApplicantStatus {
    ACTIVE
    INACTIVE
  }

  enum MobilityAid {
    CANE
    ELECTRIC_CHAIR
    MANUAL_CHAIR
    SCOOTER
    WALKER
    CRUTCHES
    OTHERS
  }

  enum PhysicianStatus {
    ACTIVE
    INACTIVE
  }

  enum Gender {
    MALE
    FEMALE
    OTHER
  }

  enum ApplicationStatus {
    PENDING
    IN_PROGRESS
    REJECTED
    COMPLETED
  }

  enum ReasonForReplacement {
    LOST
    STOLEN
    MAIL_LOST
    OTHER
  }

  enum PermitType {
    PERMANENT
    TEMPORARY
  }

  enum PatientCondition {
    AFFECTS_MOBILITY
    MOBILITY_AID_REQUIRED
    CANNOT_WALK_100M
    OTHER
  }

  enum ApplicationType {
    NEW
    RENEWAL
    REPLACEMENT
  }

  enum AccessibleConvertedVanLoadingMethod {
    SIDE_LOADING
    END_LOADING
  }

  enum RequiresWiderParkingSpaceReason {
    HAS_ACCESSIBLE_VAN
    MEDICAL_REASONS
    OTHER
  }

  enum ShopifyPaymentStatus {
    PENDING
    RECEIVED
  }
`;
