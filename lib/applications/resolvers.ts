import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Prisma } from '@prisma/client'; // Prisma client
import { Resolver } from '@lib/graphql/resolvers'; // Resolver type
import { DBErrorCode, getUniqueConstraintFailedFields } from '@lib/db/errors'; // Database errors
import { SortOrder } from '@tools/types'; // Sorting type
import { stripPhoneNumber, stripPostalCode } from '@lib/utils/format'; // Formatting utils
import {
  Application,
  CreateExternalRenewalApplicationResult,
  CreateNewApplicationResult,
  CreateRenewalApplicationResult,
  CreateReplacementApplicationResult,
  DeleteApplicationResult,
  MutationCreateExternalRenewalApplicationArgs,
  MutationCreateNewApplicationArgs,
  MutationCreateRenewalApplicationArgs,
  MutationCreateReplacementApplicationArgs,
  MutationDeleteApplicationArgs,
  MutationUpdateApplicationAdditionalInformationArgs,
  MutationUpdateApplicationDoctorInformationArgs,
  MutationUpdateApplicationGeneralInformationArgs,
  MutationUpdateApplicationGuardianInformationArgs,
  MutationUpdateApplicationPaymentInformationArgs,
  MutationUpdateApplicationPhysicianAssessmentArgs,
  MutationUpdateApplicationReasonForReplacementArgs,
  MutationUpdateNewApplicationGeneralInformationArgs,
  NewApplication,
  QueryApplicationArgs,
  QueryApplicationsArgs,
  RenewalApplication,
  ReplacementApplication,
  UpdateApplicationAdditionalInformationResult,
  UpdateApplicationDoctorInformationResult,
  UpdateApplicationGeneralInformationResult,
  UpdateApplicationGuardianInformationResult,
  UpdateApplicationPaymentInformationResult,
  UpdateApplicationPhysicianAssessmentResult,
  UpdateApplicationReasonForReplacementResult,
} from '@lib/graphql/types';
import { flattenApplication } from '@lib/applications/utils';
import { requestPermitHolderInformationMutationSchema } from '@lib/applicants/validation';
import {
  additionalQuestionsMutationSchema,
  applicantFacingRenewalMutationSchema,
  createNewRequestFormSchema,
  paymentInformationMutationSchema,
  reasonForReplacementMutationSchema,
  renewalRequestMutationSchema,
  replacementFormSchema,
} from '@lib/applications/validation';
import { guardianInformationSchema } from '@lib/guardian/validation';
import {
  physicianAssessmentMutationSchema,
  requestPhysicianInformationSchema,
} from '@lib/physicians/validation';
import { ValidationError } from 'yup';
import { getMostRecentPermit } from '@lib/applicants/utils'; // Applicant utils
import moment from 'moment';
import { DonationAmount, ShopifyCheckout } from '@lib/shopify/utils';

/**
 * Query an application by ID
 * @returns Application with given ID
 */
export const application: Resolver<
  QueryApplicationArgs,
  Omit<
    NewApplication | RenewalApplication | ReplacementApplication,
    'processing' | 'applicant' | 'permit'
  >
> = async (_parent, args, { prisma }) => {
  const { id } = args;
  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      newApplication: true,
      renewalApplication: true,
      replacementApplication: true,
      applicant: true,
      permit: true,
    },
  });

  if (application === null) {
    return application;
  }

  return flattenApplication(application);
};

/**
 * Query and filter RCD applications from the internal facing app.
 * All fields are optional.
 *
 * Sorting:
 * - order: array of tuples of the field being sorted and the order. Default [['dateReceived', 'desc']]
 *
 * Filters:
 * - permitType: PermitType (PERMANENT, TEMPORARY)
 * - requestType: Replacement, Renewal
 * - status: ApplicationStatus(PENDING, INPROGRESS, APPROVED, REJECTED, COMPLETED, EXPIRING, EXPIRED, ACTIVE)
 * - search: Search by first, middle, last name or by RCD user ID
 *
 * Pagination:
 * - limit: Number of result to return
 * - offset: Number of results to skip
 *
 * @returns All RCD applications that match the filter(s).
 */
export const applications: Resolver<
  QueryApplicationsArgs,
  { result: Array<Omit<Application, 'processing' | 'applicant' | 'permit'>>; totalCount: number }
> = async (_parent, { filter }, { prisma }) => {
  let where = {};
  let orderBy = undefined;

  if (filter) {
    const {
      order = undefined,
      permitType = undefined,
      requestType = undefined,
      status = undefined,
      search = undefined,
    } = filter;

    // Parse search string
    let rcdUserIDSearch, firstSearch, middleSearch, lastSearch, nameFilters;

    if (search && parseInt(search)) {
      rcdUserIDSearch = parseInt(search);
    } else if (search) {
      // Split search to first, middle and last name elements
      [firstSearch, middleSearch, lastSearch] = search?.split(' ');

      // If all search elements are present, search by each respectively
      // search by first AND middle AND last
      if (firstSearch && middleSearch && lastSearch) {
        nameFilters = {
          AND: [
            { firstName: { startsWith: firstSearch, mode: 'insensitive' } },
            { middleName: { startsWith: middleSearch, mode: 'insensitive' } },
            { lastName: { startsWith: lastSearch, mode: 'insensitive' } },
          ],
        };
        // If there are only two search elements, second element can correspond to either the middle or last name
        // search by first AND (middle OR last)
      } else if (firstSearch && middleSearch) {
        nameFilters = {
          firstName: { startsWith: firstSearch, mode: 'insensitive' },
          OR: [
            { middleName: { startsWith: middleSearch, mode: 'insensitive' } },
            { lastName: { startsWith: middleSearch, mode: 'insensitive' } },
          ],
        };
        // If there is only one search element, it can correspond to the first, middle or last name
        // search by first OR middle OR last
      } else {
        nameFilters = {
          OR: [
            { firstName: { startsWith: firstSearch, mode: 'insensitive' } },
            { middleName: { startsWith: firstSearch, mode: 'insensitive' } },
            { lastName: { startsWith: firstSearch, mode: 'insensitive' } },
          ],
        };
      }
    }

    // Parse sorting order
    if (order && order.length > 0) {
      const sortingOrder: Array<Record<string, SortOrder>> = [];
      order.forEach(([field, order]) => {
        if (field === 'name') {
          // Primary sort is by first name and secondary sort is by last name
          sortingOrder.push({ firstName: order as SortOrder });
          sortingOrder.push({ lastName: order as SortOrder });
        } else if (field === 'dateReceived') {
          sortingOrder.push({ createdAt: order as SortOrder });
        }
      });
      orderBy = sortingOrder;
    } else {
      // Set created at DESC to be default sort order
      orderBy = [{ createdAt: SortOrder.DESC }];
    }

    where = {
      applicant: {
        id: rcdUserIDSearch,
      },
      applicationProcessing: {
        status: status || undefined,
      },
      type: requestType || undefined,
      permitType: permitType || undefined,
      ...nameFilters,
    };
  }

  // Get number of applications with desired filters
  const applicationsCount = await prisma.application.count({
    where,
  });

  // Get applications with filter, sorting, pagination
  const applications = (
    await prisma.application.findMany({
      skip: filter?.offset || 0,
      take: filter?.limit || 20,
      orderBy: orderBy,
      where,
      include: {
        newApplication: true,
        renewalApplication: true,
        replacementApplication: true,
      },
    })
  ).map(flattenApplication);

  return {
    result: applications,
    totalCount: applicationsCount,
  };
};

