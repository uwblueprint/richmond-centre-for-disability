export default `
  type Application {
    # Applicant information
    id: ID!
    firstName: String!
    middleName: String!
    lastName: String!
    dateOfBirth: Date!
    gender: Gender!
    customGender: String
    email: String
    phone: String!
    city: String!
    addressLine1: String!
    addressLine2: String
    postalCode: String!
    rcdUserId: Int
    isRenewal: Boolean!
    receiveEmailUpdates: Boolean!
    applicantId: Int
    applicant: Applicant

    # Medical information
    disability: String!
    certificationDate: Date!
    patientEligibility: Eligibility!
    description: String
    expiryDate: Date
    permitType: PermitType!

    #Physician Information
    physicianName: String!
    physicianMspNumber: Int!
    physicianPhone: String!
    physicianAddressLine1: String!
    physicianAddressLine2: String
    physicianCity: String!
    physicianPostalCode: String!
    physicianNotes: String

    #Guardian
    guardianFirstName: String
    guardianMiddleName: String
    guardianLastName: String
    guardianPhone: String
    guardianRelationship: String
    guardianAddressLine1: String
    guardianAddressLine2: String
    guardianCity: String
    guardianPostalCode: String
    poaFormUrl: String
    guardianNotes: String

    #Additional Information
    usesAccessibleConvertedVan: Boolean!
    requiresWiderParkingSpace: Boolean!

    #Payment Information
    processingFee: Float!
    donationAmount: Float
    paymentMethod: PaymentType!
    shopifyConfirmationNumber: String!
    shippingFullName: String
    shippingAddressLine1: String
    shippingAddressLine2: String
    shippingCity: String
    shippingProvince: Province
    # shippingCountry: String
    shippingPostalCode: String
    billingFullName: String
    billingAddressLine1: String
    billingAddressLine2: String
    billingCity: String
    billingProvince: Province
    # billingCountry: String
    billingPostalCode: String
    shippingAddressSameAsHomeAddress: Boolean!
    billingAddressSameAsHomeAddress: Boolean!

    # Permit
    permit: Permit

    # Application Processing
    applicationProcessing: ApplicationProcessing

    # Replacement
    replacement: Replacement

    # Renewal
    renewal: Renewal

    # Misc
    createdAt: Date!
  }

  input CreateApplicationInput {
    # Applicant information
    firstName: String!
    middleName: String!
    lastName: String!
    dateOfBirth: Date!
    gender: Gender!
    customGender: String
    email: String
    phone: String!
    city: String!
    addressLine1: String!
    addressLine2: String
    postalCode: String!
    rcdUserId: Int
    isRenewal: Boolean!
    receiveEmailUpdates: Boolean!
    applicantId: Int

    # Medical information
    disability: String!
    certificationDate: Date!
    patientEligibility: Eligibility!
    description: String
    expiryDate: Date
    permitType: PermitType!

    #Physician Information
    physicianName: String!
    physicianMspNumber: Int!
    physicianPhone: String!
    physicianAddressLine1: String!
    physicianAddressLine2: String
    physicianCity: String!
    physicianPostalCode: String!
    physicianNotes: String

    #Guardian
    guardianFirstName: String
    guardianMiddleName: String
    guardianLastName: String
    guardianPhone: String
    guardianRelationship: String
    guardianAddressLine1: String
    guardianAddressLine2: String
    guardianCity: String
    guardianPostalCode: String
    poaFormUrl: String
    guardianNotes: String

    #Additional Information
    usesAccessibleConvertedVan: Boolean!
    requiresWiderParkingSpace: Boolean!

    #Payment Information
    processingFee: Float!
    donationAmount: Float
    paymentMethod: PaymentType!
    shopifyConfirmationNumber: String!
    shippingFullName: String
    shippingAddressLine1: String
    shippingAddressLine2: String
    shippingCity: String
    shippingProvince: Province
    # shippingCountry: String
    shippingPostalCode: String
    billingFullName: String
    billingAddressLine1: String
    billingAddressLine2: String
    billingCity: String
    billingProvince: Province
    # billingCountry: String
    billingPostalCode: String
    shippingAddressSameAsHomeAddress: Boolean
    billingAddressSameAsHomeAddress: Boolean
  }

  type CreateApplicationResult {
    ok: Boolean!
  }

  input ApplicationsFilter {
    order: [[String!]]
    permitType: PermitType
    requestType: String
    status: ApplicationStatus
    search: String
    limit: Int
    offset: Int
  }

  type QueryApplicationsResult {
    result: [Application!]!
    totalCount: Int!
  }

  input UpdateApplicationInput {
    id: ID!

    # Applicant information
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
    notes: String
    rcdUserId: Int
    isRenewal: Boolean
    receiveEmailUpdates: Boolean
    poaFormUrl: String
    applicantId: Int

    # Medical information
    disability: String
    affectsMobility: Boolean
    mobilityAidRequired: Boolean
    cannotWalk100m: Boolean
    # NOTE: Might need to change this to accept a single Aid object, and push to the aid array
    aid: [Aid!]

    #Physician Information
    physicianName: String
    physicianMspNumber: Int
    physicianAddressLine1: String
    physicianAddressLine2: String
    physicianCity: String
    physicianProvince: Province
    physicianPostalCode: String
    physicianPhone: String
    physicianNotes: String

    # Payment Information
    shippingFullName: String
    shippingAddressLine1: String
    shippingAddressLine2: String
    shippingCity: String
    shippingProvince: Province
    # shippingCountry: String
    shippingPostalCode: String
    billingFullName: String
    billingAddressLine1: String
    billingAddressLine2: String
    billingCity: String
    billingProvince: Province
    # billingCountry: String
    billingPostalCode: String
    shippingAddressSameAsHomeAddress: Boolean
    billingAddressSameAsHomeAddress: Boolean
    processingFee: Float
    donationAmount: Float
    paymentMethod: PaymentType
    shopifyConfirmationNumber: String

    # Guardian
    guardianFirstName: String
    guardianMiddleName: String
    guardianLastName: String
    guardianPhone: String
    guardianProvince: Province
    guardianCity: String
    guardianAddressLine1: String
    guardianAddressLine2: String
    guardianPostalCode: String
    guardianRelationship: String
    guardianNotes: String
  }

  type UpdateApplicationResult {
    ok: Boolean!
  }

  input CreateRenewalApplicationInput {
    applicantId: Int!
    updatedAddress: Boolean!
    updatedContactInfo: Boolean!
    updatedPhysician: Boolean!
    usesAccessibleConvertedVan: Boolean!
    requiresWiderParkingSpace: Boolean!
    rcdUserId: Int
    receiveEmailUpdates: Boolean!

    # Personal address info (must be provided if updatedAddress === true)
    firstName: String
    lastName: String
    addressLine1: String
    addressLine2: String
    city: String
    postalCode: String

    # Contact info (at least one must be provided if updatedContactInfo === true)
    phone: String
    email: String

    # Doctor info (must be provided if updatedDoctor === true)
    physicianName: String
    physicianMspNumber: Int
    physicianAddressLine1: String
    physicianAddressLine2: String
    physicianCity: String
    physicianPostalCode: String
    physicianPhone: String

    # Payment information
    shippingFullName: String
    shippingAddressLine1: String
    shippingAddressLine2: String
    shippingCity: String
    shippingProvince: Province
    shippingPostalCode: String

    billingFullName: String
    billingAddressLine1: String
    billingAddressLine2: String
    billingCity: String
    billingProvince: Province
    billingPostalCode: String
    shippingAddressSameAsHomeAddress: Boolean
    billingAddressSameAsHomeAddress: Boolean
    donationAmount: Float
    paymentMethod: PaymentType
  }

  type CreateRenewalApplicationResult {
    ok: Boolean!
    applicationId: Int
  }

  input CreateReplacementApplicationInput {
    applicantId: Int!

    # Permit Holder Information
    firstName: String!
    lastName: String!
    phone: String!
    email: String
    addressLine1: String!
    addressLine2: String
    city: String!
    postalCode: String!

    # Replacement Information
    reason: ReasonForReplacement!
    lostTimestamp: Date
    lostLocation: String
    description: String

    # Payment Information
    paymentMethod: PaymentType!
    donationAmount: Float
    shippingAddressSameAsHomeAddress: Boolean!
    shippingFullName: String
    shippingAddressLine1: String
    shippingAddressLine2: String
    shippingCity: String
    shippingProvince: Province
    shippingPostalCode: String
    billingAddressSameAsHomeAddress: Boolean!
    billingFullName: String
    billingAddressLine1: String
    billingAddressLine2: String
    billingCity: String
    billingProvince: Province
    billingPostalCode: String
  }

  type CreateReplacementApplicationResult {
    ok: Boolean!
    applicationId: Int!
  }

  input GenerateApplicationsReportInput {
    startDate: Date!
    endDate: Date!
    columns: [ApplicationsReportColumn!]!
  }

  # TODO: Return link to AWS S3 file
  type GenerateApplicationsReportResult {
    ok: Boolean!
  }
`;
