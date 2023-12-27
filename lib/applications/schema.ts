/**
 * GraphQL schema for applications
 */

import { gql } from '@apollo/client';

export default gql`
  # Application interface
  interface Application {
    id: Int!

    # Personal information
    firstName: String!
    middleName: String
    lastName: String!

    # Contact information
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

    # Physician assessment
    permitType: PermitType!

    # Payment information
    paymentMethod: PaymentType!
    processingFee: String! # Return monetary value as string
    donationAmount: String! # Return monetary value as string
    paymentMethod2: PaymentType
    processingFee2: String # Return monetary value as string
    donationAmount2: String # Return monetary value as string
    hasSecondPaymentMethod: Boolean!
    paidThroughShopify: Boolean!
    shopifyPaymentStatus: ShopifyPaymentStatus
    shopifyConfirmationNumber: String
    shopifyOrderNumber: String

    # Shipping information
    shippingAddressSameAsHomeAddress: Boolean!
    shippingFullName: String!
    shippingAddressLine1: String!
    shippingAddressLine2: String
    shippingCity: String!
    shippingProvince: Province!
    shippingCountry: String!
    shippingPostalCode: String!

    # Billing information
    billingAddressSameAsHomeAddress: Boolean!
    billingFullName: String!
    billingAddressLine1: String!
    billingAddressLine2: String
    billingCity: String!
    billingProvince: Province!
    billingCountry: String!
    billingPostalCode: String!

    type: ApplicationType!

    processing: ApplicationProcessing!
    applicant: Applicant
    permit: Permit

    createdAt: Date!
  }

  type NewApplication implements Application {
    id: Int!

    # Personal information
    firstName: String!
    middleName: String
    lastName: String!
    dateOfBirth: Date!
    gender: Gender!
    otherGender: String

    # Contact information
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

    # Physician assessment
    disability: String!
    disabilityCertificationDate: Date!
    patientCondition: [PatientCondition!]
    mobilityAids: [MobilityAid!]
    otherPatientCondition: String
    permitType: PermitType!
    temporaryPermitExpiry: Date
    otherMobilityAids: String

    # Doctor information
    physicianFirstName: String!
    physicianLastName: String!
    physicianMspNumber: String!
    physicianPhone: String!
    physicianAddressLine1: String!
    physicianAddressLine2: String
    physicianCity: String!
    physicianProvince: Province!
    physicianCountry: String!
    physicianPostalCode: String!

    # Guardian information
    guardianFirstName: String
    guardianMiddleName: String
    guardianLastName: String
    guardianPhone: String
    guardianRelationship: String
    guardianAddressLine1: String
    guardianAddressLine2: String
    guardianCity: String
    guardianProvince: Province
    guardianCountry: String
    guardianPostalCode: String
    poaFormS3ObjectKey: String
    poaFormS3ObjectUrl: String

    # Additional information
    usesAccessibleConvertedVan: Boolean!
    accessibleConvertedVanLoadingMethod: AccessibleConvertedVanLoadingMethod
    requiresWiderParkingSpace: Boolean!
    requiresWiderParkingSpaceReason: RequiresWiderParkingSpaceReason
    otherRequiresWiderParkingSpaceReason: String

    # Payment information
    paymentMethod: PaymentType!
    processingFee: String! # Return monetary value as string
    donationAmount: String! # Return monetary value as string
    paymentMethod2: PaymentType
    processingFee2: String # Return monetary value as string
    donationAmount2: String # Return monetary value as string
    hasSecondPaymentMethod: Boolean!
    paidThroughShopify: Boolean!
    shopifyPaymentStatus: ShopifyPaymentStatus
    shopifyConfirmationNumber: String
    shopifyOrderNumber: String

    # Shipping information
    shippingAddressSameAsHomeAddress: Boolean!
    shippingFullName: String!
    shippingAddressLine1: String!
    shippingAddressLine2: String
    shippingCity: String!
    shippingProvince: Province!
    shippingCountry: String!
    shippingPostalCode: String!

    # Billing information
    billingAddressSameAsHomeAddress: Boolean!
    billingFullName: String!
    billingAddressLine1: String!
    billingAddressLine2: String
    billingCity: String!
    billingProvince: Province!
    billingCountry: String!
    billingPostalCode: String!

    type: ApplicationType!

    processing: ApplicationProcessing!
    applicant: Applicant
    permit: Permit

    createdAt: Date!
  }

  type RenewalApplication implements Application {
    id: Int!

    # Personal information
    firstName: String!
    middleName: String
    lastName: String!

    # Contact information
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

    # Physician assessment
    permitType: PermitType!

    # Doctor information
    physicianFirstName: String!
    physicianLastName: String!
    physicianMspNumber: String!
    physicianPhone: String!
    physicianAddressLine1: String!
    physicianAddressLine2: String
    physicianCity: String!
    physicianProvince: Province!
    physicianCountry: String!
    physicianPostalCode: String!

    # Additional information
    usesAccessibleConvertedVan: Boolean!
    accessibleConvertedVanLoadingMethod: AccessibleConvertedVanLoadingMethod
    requiresWiderParkingSpace: Boolean!
    requiresWiderParkingSpaceReason: RequiresWiderParkingSpaceReason
    otherRequiresWiderParkingSpaceReason: String

    # Payment information
    paymentMethod: PaymentType!
    processingFee: String! # Return monetary value as string
    donationAmount: String! # Return monetary value as string
    paymentMethod2: PaymentType
    processingFee2: String # Return monetary value as string
    donationAmount2: String # Return monetary value as string
    hasSecondPaymentMethod: Boolean!
    paidThroughShopify: Boolean!
    shopifyPaymentStatus: ShopifyPaymentStatus
    shopifyConfirmationNumber: String
    shopifyOrderNumber: String

    # Shipping information
    shippingAddressSameAsHomeAddress: Boolean!
    shippingFullName: String!
    shippingAddressLine1: String!
    shippingAddressLine2: String
    shippingCity: String!
    shippingProvince: Province!
    shippingCountry: String!
    shippingPostalCode: String!

    # Billing information
    billingAddressSameAsHomeAddress: Boolean!
    billingFullName: String!
    billingAddressLine1: String!
    billingAddressLine2: String
    billingCity: String!
    billingProvince: Province!
    billingCountry: String!
    billingPostalCode: String!

    type: ApplicationType!

    processing: ApplicationProcessing!
    applicant: Applicant!
    permit: Permit

    createdAt: Date!
  }

  type ReplacementApplication implements Application {
    id: Int!

    # Personal information
    firstName: String!
    middleName: String
    lastName: String!

    # Contact information
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

    # Physician assessment
    permitType: PermitType!

    # Payment information
    paymentMethod: PaymentType!
    processingFee: String! # Return monetary value as string
    donationAmount: String! # Return monetary value as string
    paymentMethod2: PaymentType
    processingFee2: String # Return monetary value as string
    donationAmount2: String # Return monetary value as string
    hasSecondPaymentMethod: Boolean!
    paidThroughShopify: Boolean!
    shopifyPaymentStatus: ShopifyPaymentStatus
    shopifyConfirmationNumber: String
    shopifyOrderNumber: String

    # Shipping information
    shippingAddressSameAsHomeAddress: Boolean!
    shippingFullName: String!
    shippingAddressLine1: String!
    shippingAddressLine2: String
    shippingCity: String!
    shippingProvince: Province!
    shippingCountry: String!
    shippingPostalCode: String!

    # Billing information
    billingAddressSameAsHomeAddress: Boolean!
    billingFullName: String!
    billingAddressLine1: String!
    billingAddressLine2: String
    billingCity: String!
    billingProvince: Province!
    billingCountry: String!
    billingPostalCode: String!

    # Reason for replacement
    reason: ReasonForReplacement!
    lostTimestamp: Date
    lostLocation: String
    stolenPoliceFileNumber: Int
    stolenJurisdiction: String
    stolenPoliceOfficerName: String
    eventDescription: String

    type: ApplicationType!

    processing: ApplicationProcessing!
    applicant: Applicant!
    permit: Permit

    createdAt: Date!
  }

  input CreateNewApplicationInput {
    # Personal information
    firstName: String!
    middleName: String
    lastName: String!
    dateOfBirth: Date!
    gender: Gender!
    otherGender: String

    # Contact information
    phone: String!
    email: String
    receiveEmailUpdates: Boolean!

    # Address
    addressLine1: String!
    addressLine2: String
    city: String!
    postalCode: String!

    # Physician assessment
    disability: String!
    disabilityCertificationDate: Date!
    patientCondition: [PatientCondition!]
    mobilityAids: [MobilityAid!]
    otherMobilityAids: String
    otherPatientCondition: String
    permitType: PermitType!
    temporaryPermitExpiry: Date

    # Doctor information
    physicianFirstName: String!
    physicianLastName: String!
    physicianMspNumber: String!
    physicianPhone: String!
    physicianAddressLine1: String!
    physicianAddressLine2: String
    physicianCity: String!
    physicianPostalCode: String!

    # Guardian information
    omitGuardianPoa: Boolean! # Option to omit guardian/POA for some applicants (RCD-side)
    guardianFirstName: String
    guardianMiddleName: String
    guardianLastName: String
    guardianPhone: String
    guardianRelationship: String
    guardianAddressLine1: String
    guardianAddressLine2: String
    guardianCity: String
    guardianPostalCode: String
    poaFormS3ObjectKey: String

    # Additional information
    usesAccessibleConvertedVan: Boolean!
    accessibleConvertedVanLoadingMethod: AccessibleConvertedVanLoadingMethod
    requiresWiderParkingSpace: Boolean!
    requiresWiderParkingSpaceReason: RequiresWiderParkingSpaceReason
    otherRequiresWiderParkingSpaceReason: String

    # Payment information
    paymentMethod: PaymentType!
    processingFee: String! # Input monetary value as string
    donationAmount: String # Input monetary value as string
    paymentMethod2: PaymentType
    processingFee2: String # Input monetary value as string
    donationAmount2: String # Input monetary value as string
    hasSecondPaymentMethod: Boolean!

    # Shipping information
    shippingAddressSameAsHomeAddress: Boolean!
    shippingFullName: String
    shippingAddressLine1: String
    shippingAddressLine2: String
    shippingCity: String
    shippingProvince: Province
    shippingCountry: String
    shippingPostalCode: String

    # Billing information
    billingAddressSameAsHomeAddress: Boolean!
    billingFullName: String
    billingAddressLine1: String
    billingAddressLine2: String
    billingCity: String
    billingProvince: Province
    billingCountry: String
    billingPostalCode: String

    applicantId: Int
  }

  type CreateNewApplicationResult {
    ok: Boolean!
    applicationId: Int
    error: String
  }

  input CreateRenewalApplicationInput {
    # Personal information
    firstName: String!
    middleName: String
    lastName: String!

    # Contact information
    phone: String!
    email: String
    receiveEmailUpdates: Boolean!

    # Address
    addressLine1: String!
    addressLine2: String
    city: String!
    postalCode: String!

    # Doctor information
    physicianFirstName: String!
    physicianLastName: String!
    physicianMspNumber: String!
    physicianPhone: String!
    physicianAddressLine1: String!
    physicianAddressLine2: String
    physicianCity: String!
    physicianPostalCode: String!

    # Additional information
    usesAccessibleConvertedVan: Boolean!
    accessibleConvertedVanLoadingMethod: AccessibleConvertedVanLoadingMethod
    requiresWiderParkingSpace: Boolean!
    requiresWiderParkingSpaceReason: RequiresWiderParkingSpaceReason
    otherRequiresWiderParkingSpaceReason: String

    # Payment information
    paymentMethod: PaymentType!
    processingFee: String # Input monetary value as string
    donationAmount: String # Input monetary value as string
    paymentMethod2: PaymentType
    processingFee2: String # Input monetary value as string
    donationAmount2: String # Input monetary value as string
    hasSecondPaymentMethod: Boolean!

    # Shipping information
    shippingAddressSameAsHomeAddress: Boolean!
    shippingFullName: String
    shippingAddressLine1: String
    shippingAddressLine2: String
    shippingCity: String
    shippingProvince: Province
    shippingCountry: String
    shippingPostalCode: String

    # Billing information
    billingAddressSameAsHomeAddress: Boolean!
    billingFullName: String
    billingAddressLine1: String
    billingAddressLine2: String
    billingCity: String
    billingProvince: Province
    billingCountry: String
    billingPostalCode: String

    applicantId: Int!
  }

  type CreateRenewalApplicationResult {
    ok: Boolean!
    applicationId: Int
    error: String
  }

  # Renewal application being created from applicant-facing form
  input CreateExternalRenewalApplicationInput {
    # Address
    updatedAddress: Boolean!
    addressLine1: String
    addressLine2: String
    city: String
    postalCode: String

    # Contact information
    updatedContactInfo: Boolean!
    phone: String
    email: String
    receiveEmailUpdates: Boolean!

    # Doctor information
    updatedPhysician: Boolean!
    physicianFirstName: String
    physicianLastName: String
    physicianMspNumber: String
    physicianPhone: String
    physicianAddressLine1: String
    physicianAddressLine2: String
    physicianCity: String
    physicianPostalCode: String

    # Additional information
    usesAccessibleConvertedVan: Boolean!
    accessibleConvertedVanLoadingMethod: AccessibleConvertedVanLoadingMethod
    requiresWiderParkingSpace: Boolean!
    requiresWiderParkingSpaceReason: RequiresWiderParkingSpaceReason
    otherRequiresWiderParkingSpaceReason: String

    # Donation information
    donationAmount: Int

    applicantId: Int!
  }

  type CreateExternalRenewalApplicationResult {
    ok: Boolean!
    applicationId: Int
    error: String
    checkoutUrl: String
  }

  input CreateReplacementApplicationInput {
    # Personal information
    firstName: String!
    middleName: String
    lastName: String!

    # Contact information
    phone: String!
    email: String

    # Address
    addressLine1: String!
    addressLine2: String
    city: String!
    postalCode: String!

    # Reason for replacement
    reason: ReasonForReplacement!
    lostTimestamp: Date
    lostLocation: String
    stolenPoliceFileNumber: Int
    stolenJurisdiction: String
    stolenPoliceOfficerName: String
    eventDescription: String

    # Payment information
    paymentMethod: PaymentType!
    processingFee: String! # Input monetary value as string
    donationAmount: String # Input monetary value as string
    paymentMethod2: PaymentType
    processingFee2: String # Input monetary value as string
    donationAmount2: String # Input monetary value as string
    hasSecondPaymentMethod: Boolean!

    # Shipping information
    shippingAddressSameAsHomeAddress: Boolean!
    shippingFullName: String
    shippingAddressLine1: String
    shippingAddressLine2: String
    shippingCity: String
    shippingProvince: Province
    shippingCountry: String
    shippingPostalCode: String

    # Billing information
    billingAddressSameAsHomeAddress: Boolean!
    billingFullName: String
    billingAddressLine1: String
    billingAddressLine2: String
    billingCity: String
    billingProvince: Province
    billingCountry: String
    billingPostalCode: String

    applicantId: Int!
  }

  type CreateReplacementApplicationResult {
    ok: Boolean!
    applicationId: Int
    error: String
  }

  # Query for many applications
  input ApplicationsFilter {
    order: [[String!]!]
    permitType: PermitType
    requestType: ApplicationType
    status: ApplicationStatus
    search: String
    limit: Int
    offset: Int
  }

  type ApplicationsResult {
    result: [Application!]!
    totalCount: Int!
  }

  # Update general information section of application
  input UpdateApplicationGeneralInformationInput {
    # Application ID
    id: Int!

    # Personal information
    firstName: String!
    middleName: String
    lastName: String!

    # Contact information
    phone: String!
    email: String
    receiveEmailUpdates: Boolean

    # Address
    addressLine1: String!
    addressLine2: String
    city: String!
    postalCode: String!
  }

  type UpdateApplicationGeneralInformationResult {
    ok: Boolean!
    error: String
  }

  # Update general information section of a new application (includes date of birth, gender)
  input UpdateNewApplicationGeneralInformationInput {
    # Application ID
    id: Int!

    # Personal information
    firstName: String!
    middleName: String
    lastName: String!
    dateOfBirth: Date!
    gender: Gender!
    otherGender: String

    # Contact information
    phone: String!
    email: String
    receiveEmailUpdates: Boolean

    # Address
    addressLine1: String!
    addressLine2: String
    city: String!
    postalCode: String!
  }

  # Update doctor information section of application
  input UpdateApplicationDoctorInformationInput {
    # Application ID
    id: Int!

    firstName: String!
    lastName: String!
    mspNumber: String!
    phone: String!
    addressLine1: String!
    addressLine2: String
    city: String!
    postalCode: String!
  }

  type UpdateApplicationDoctorInformationResult {
    ok: Boolean!
    error: String
  }

  # Update guardian information section of application
  input UpdateApplicationGuardianInformationInput {
    # Application ID
    id: Int!

    omitGuardianPoa: Boolean
    firstName: String
    middleName: String
    lastName: String
    phone: String
    relationship: String
    addressLine1: String
    addressLine2: String
    city: String
    postalCode: String
    poaFormS3ObjectKey: String
  }

  type UpdateApplicationGuardianInformationResult {
    ok: Boolean!
    error: String
  }

  # Update additional information section of application
  input UpdateApplicationAdditionalInformationInput {
    # Application ID
    id: Int!

    usesAccessibleConvertedVan: Boolean!
    accessibleConvertedVanLoadingMethod: AccessibleConvertedVanLoadingMethod
    requiresWiderParkingSpace: Boolean!
    requiresWiderParkingSpaceReason: RequiresWiderParkingSpaceReason
    otherRequiresWiderParkingSpaceReason: String
  }

  type UpdateApplicationAdditionalInformationResult {
    ok: Boolean!
    error: String
  }

  # Update payment information section of application
  input UpdateApplicationPaymentInformationInput {
    # Application ID
    id: Int!

    # Payment information
    paymentMethod: PaymentType!
    processingFee: String!
    donationAmount: String
    paymentMethod2: PaymentType
    processingFee2: String
    donationAmount2: String
    hasSecondPaymentMethod: Boolean!

    # Shipping information
    shippingAddressSameAsHomeAddress: Boolean!
    shippingFullName: String
    shippingAddressLine1: String
    shippingAddressLine2: String
    shippingCity: String
    shippingProvince: Province
    shippingCountry: String
    shippingPostalCode: String

    # Billing information
    billingAddressSameAsHomeAddress: Boolean!
    billingFullName: String
    billingAddressLine1: String
    billingAddressLine2: String
    billingCity: String
    billingProvince: Province
    billingCountry: String
    billingPostalCode: String
  }

  type UpdateApplicationPaymentInformationResult {
    ok: Boolean!
    error: String
  }

  # Update reason for replacement section of application
  input UpdateApplicationReasonForReplacementInput {
    # Application ID
    id: Int!

    reason: ReasonForReplacement!
    lostTimestamp: Date
    lostLocation: String
    stolenPoliceFileNumber: Int
    stolenJurisdiction: String
    stolenPoliceOfficerName: String
    eventDescription: String
  }

  type UpdateApplicationReasonForReplacementResult {
    ok: Boolean!
    error: String
  }

  # Update physician assessment section of application
  input UpdateApplicationPhysicianAssessmentInput {
    # Application ID
    id: Int!

    # Physician assessment
    disability: String!
    disabilityCertificationDate: Date!
    patientCondition: [PatientCondition!]
    mobilityAids: [MobilityAid!]
    otherPatientCondition: String
    temporaryPermitExpiry: Date
    permitType: PermitType!
    otherMobilityAids: String
  }

  type UpdateApplicationPhysicianAssessmentResult {
    ok: Boolean!
    error: String
  }

  # Delete application
  input DeleteApplicationInput {
    # Application ID
    id: Int!
  }

  type DeleteApplicationResult {
    ok: Boolean!
    error: String
  }
`;