/**
 * Create a new RCD application
 * @returns Status of operation (ok)
 */
export const createNewApplication: Resolver<
  MutationCreateNewApplicationArgs,
  CreateNewApplicationResult
> = async (_, args, { prisma, logger }) => {
  const { input } = args;

  const {
    phone,
    dateOfBirth,
    gender,
    otherGender,
    postalCode,
    disability,
    disabilityCertificationDate,
    patientCondition,
    mobilityAids,
    otherMobilityAids,
    otherPatientCondition,
    temporaryPermitExpiry,
    physicianFirstName,
    physicianLastName,
    physicianMspNumber,
    physicianPhone,
    physicianAddressLine1,
    physicianAddressLine2,
    physicianCity,
    physicianPostalCode,
    omitGuardianPoa,
    guardianFirstName,
    guardianMiddleName,
    guardianLastName,
    guardianPhone,
    guardianRelationship,
    guardianAddressLine1,
    guardianAddressLine2,
    guardianCity,
    guardianPostalCode,
    poaFormS3ObjectKey,
    usesAccessibleConvertedVan,
    accessibleConvertedVanLoadingMethod,
    requiresWiderParkingSpace,
    requiresWiderParkingSpaceReason,
    otherRequiresWiderParkingSpaceReason,
    donationAmount,
    secondPaymentMethod,
    secondProcessingFee,
    secondDonationAmount,
    shippingPostalCode,
    billingPostalCode,
    applicantId,
    ...data
  } = input;

  const { hasSecondPaymentMethod } = input;

  const permitHolder = {
    firstName: input.firstName,
    middleName: input.middleName,
    lastName: input.lastName,
    dateOfBirth,
    gender,
    otherGender,
    email: input.email,
    phone: input.phone,
    receiveEmailUpdates: input.receiveEmailUpdates,
    addressLine1: input.addressLine1,
    addressLine2: input.addressLine2,
    city: input.city,
    postalCode,
  };

  const physicianAssessment = {
    disability,
    disabilityCertificationDate,
    mobilityAids,
    otherMobilityAids,
    patientCondition,
    otherPatientCondition,
    permitType: input.permitType,
    temporaryPermitExpiry,
  };

  const guardianInformation = {
    omitGuardianPoa,
    firstName: guardianFirstName,
    middleName: guardianMiddleName,
    lastName: guardianLastName,
    phone: guardianPhone,
    relationship: guardianRelationship,
    addressLine1: guardianAddressLine1,
    addressLine2: guardianAddressLine2,
    city: guardianCity,
    postalCode: guardianPostalCode,
    poaFormS3ObjectKey,
  };

  const doctorInformation = {
    firstName: physicianFirstName,
    lastName: physicianLastName,
    mspNumber: physicianMspNumber,
    phone: physicianPhone,
    addressLine1: physicianAddressLine1,
    addressLine2: physicianAddressLine2,
    city: physicianCity,
    postalCode: physicianPostalCode,
  };

  const additionalInformation = {
    usesAccessibleConvertedVan,
    accessibleConvertedVanLoadingMethod,
    requiresWiderParkingSpace,
    requiresWiderParkingSpaceReason,
    otherRequiresWiderParkingSpaceReason,
  };

  const paymentInformation = {
    paymentMethod: input.paymentMethod,
    processingFee: input.processingFee,
    donationAmount,
    secondPaymentMethod,
    secondProcessingFee,
    secondDonationAmount,
    hasSecondPaymentMethod: input.hasSecondPaymentMethod,
    shippingAddressSameAsHomeAddress: input.shippingAddressSameAsHomeAddress,
    shippingFullName: input.shippingFullName,
    shippingAddressLine1: input.shippingAddressLine1,
    shippingAddressLine2: input.shippingAddressLine2,
    shippingCity: input.shippingCity,
    shippingProvince: input.shippingProvince,
    shippingCountry: input.shippingCountry,
    shippingPostalCode,
    billingAddressSameAsHomeAddress: input.billingAddressSameAsHomeAddress,
    billingFullName: input.billingFullName,
    billingAddressLine1: input.billingAddressLine1,
    billingAddressLine2: input.billingAddressLine2,
    billingCity: input.billingCity,
    billingProvince: input.billingProvince,
    billingCountry: input.billingCountry,
    billingPostalCode,
  };
  try {
    await createNewRequestFormSchema.validate({
      permitHolder,
      physicianAssessment,
      guardianInformation,
      doctorInformation,
      additionalInformation,
      paymentInformation,
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      return {
        ok: false,
        applicationId: null,
        error: err.message,
      };
    }

    // Unknown error
    logger.error({ error: (err as any).message }, 'Unknown error');
    throw new ApolloError('Application was unable to be created');
  }

  let application;
  try {
    application = await prisma.application.create({
      data: {
        type: 'NEW',
        donationAmount: donationAmount || 0,
        secondPaymentMethod: hasSecondPaymentMethod ? secondPaymentMethod : null,
        secondProcessingFee: hasSecondPaymentMethod ? secondProcessingFee || 0 : null,
        secondDonationAmount: hasSecondPaymentMethod ? secondDonationAmount || 0 : null,
        // Connect to applicant if applicant exists in DB
        ...(applicantId && {
          applicant: {
            connect: { id: applicantId },
          },
        }),
        ...data,
        phone: stripPhoneNumber(phone),
        postalCode: stripPostalCode(postalCode),
        shippingPostalCode: shippingPostalCode && stripPostalCode(shippingPostalCode),
        billingPostalCode: billingPostalCode && stripPostalCode(billingPostalCode),
        newApplication: {
          create: {
            dateOfBirth,
            gender,
            otherGender,
            disability,
            disabilityCertificationDate,
            patientCondition: patientCondition || [],
            mobilityAids: mobilityAids || [],
            otherMobilityAids,
            otherPatientCondition,
            temporaryPermitExpiry,
            physicianFirstName,
            physicianLastName,
            physicianMspNumber,
            physicianPhone: stripPhoneNumber(physicianPhone),
            physicianAddressLine1,
            physicianAddressLine2,
            physicianCity,
            physicianPostalCode: stripPostalCode(physicianPostalCode),
            ...(!omitGuardianPoa && {
              guardianFirstName,
              guardianMiddleName,
              guardianLastName,
              guardianPhone: guardianPhone && stripPhoneNumber(guardianPhone),
              guardianRelationship,
              guardianAddressLine1,
              guardianAddressLine2,
              guardianCity,
              guardianPostalCode: guardianPostalCode && stripPostalCode(guardianPostalCode),
              poaFormS3ObjectKey,
            }),
            usesAccessibleConvertedVan,
            accessibleConvertedVanLoadingMethod,
            requiresWiderParkingSpace,
            requiresWiderParkingSpaceReason,
            otherRequiresWiderParkingSpaceReason,
          },
        },
        applicationProcessing: {
          create: {},
        },
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === DBErrorCode.LengthConstraintFailed) {
        return {
          ok: false,
          applicationId: null,
          error: 'Length constraint failed, provided value too long for an application field.',
        };
      }
    }

    // Unknown error
    logger.error({ error: err }, 'Unknown error');
  }

  // Throw internal server error if application was not created
  if (!application) {
    throw new ApolloError('Application was unable to be created');
  }

  return {
    ok: true,
    applicationId: application.id,
    error: null,
  };
};

/**
 * Create a renewal application internally (via RCD-facing portal)
 * @returns Status of operation (ok)
 */
export const createRenewalApplication: Resolver<
  MutationCreateRenewalApplicationArgs,
  CreateRenewalApplicationResult
> = async (_, args, { prisma, logger }) => {
  const { input } = args;

  const {
    applicantId,
    phone,
    postalCode,
    physicianFirstName,
    physicianLastName,
    physicianMspNumber,
    physicianPhone,
    physicianAddressLine1,
    physicianAddressLine2,
    physicianCity,
    physicianPostalCode,
    usesAccessibleConvertedVan,
    accessibleConvertedVanLoadingMethod,
    requiresWiderParkingSpace,
    requiresWiderParkingSpaceReason,
    otherRequiresWiderParkingSpaceReason,
    donationAmount,
    secondPaymentMethod,
    secondProcessingFee,
    secondDonationAmount,
    shippingPostalCode,
    billingPostalCode,
    ...data
  } = input;

  const {
    firstName,
    middleName,
    lastName,
    email,
    receiveEmailUpdates,
    addressLine1,
    addressLine2,
    city,
    paymentMethod,
    processingFee,
    hasSecondPaymentMethod,
    shippingAddressSameAsHomeAddress,
    shippingFullName,
    shippingAddressLine1,
    shippingAddressLine2,
    shippingCity,
    shippingProvince,
    shippingCountry,
    billingAddressSameAsHomeAddress,
    billingFullName,
    billingAddressLine1,
    billingAddressLine2,
    billingCity,
    billingProvince,
    billingCountry,
  } = input;

  const permitHolder = {
    firstName,
    middleName,
    lastName,
    email,
    phone,
    receiveEmailUpdates,
    addressLine1,
    addressLine2,
    city,
    postalCode,
  };

  const doctorInformation = {
    firstName: physicianFirstName,
    lastName: physicianLastName,
    mspNumber: physicianMspNumber,
    phone: physicianPhone,
    addressLine1: physicianAddressLine1,
    addressLine2: physicianAddressLine2,
    city: physicianCity,
    postalCode: physicianPostalCode,
  };

  const additionalInformation = {
    usesAccessibleConvertedVan,
    accessibleConvertedVanLoadingMethod,
    requiresWiderParkingSpace,
    requiresWiderParkingSpaceReason,
    otherRequiresWiderParkingSpaceReason,
  };

  const paymentInformation = {
    paymentMethod,
    processingFee,
    donationAmount,
    secondPaymentMethod,
    secondProcessingFee,
    secondDonationAmount,
    hasSecondPaymentMethod,
    shippingAddressSameAsHomeAddress,
    shippingFullName,
    shippingAddressLine1,
    shippingAddressLine2,
    shippingCity,
    shippingProvince,
    shippingCountry,
    shippingPostalCode,
    billingAddressSameAsHomeAddress,
    billingFullName,
    billingAddressLine1,
    billingAddressLine2,
    billingCity,
    billingProvince,
    billingCountry,
    billingPostalCode,
  };

  try {
    await renewalRequestMutationSchema.validate({
      applicantId,
      permitHolder,
      doctorInformation,
      additionalInformation,
      paymentInformation,
      paidThroughShopify: false,
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      return {
        ok: false,
        applicationId: null,
        error: err.message,
      };
    }

    // Unknown error
    logger.error({ error: err }, 'Unknown error');
    throw new ApolloError('Renewal application was unable to be created');
  }

  let createdRenewalApplication;
  try {
    createdRenewalApplication = await prisma.application.create({
      data: {
        type: 'RENEWAL',
        donationAmount: donationAmount || 0,
        secondPaymentMethod: hasSecondPaymentMethod ? secondPaymentMethod : null,
        secondProcessingFee: hasSecondPaymentMethod ? secondProcessingFee || 0 : null,
        secondDonationAmount: hasSecondPaymentMethod ? secondDonationAmount || 0 : null,
        phone: stripPhoneNumber(phone),
        ...data,
        postalCode: stripPostalCode(postalCode),
        shippingPostalCode: shippingPostalCode && stripPostalCode(shippingPostalCode),
        billingPostalCode: billingPostalCode && stripPostalCode(billingPostalCode),
        applicant: {
          connect: { id: applicantId },
        },
        renewalApplication: {
          create: {
            physicianFirstName,
            physicianLastName,
            physicianMspNumber,
            physicianPhone: stripPhoneNumber(physicianPhone),
            physicianAddressLine1,
            physicianAddressLine2,
            physicianCity,
            physicianPostalCode: stripPostalCode(physicianPostalCode),
            usesAccessibleConvertedVan,
            accessibleConvertedVanLoadingMethod,
            requiresWiderParkingSpace,
            requiresWiderParkingSpaceReason,
            otherRequiresWiderParkingSpaceReason,
          },
        },
        applicationProcessing: { create: {} },
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        applicationId: null,
        error: err.message,
      };
    }

    // Unknown error
    logger.error({ error: err }, 'Unknown error');
  }

  if (!createdRenewalApplication) {
    throw new ApolloError('Renewal application was unable to be created');
  }

  return { ok: true, applicationId: createdRenewalApplication.id, error: null };
};

/**
 * Create a renewal application externally (via applicant-facing portal)
 * Requires updated field values to be provided if any of personal address, contact, or doctor info are updated.
 * @returns Status of operation (ok) and application id of new renewal application
 */
export const createExternalRenewalApplication: Resolver<
  MutationCreateExternalRenewalApplicationArgs,
  CreateExternalRenewalApplicationResult
> = async (_, args, { prisma, logger }) => {
  const { input } = args;
  const {
    applicantId,
    updatedAddress,
    addressLine1,
    addressLine2,
    city,
    postalCode,
    updatedContactInfo,
    phone,
    email,
    receiveEmailUpdates,
    updatedPhysician,
    physicianFirstName,
    physicianLastName,
    physicianMspNumber,
    physicianPhone,
    physicianAddressLine1,
    physicianAddressLine2,
    physicianCity,
    physicianPostalCode,
    usesAccessibleConvertedVan,
    accessibleConvertedVanLoadingMethod,
    requiresWiderParkingSpace,
    requiresWiderParkingSpaceReason,
    otherRequiresWiderParkingSpaceReason,
  } = input;

  try {
    await applicantFacingRenewalMutationSchema.validate({
      updatedDoctor: updatedPhysician,
      personalAddressLine1: addressLine1,
      personalAddressLine2: addressLine2,
      personalCity: city,
      personalPostalCode: postalCode,
      contactPhoneNumber: phone,
      contactEmailAddress: email,
      doctorFirstName: physicianFirstName,
      doctorLastName: physicianLastName,
      doctorMspNumber: physicianMspNumber,
      doctorAddressLine1: physicianAddressLine1,
      doctorAddressLine2: physicianAddressLine2,
      doctorCity: physicianCity,
      doctorPostalCode: physicianPostalCode,
      doctorPhoneNumber: physicianPhone,
      ...input,
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      return {
        ok: false,
        applicationId: null,
        error: err.message,
        checkoutUrl: null,
      };
    }

    // Unknown error
    logger.error({ error: err }, 'Unknown error');
    throw new ApolloError('Application was unable to be created');
  }

  const mostRecentPermit = await getMostRecentPermit(applicantId);
  if (!mostRecentPermit) {
    // Applicant must have previous permit
    return {
      ok: false,
      applicationId: null,
      error:
        'You do not have any previous permits to renew. Please apply for a new parking permit or contact RCD.',
      checkoutUrl: null,
    };
  } else if (moment.utc(mostRecentPermit.expiryDate).add(6, 'M') < moment()) {
    // Can only submit renewal application if permit expiry less than 6 months ago
    return {
      ok: false,
      applicationId: null,
      error:
        'Your permit expired over 6 months ago. Please apply for a new parking permit or contact RCD.',
      checkoutUrl: null,
    };
  }

  // Retrieve applicant record
  const applicant = await prisma.applicant.findUnique({
    where: { id: applicantId },
    include: { medicalInformation: { include: { physician: true } } },
  });

  // If applicant not found, throw error
  if (!applicant) {
    return {
      ok: false,
      applicationId: null,
      error: `No applicant with ID ${applicantId} was found`,
      checkoutUrl: null,
    };
  }

  // TODO: Replace validation for donation amount
  const { donationAmount = 0 } = input;
  if (donationAmount !== null && ![0, 5, 10, 25, 50, 75, 100, 200].includes(donationAmount)) {
    return {
      ok: false,
      applicationId: null,
      error: 'Invalid donation amount',
      checkoutUrl: null,
    };
  }

  const physician = applicant.medicalInformation.physician;

  let application;
  try {
    application = await prisma.application.create({
      data: {
        type: 'RENEWAL',
        firstName: applicant.firstName,
        middleName: applicant.middleName,
        lastName: applicant.lastName,
        phone: updatedContactInfo && phone ? stripPhoneNumber(phone) : applicant.phone,
        email: updatedContactInfo ? email || null : applicant.email,
        receiveEmailUpdates: updatedContactInfo
          ? receiveEmailUpdates
          : applicant.receiveEmailUpdates,
        addressLine1: updatedAddress && addressLine1 ? addressLine1 : applicant.addressLine1,
        addressLine2: updatedAddress ? addressLine2 : applicant.addressLine2,
        city: updatedAddress && city ? city : applicant.city,
        postalCode:
          updatedAddress && postalCode ? stripPostalCode(postalCode) : applicant.postalCode,
        paymentMethod: 'SHOPIFY',
        processingFee: process.env.PROCESSING_FEE,
        donationAmount: donationAmount || 0,
        secondPaymentMethod: null,
        secondProcessingFee: null,
        secondDonationAmount: null,
        hasSecondPaymentMethod: false,
        // Set shipping address to be same as home address by default
        shippingAddressSameAsHomeAddress: true,
        shippingFullName: null,
        shippingAddressLine1: null,
        shippingAddressLine2: null,
        shippingCity: null,
        shippingProvince: null,
        shippingCountry: null,
        shippingPostalCode: null,
        // Set billing address to be same as home address by default - gets updated after Shopify payment is received
        billingAddressSameAsHomeAddress: true,
        billingFullName: null,
        billingAddressLine1: null,
        billingAddressLine2: null,
        billingCity: null,
        billingProvince: null,
        billingCountry: null,
        billingPostalCode: null,
        applicant: {
          connect: { id: applicantId },
        },
        renewalApplication: {
          create: {
            physicianFirstName:
              updatedPhysician && physicianFirstName ? physicianFirstName : physician.firstName,
            physicianLastName:
              updatedPhysician && physicianLastName ? physicianLastName : physician.lastName,
            physicianMspNumber:
              updatedPhysician && physicianMspNumber ? physicianMspNumber : physician.mspNumber,
            physicianPhone: stripPhoneNumber(
              updatedPhysician && physicianPhone ? physicianPhone : physician.phone
            ),
            physicianAddressLine1:
              updatedPhysician && addressLine1 ? addressLine1 : physician.addressLine1,
            physicianAddressLine2: updatedPhysician
              ? physicianAddressLine2
              : physician.addressLine2,
            physicianCity: updatedPhysician && physicianCity ? physicianCity : physician.city,
            physicianPostalCode:
              updatedPhysician && physicianPostalCode
                ? stripPostalCode(physicianPostalCode)
                : physician.postalCode,
            usesAccessibleConvertedVan,
            accessibleConvertedVanLoadingMethod,
            requiresWiderParkingSpace,
            requiresWiderParkingSpaceReason,
            otherRequiresWiderParkingSpaceReason,
          },
        },
        applicationProcessing: {
          create: {},
        },
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (
        err.code === DBErrorCode.ForeignKeyConstraintFailed &&
        getUniqueConstraintFailedFields(err)?.includes('applicantId')
      ) {
        return {
          ok: false,
          applicationId: null,
          error: `Applicant ID ${applicantId} does not exist`,
          checkoutUrl: null,
        };
      } else if (err.code === DBErrorCode.LengthConstraintFailed) {
        return {
          ok: false,
          applicationId: null,
          error: 'Length constraint failed, provided value too long for an application field.',
          checkoutUrl: null,
        };
      }
    }

    // Unknown error
    logger.error({ error: err }, 'Unknown error');
  }

  // Throw internal server error if renewal application was not created
  if (!application) {
    throw new ApolloError('Application was unable to be created');
  }

  // Set up Shopify checkout
  const checkout = new ShopifyCheckout();
  const checkoutUrl = await checkout.setUpCheckout(
    application.id,
    donationAmount as DonationAmount
  );

  return {
    ok: true,
    applicationId: application.id,
    error: null,
    checkoutUrl,
  };
};

/**
 * Create a replacement application
 * Requires updated field values to be provided if any of personal address, contact, or doctor info are updated.
 * @returns Status of operation (ok)
 */
export const createReplacementApplication: Resolver<
  MutationCreateReplacementApplicationArgs,
  CreateReplacementApplicationResult
> = async (_, args, { prisma, logger }) => {
  const { input } = args;

  const {
    applicantId,
    phone,
    postalCode,
    reason,
    lostTimestamp,
    lostLocation,
    stolenPoliceFileNumber,
    stolenJurisdiction,
    stolenPoliceOfficerName,
    eventDescription,
    donationAmount,
    secondPaymentMethod,
    secondProcessingFee,
    secondDonationAmount,
    shippingPostalCode,
    billingPostalCode,
    ...data
  } = input;

  const {
    // Remaining Permit Holder Information Fields
    firstName,
    middleName,
    lastName,
    email,
    addressLine1,
    addressLine2,
    city,

    // Remaining Payment Information Fields
    paymentMethod,
    processingFee,
    hasSecondPaymentMethod,
    shippingAddressSameAsHomeAddress,
    shippingFullName,
    shippingAddressLine1,
    shippingAddressLine2,
    shippingCity,
    shippingProvince,
    shippingCountry,
    billingAddressSameAsHomeAddress,
    billingFullName,
    billingAddressLine1,
    billingAddressLine2,
    billingCity,
    billingProvince,
    billingCountry,
  } = input;

  const permitHolder = {
    firstName,
    middleName,
    lastName,
    email,
    phone,
    addressLine1,
    addressLine2,
    city,
    postalCode,
  };

  const paymentInformation = {
    paymentMethod,
    processingFee,
    donationAmount,
    secondPaymentMethod,
    secondProcessingFee,
    secondDonationAmount,
    hasSecondPaymentMethod,
    shippingAddressSameAsHomeAddress,
    shippingFullName,
    shippingAddressLine1,
    shippingAddressLine2,
    shippingCity,
    shippingProvince,
    shippingCountry,
    shippingPostalCode,
    billingAddressSameAsHomeAddress,
    billingFullName,
    billingAddressLine1,
    billingAddressLine2,
    billingCity,
    billingProvince,
    billingCountry,
    billingPostalCode,
  };
  const reasonForReplacement = {
    reason,
    lostTimestamp,
    lostLocation,
    eventDescription,
    stolenPoliceFileNumber,
    stolenJurisdiction,
    stolenPoliceOfficerName,
  };

  try {
    await replacementFormSchema.validate({
      permitHolder,
      paymentInformation,
      reasonForReplacement,
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      return {
        ok: false,
        applicationId: null,
        error: err.message,
      };
    }

    // Unknown error
    logger.error({ error: err }, 'Unknown error');
    throw new ApolloError('Application was unable to be created');
  }

  // Retrieve applicant record
  const applicant = await prisma.applicant.findUnique({
    where: { id: applicantId },
  });

  // If applicant not found, return error
  if (!applicant) {
    return {
      ok: false,
      applicationId: null,
      error: `No applicant with ID ${applicantId} was found`,
    };
  }

  let application;
  try {
    application = await prisma.application.create({
      data: {
        type: 'REPLACEMENT',
        donationAmount: donationAmount || 0,
        secondPaymentMethod: hasSecondPaymentMethod ? secondPaymentMethod : null,
        secondProcessingFee: hasSecondPaymentMethod ? secondProcessingFee || 0 : null,
        secondDonationAmount: hasSecondPaymentMethod ? secondDonationAmount || 0 : null,
        phone: stripPhoneNumber(phone),
        postalCode: stripPostalCode(postalCode),
        shippingPostalCode: shippingPostalCode && stripPostalCode(shippingPostalCode),
        billingPostalCode: billingPostalCode && stripPostalCode(billingPostalCode),
        ...data,
        applicant: {
          connect: { id: applicantId },
        },
        replacementApplication: {
          create: {
            reason,
            lostTimestamp,
            lostLocation,
            stolenPoliceFileNumber,
            stolenJurisdiction,
            stolenPoliceOfficerName,
            eventDescription,
          },
        },
        applicationProcessing: {
          create: {},
        },
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (
        err.code === DBErrorCode.ForeignKeyConstraintFailed &&
        getUniqueConstraintFailedFields(err)?.includes('applicantId')
      ) {
        return {
          ok: false,
          applicationId: null,
          error: `Applicant ID ${applicantId} does not exist`,
        };
      } else if (err.code === DBErrorCode.LengthConstraintFailed) {
        return {
          ok: false,
          applicationId: null,
          error: 'Length constraint failed, provided value too long for an application field.',
        };
      }
    }

    // Unknown error
    logger.error({ error: err }, 'Unknown error');
  }

  // Throw internal server error if replacement application was not created
  if (!application) {
    throw new ApolloError('Application was unable to be created');
  }

  return {
    ok: true,
    applicationId: application.id,
    error: null,
  };
};

/**
 * Update the general information section of an application
 * @returns Status of the operation (ok)
 */
export const updateApplicationGeneralInformation: Resolver<
  MutationUpdateApplicationGeneralInformationArgs,
  UpdateApplicationGeneralInformationResult
> = async (_parent, args, { prisma, logger }) => {
  const { input } = args;

  try {
    await requestPermitHolderInformationMutationSchema.validate(input);
  } catch (err) {
    if (err instanceof ValidationError) {
      return {
        ok: false,
        error: err.message,
      };
    }

    // Unknown error
    logger.error({ error: err }, 'Unknown error');
    throw new ApolloError('Application general information was unable to be updated');
  }

  const { id, receiveEmailUpdates, phone, postalCode, ...validatedData } = input;

  // Prevent reviewed requests from being updated
  const application = await prisma.application.findUnique({
    where: { id },
    select: {
      applicationProcessing: {
        select: {
          reviewRequestCompleted: true,
        },
      },
    },
  });

  if (!application) {
    return { ok: false, error: `Application with ID ${id} not found` };
  }

  if (application.applicationProcessing.reviewRequestCompleted) {
    return { ok: false, error: 'Reviewed requests cannot be updated' };
  }

  let updatedApplication;
  try {
    updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        // Only set to `undefined` if `receiveEmailUpdates` is null
        receiveEmailUpdates: receiveEmailUpdates ?? undefined,
        phone: stripPhoneNumber(phone),
        postalCode: stripPostalCode(postalCode),
        ...validatedData,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        error: err.message,
      };
    }

    // Unknown error
    logger.error({ error: err }, 'Unknown error');
  }

  if (!updatedApplication) {
    throw new ApolloError('Application general information was unable to be updated');
  }

  return { ok: true, error: null };
};

/**
 * Update the general information section of a new application (includes date of birth, gender)
 * @returns Status of the operation (ok)
 */
export const updateNewApplicationGeneralInformation: Resolver<
  MutationUpdateNewApplicationGeneralInformationArgs,
  UpdateApplicationGeneralInformationResult
> = async (_parent, args, { prisma, logger }) => {
  const { input } = args;

  try {
    await requestPermitHolderInformationMutationSchema.validate({ type: 'NEW', ...input });
  } catch (err) {
    if (err instanceof ValidationError) {
      return {
        ok: false,
        error: err.message,
      };
    }

    // Unknown error
    logger.error({ error: err }, 'Unknown error');
    throw new ApolloError('Application general information was unable to be updated');
  }

  const {
    id,
    receiveEmailUpdates,
    phone,
    postalCode,
    dateOfBirth,
    gender,
    otherGender,
    ...validatedData
  } = input;

  // Prevent reviewed requests from being updated
  const application = await prisma.application.findUnique({
    where: { id },
    select: {
      applicationProcessing: {
        select: {
          reviewRequestCompleted: true,
        },
      },
    },
  });

  if (!application) {
    return { ok: false, error: `Application with ID ${id} not found` };
  }

  if (application.applicationProcessing.reviewRequestCompleted) {
    return { ok: false, error: 'Reviewed requests cannot be updated' };
  }

  let updatedApplication;
  try {
    updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        // Only set to `undefined` if `receiveEmailUpdates` is null
        receiveEmailUpdates: receiveEmailUpdates ?? undefined,
        phone: stripPhoneNumber(phone),
        postalCode: stripPostalCode(postalCode),
        newApplication: {
          update: {
            dateOfBirth,
            gender,
            otherGender: otherGender ?? undefined,
          },
        },
        ...validatedData,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        error: err.message,
      };
    }

    // Unknown error
    logger.error({ error: err }, 'Unknown error');
  }

  if (!updatedApplication) {
    throw new ApolloError('Application general information was unable to be updated');
  }

  return { ok: true, error: null };
};

/**
 * Update the doctor information section of an application
 * @returns Status of the operation (ok)
 */
export const updateApplicationDoctorInformation: Resolver<
  MutationUpdateApplicationDoctorInformationArgs,
  UpdateApplicationDoctorInformationResult
> = async (_parent, args, { prisma, logger }) => {
  const { input } = args;
  const {
    id,
    firstName: physicianFirstName,
    lastName: physicianLastName,
    mspNumber: physicianMspNumber,
    phone: physicianPhone,
    addressLine1: physicianAddressLine1,
    addressLine2: physicianAddressLine2,
    city: physicianCity,
    postalCode: physicianPostalCode,
  } = input;

  try {
    await requestPhysicianInformationSchema.validate({
      firstName: physicianFirstName,
      lastName: physicianLastName,
      mspNumber: physicianMspNumber,
      phone: physicianPhone,
      addressLine1: physicianAddressLine1,
      addressLine2: physicianAddressLine2,
      city: physicianCity,
      postalCode: physicianPostalCode,
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      return {
        ok: false,
        error: err.message,
      };
    }

    // Unknown error
    logger.error({ error: err }, 'Unknown error');
    throw new ApolloError('Application doctor information was unable to be updated');
  }

  const application = await prisma.application.findUnique({
    where: { id },
    select: {
      type: true,
      applicationProcessing: {
        select: {
          reviewRequestCompleted: true,
        },
      },
    },
  });

  if (!application) {
    return { ok: false, error: 'Application not found' };
  }

  // Prevent reviewed requests from being updated
  if (application.applicationProcessing.reviewRequestCompleted) {
    return { ok: false, error: 'Reviewed requests cannot be updated' };
  }

  const { type } = application;

  if (type === 'REPLACEMENT') {
    return {
      ok: false,
      error: 'Cannot update doctor information of replacement application',
    };
  }

  let updatedApplication;
  try {
    updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        ...(type === 'NEW' && {
          newApplication: {
            update: {
              physicianFirstName,
              physicianLastName,
              physicianMspNumber,
              physicianPhone: stripPhoneNumber(physicianPhone),
              physicianAddressLine1,
              physicianAddressLine2,
              physicianCity,
              physicianPostalCode: stripPostalCode(physicianPostalCode),
            },
          },
        }),
        ...(type === 'RENEWAL' && {
          renewalApplication: {
            update: {
              physicianFirstName,
              physicianLastName,
              physicianMspNumber,
              physicianPhone: stripPhoneNumber(physicianPhone),
              physicianAddressLine1,
              physicianAddressLine2,
              physicianCity,
              physicianPostalCode: stripPostalCode(physicianPostalCode),
            },
          },
        }),
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        error: err.message,
      };
    }

    // Unknown error
    logger.error({ error: err }, 'Unknown error');
  }

  if (!updatedApplication) {
    throw new ApolloError('Application doctor information was unable to be updated');
  }

  return { ok: true, error: null };
};

/**
 * Update the guardian information section of an application
 * @returns Status of the operation (ok)
 */
export const updateApplicationGuardianInformation: Resolver<
  MutationUpdateApplicationGuardianInformationArgs,
  UpdateApplicationGuardianInformationResult
> = async (_parent, args, { prisma, logger }) => {
  const { input } = args;
  const { id, omitGuardianPoa } = input;

  let updatedApplication;
  try {
    if (omitGuardianPoa) {
      updatedApplication = await prisma.newApplication.update({
        where: { applicationId: id },
        data: {
          guardianFirstName: null,
          guardianMiddleName: null,
          guardianLastName: null,
          guardianPhone: null,
          guardianRelationship: null,
          guardianAddressLine1: null,
          guardianAddressLine2: null,
          guardianCity: null,
          guardianPostalCode: null,
          poaFormS3ObjectKey: null,
        },
      });
    } else {
      const {
        firstName,
        middleName,
        lastName,
        phone,
        relationship,
        addressLine1,
        addressLine2,
        city,
        postalCode,
        poaFormS3ObjectKey,
      } = input;

      try {
        await guardianInformationSchema.validate({
          omitGuardianPoa,
          firstName,
          middleName,
          lastName,
          phone,
          relationship,
          addressLine1,
          addressLine2,
          city,
          postalCode,
        });
      } catch (err) {
        if (err instanceof ValidationError) {
          return {
            ok: false,
            error: err.message,
          };
        }

        // Unknown error
        logger.error({ error: err }, 'Unknown error');
        throw new ApolloError('Application guardian information was unable to be updated');
      }

      updatedApplication = await prisma.newApplication.update({
        where: { applicationId: id },
        data: {
          guardianFirstName: firstName,
          guardianMiddleName: middleName,
          guardianLastName: lastName,
          guardianPhone: phone && stripPhoneNumber(phone),
          guardianRelationship: relationship,
          guardianAddressLine1: addressLine1,
          guardianAddressLine2: addressLine2,
          guardianCity: city,
          guardianPostalCode: postalCode && stripPostalCode(postalCode),
          poaFormS3ObjectKey,
        },
      });
    }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        error: err.message,
      };
    }

    // Unknown error
    logger.error({ error: err }, 'Unknown error');
  }

  if (!updatedApplication) {
    throw new ApolloError('Application guardian information was unable to be updated');
  }

  return {
    ok: true,
    error: null,
  };
};

/**
 * Update the additional information section of an application
 * @returns Status of the operation (ok)
 */
export const updateApplicationAdditionalInformation: Resolver<
  MutationUpdateApplicationAdditionalInformationArgs,
  UpdateApplicationAdditionalInformationResult
> = async (_parent, args, { prisma, logger }) => {
  const { input } = args;

  try {
    await additionalQuestionsMutationSchema.validate(input);
  } catch (err) {
    if (err instanceof ValidationError) {
      return {
        ok: false,
        error: err.message,
      };
    }

    // Unknown error
    logger.error({ error: err }, 'Unknown error');
    throw new ApolloError('Application additional information was unable to be updated');
  }

  const { id, ...data } = input;

  // Get existing application type (should be NEW/RENEWAL)
  const application = await prisma.application.findUnique({
    where: { id },
    select: {
      type: true,
      applicationProcessing: {
        select: {
          reviewRequestCompleted: true,
        },
      },
    },
  });

  if (!application) {
    return { ok: false, error: 'Application not found' };
  }

  // Prevent reviewed requests from being updated
  if (application.applicationProcessing.reviewRequestCompleted) {
    return { ok: false, error: 'Reviewed requests cannot be updated' };
  }

  const { type } = application;

  let updatedApplication;
  try {
    if (type === 'NEW') {
      updatedApplication = await prisma.application.update({
        where: { id },
        data: {
          newApplication: {
            update: data,
          },
        },
      });
    } else if (type === 'RENEWAL') {
      updatedApplication = await prisma.application.update({
        where: { id },
        data: {
          renewalApplication: {
            update: data,
          },
        },
      });
    } else {
      return {
        ok: false,
        error: 'Replacement application cannot have additional information updated',
      };
    }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        error: err.message,
      };
    }

    // Unknown error
    logger.error({ error: err }, 'Unknown error');
  }

  if (!updatedApplication) {
    throw new ApolloError('Application additional information was unable to be updated');
  }

  return { ok: true, error: null };
};

/**
 * Update the payment information section of an application
 * @returns Status of the operation (ok)
 */
export const updateApplicationPaymentInformation: Resolver<
  MutationUpdateApplicationPaymentInformationArgs,
  UpdateApplicationPaymentInformationResult
> = async (_parent, args, { prisma, logger }) => {
  const { input } = args;

  try {
    await paymentInformationMutationSchema.validate(input);
  } catch (err) {
    if (err instanceof ValidationError) {
      return {
        ok: false,
        error: err.message,
      };
    }

    // Unknown error
    logger.error({ error: err }, 'Unknown error');
    throw new ApolloError('Application payment information was unable to be updated');
  }

  const {
    id,
    donationAmount,
    secondPaymentMethod,
    secondProcessingFee,
    secondDonationAmount,
    shippingPostalCode,
    billingPostalCode,
    ...validatedData
  } = input;

  const { hasSecondPaymentMethod } = input;

  const application = await prisma.application.findUnique({
    where: { id },
    select: {
      paidThroughShopify: true,
      applicationProcessing: {
        select: {
          reviewRequestCompleted: true,
        },
      },
    },
  });

  if (!application) {
    return { ok: false, error: 'Application does not exist' };
  }

  // Prevent reviewed requests from being updated
  if (application.applicationProcessing.reviewRequestCompleted) {
    return { ok: false, error: 'Reviewed requests cannot be updated' };
  }

  // Payment info should not be updated for applications paid through Shopify
  if (application.paidThroughShopify) {
    return {
      ok: false,
      error: 'Cannot update payment information for an application paid through Shopify',
    };
  }

  let updatedApplication;
  try {
    updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        donationAmount: donationAmount || 0,
        secondPaymentMethod: hasSecondPaymentMethod ? secondPaymentMethod : null,
        secondProcessingFee: hasSecondPaymentMethod ? secondProcessingFee || 0 : null,
        secondDonationAmount: hasSecondPaymentMethod ? secondDonationAmount || 0 : null,
        shippingPostalCode: shippingPostalCode && stripPostalCode(shippingPostalCode),
        billingPostalCode: billingPostalCode && stripPostalCode(billingPostalCode),
        ...validatedData,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        error: err.message,
      };
    }

    // Unknown error
    logger.error({ error: err }, 'Unknown error');
  }

  if (!updatedApplication) {
    throw new ApolloError('Application payment information was unable to be updated');
  }

  return { ok: true, error: null };
};

