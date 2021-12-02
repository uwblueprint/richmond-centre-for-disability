export default `
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
    generateApplicantsReport(input: GenerateApplicantsReportInput!): GenerateApplicantsReportResult
  }

  type Mutation {
    createApplicant(input: CreateApplicantInput!): CreateApplicantResult!
    updateApplicant(input: UpdateApplicantInput!): UpdateApplicantResult!
    createEmployee(input: CreateEmployeeInput!): CreateEmployeeResult!
    updateEmployee(input: UpdateEmployeeInput!): UpdateEmployeeResult!
    deleteEmployee(id: ID!): DeleteEmployeeResult!
    createPhysician(input: CreatePhysicianInput!): CreatePhysicianResult!
    upsertPhysician(input: UpsertPhysicianInput!): UpsertPhysicianResult!
    createApplication(input: CreateApplicationInput!): CreateApplicationResult!
    createRenewalApplication(input: CreateRenewalApplicationInput!): CreateRenewalApplicationResult!
    createReplacementApplication(input: CreateReplacementApplicationInput!): CreateReplacementApplicationResult!
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

  enum Aid {
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
    APPROVED
    REJECTED
    COMPLETED
  }

  enum ReasonForReplacement {
    LOST
    STOLEN
    OTHER
  }

  enum PermitStatus {
    VALID
    EXPIRED
    EXPIRING_IN_THIRTY_DAYS
  }

  enum UserStatus {
    ACTIVE
    INACTIVE
  }

  enum PermitType {
    PERMANENT
    TEMPORARY
  }

  enum ApplicationsReportColumn {
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
`;
