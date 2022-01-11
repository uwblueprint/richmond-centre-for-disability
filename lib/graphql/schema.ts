import { gql } from '@apollo/client';

export default gql`
  type Query {
    meta: Meta!
    applicants(filter: ApplicantsFilter): QueryApplicantsResult
    applicant(id: ID!): Applicant
    employees(filter: EmployeesFilter): QueryEmployeesResult
    employee(id: ID!): Employee
    physicians: [Physician!]
    applications(filter: ApplicationsFilter): QueryApplicationsResult
    application(id: ID!): Application
    permits: [Permit!]
    generateApplicationsReport(
      input: GenerateApplicationsReportInput!
    ): GenerateApplicationsReportResult
    generatePermitHoldersReport(
      input: GeneratePermitHoldersReportInput!
    ): GeneratePermitHoldersReportResult
  }

  type Mutation {
    createApplicant(input: CreateApplicantInput!): CreateApplicantResult!
    updateApplicant(input: UpdateApplicantInput!): UpdateApplicantResult!
    createEmployee(input: CreateEmployeeInput!): CreateEmployeeResult!
    updateEmployee(input: UpdateEmployeeInput!): UpdateEmployeeResult!
    deleteEmployee(id: ID!): DeleteEmployeeResult!
    createPhysician(input: CreatePhysicianInput!): CreatePhysicianResult!
    upsertPhysician(input: UpsertPhysicianInput!): UpsertPhysicianResult!
    createNewApplication(input: CreateNewApplicationInput!): CreateNewApplicationResult!
    createRenewalApplication(input: CreateRenewalApplicationInput!): CreateRenewalApplicationResult!
    createReplacementApplication(
      input: CreateReplacementApplicationInput!
    ): CreateReplacementApplicationResult!
    updateApplication(input: UpdateApplicationInput!): UpdateApplicationResult!
    createPermit(input: CreatePermitInput!): CreatePermitResult!
    updateMedicalInformation(input: UpdateMedicalInformationInput!): UpdateMedicalInformationResult!
    updateGuardian(input: UpdateGuardianInput!): UpdateGuardianResult!
    updateApplicationProcessing(
      input: UpdateApplicationProcessingInput!
    ): UpdateApplicationProcessingResult!
    completeApplication(applicationId: ID!): CompleteApplicationResult!
    verifyIdentity(input: VerifyIdentityInput!): VerifyIdentityResult!
  }

  scalar Date

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
    MASTERCARD
    VISA
    ETRANSFER
    CASH
    CHEQUE
    DEBIT
    MONEY_ORDER
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

  # Selectable columns in requests report
  enum RequestsReportColumn {
    USER_ID
    APPLICANT_NAME
    APPLICANT_DATE_OF_BIRTH
    APP_NUMBER
    APPLICATION_DATE
    PAYMENT_METHOD
    FEE_AMOUNT
    DONATION_AMOUNT
    TOTAL_AMOUNT
  }

  # Selectable columns in permit holders report
  enum PermitHoldersReportColumn {
    USER_ID
    APPLICANT_NAME
    APPLICANT_DATE_OF_BIRTH
    HOME_ADDRESS
    EMAIL
    PHONE_NUMBER
    GUARDIAN_POA_NAME
    GUARDIAN_POA_RELATION
    GUARDIAN_POA_ADDRESS
    RECENT_APP_NUMBER
    RECENT_APP_TYPE
    USER_STATUS
  }
`;