/**
 * Update the reason for replacement section of a replacement application
 * @returns Status of the operation (ok)
 */
export const updateApplicationReasonForReplacement: Resolver<
  MutationUpdateApplicationReasonForReplacementArgs,
  UpdateApplicationReasonForReplacementResult
> = async (_parent, args, { prisma, logger }) => {
  const { input } = args;

  try {
    await reasonForReplacementMutationSchema.validate(input);
  } catch (err) {
    if (err instanceof ValidationError) {
      return {
        ok: false,
        error: err.message,
      };
    }

    // Unknown error
    logger.error({ error: err }, 'Unknown error');
    throw new ApolloError('Application reason for replacement was unable to be updated');
  }

  const { id, ...validatedData } = input;

  // Prevent reviewed requests from being updated
  const application = await prisma.application.findUnique({
    where: { id },
    select: {
      type: true,
      applicationProcessing: {
        select: {
          reviewRequestCompleted: true,
        },
      },
    },
  });

  if (!application) {
    return { ok: false, error: `Application with ID ${id} not found` };
  }

  if (application.applicationProcessing.reviewRequestCompleted) {
    return { ok: false, error: 'Reviewed requests cannot be updated' };
  }

  if (application.type !== 'REPLACEMENT') {
    return { ok: false, error: 'Application must be a replacement application' };
  }

  let updatedApplication;
  try {
    updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        replacementApplication: {
          update: validatedData,
        },
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        error: err.message,
      };
    }

    // Unknown error
    logger.error({ error: err }, 'Unknown error');
  }

  if (!updatedApplication) {
    throw new ApolloError('Application reason for replacement was unable to be updated');
  }

  return { ok: true, error: null };
};

/**
 * Update the physician assessment section of a new application
 * @returns Status of the operation (ok)
 */
export const updateApplicationPhysicianAssessment: Resolver<
  MutationUpdateApplicationPhysicianAssessmentArgs,
  UpdateApplicationPhysicianAssessmentResult
> = async (_parent, args, { prisma, logger }) => {
  const { input } = args;

  try {
    await physicianAssessmentMutationSchema.validate(input);
  } catch (err) {
    if (err instanceof ValidationError) {
      return {
        ok: false,
        error: err.message,
      };
    }

    // Unknown error
    logger.error({ error: err }, 'Unknown error');
    throw new ApolloError('Application physician assessment was unable to be updated');
  }

  const { id, patientCondition, mobilityAids, permitType, ...validatedData } = input;

  // Prevent reviewed requests from being updated
  const application = await prisma.application.findUnique({
    where: { id },
    select: {
      type: true,
      applicationProcessing: {
        select: {
          reviewRequestCompleted: true,
        },
      },
    },
  });

  if (!application) {
    return { ok: false, error: `Application with ID ${id} not found` };
  }

  if (application.applicationProcessing.reviewRequestCompleted) {
    return { ok: false, error: 'Reviewed requests cannot be updated' };
  }

  if (application.type !== 'NEW') {
    return { ok: false, error: 'Application must be a new application' };
  }

  let updatedApplication;
  try {
    updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        newApplication: {
          update: {
            patientCondition: patientCondition || [],
            mobilityAids: mobilityAids || [],
            ...validatedData,
          },
        },
        permitType: permitType,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        error: err.message,
      };
    }

    // Unknown error
    logger.error({ error: err }, 'Unknown error');
  }

  if (!updatedApplication) {
    throw new ApolloError('Application physician assessment was unable to be updated');
  }

  return { ok: true, error: null };
};

/**
 * Delete an application
 * @returns status of operation (ok)
 */
export const deleteApplication: Resolver<MutationDeleteApplicationArgs, DeleteApplicationResult> =
  async (_parent, args, { prisma, logger }) => {
    const id = args.input.id;

    const application = await prisma.application.findUnique({
      where: {
        id,
      },
    });

    if (!application) {
      return { ok: false, error: `Application with ID ${id} not found` };
    }

    try {
      const deleteApplicationOperation = prisma.application.deleteMany({
        where: {
          id,
        },
      });

      const deleteApplicationProcessingOperation = prisma.applicationProcessing.deleteMany({
        where: {
          id: application.applicationProcessingId,
        },
      });

      const deleteNewApplicationOperation = prisma.newApplication.deleteMany({
        where: {
          applicationId: id,
        },
      });

      const deletePermitOperation = prisma.permit.deleteMany({
        where: {
          applicationId: id,
        },
      });

      const deleteRenewalApplicationOperation = prisma.renewalApplication.deleteMany({
        where: {
          applicationId: id,
        },
      });

      const deleteReplacementApplicationOperation = prisma.replacementApplication.deleteMany({
        where: {
          applicationId: id,
        },
      });

      await prisma.$transaction([
        deleteNewApplicationOperation,
        deleteRenewalApplicationOperation,
        deleteReplacementApplicationOperation,
        deletePermitOperation,
        deleteApplicationOperation,
        deleteApplicationProcessingOperation,
      ]);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return {
          ok: false,
          error: err.message,
        };
      }

      // Unknown error
      logger.error({ error: err }, 'Unknown error occurred when attempting to delete application');
      throw new ApolloError('Unable to delete application after encountering unknown error');
    }

    return { ok: true, error: null };
  };
