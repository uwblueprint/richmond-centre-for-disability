import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Prisma } from '@prisma/client'; // Prisma client
import { Resolver } from '@lib/graphql/resolvers'; // Resolver type
import {
  ApplicantIdDoesNotExistError,
  ApplicationFieldTooLongError,
  UpdatedFieldsMissingError,
  EmptyFieldsMissingError,
} from '@lib/applications/errors'; // Application errors
import { ApplicantNotFoundError } from '@lib/applicants/errors'; // Applicant errors
import { DBErrorCode, getUniqueConstraintFailedFields } from '@lib/db/errors'; // Database errors
import { SortOrder } from '@tools/types'; // Sorting type
import { formatPhoneNumber, formatFullName, formatPostalCode } from '@lib/utils/format'; // Formatting utils
import {
  Application,
  CreateExternalRenewalApplicationResult,
  CreateNewApplicationResult,
  CreateRenewalApplicationResult,
  CreateReplacementApplicationResult,
  MutationCreateExternalRenewalApplicationArgs,
  MutationCreateNewApplicationArgs,
  MutationCreateRenewalApplicationArgs,
  MutationCreateReplacementApplicationArgs,
  MutationUpdateApplicationAdditionalInformationArgs,
  MutationUpdateApplicationDoctorInformationArgs,
  MutationUpdateApplicationGeneralInformationArgs,
  MutationUpdateApplicationPaymentInformationArgs,
  MutationUpdateApplicationPhysicianAssessmentArgs,
  MutationUpdateApplicationReasonForReplacementArgs,
  NewApplication,
  QueryApplicationArgs,
  QueryApplicationsArgs,
  RenewalApplication,
  ReplacementApplication,
  UpdateApplicationAdditionalInformationResult,
  UpdateApplicationDoctorInformationResult,
  UpdateApplicationGeneralInformationResult,
  UpdateApplicationPaymentInformationResult,
  UpdateApplicationPhysicianAssessmentResult,
  UpdateApplicationReasonForReplacementResult,
} from '@lib/graphql/types';
import { flattenApplication } from '@lib/applications/utils';
import { MutationUpdateNewApplicationGeneralInformationArgs } from '@lib/graphql/types';

/**
 * Query an application by ID
 * @returns Application with given ID
 */
export const application: Resolver<
  QueryApplicationArgs,
  Omit<NewApplication | RenewalApplication | ReplacementApplication, 'processing' | 'applicant'>
> = async (_parent, args, { prisma }) => {
  const { id } = args;
  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      newApplication: true,
      renewalApplication: true,
      replacementApplication: true,
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
  { result: Array<Omit<Application, 'processing' | 'applicant'>>; totalCount: number }
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
> = async (_, args, { prisma }) => {
  // TODO: Validation
  const { input } = args;
  const {
    dateOfBirth,
    gender,
    otherGender,
    postalCode,
    disability,
    disabilityCertificationDate,
    patientCondition,
    mobilityAids,
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
    poaFormUrl,
    usesAccessibleConvertedVan,
    accessibleConvertedVanLoadingMethod,
    requiresWiderParkingSpace,
    requiresWiderParkingSpaceReason,
    otherRequiresWiderParkingSpaceReason,
    donationAmount,
    shippingPostalCode,
    billingPostalCode,
    applicantId,
    ...data
  } = input;

  if (!process.env.PROCESSING_FEE) {
    throw new Error('Processing fee not defined');
  }

  let application;
  try {
    application = await prisma.application.create({
      data: {
        type: 'NEW',
        processingFee: process.env.PROCESSING_FEE,
        donationAmount: donationAmount || 0,
        // Connect to applicant if applicant exists in DB
        ...(applicantId && {
          applicant: {
            connect: { id: applicantId },
          },
        }),
        ...data,
        postalCode: formatPostalCode(postalCode),
        shippingPostalCode: shippingPostalCode ? formatPostalCode(shippingPostalCode) : undefined,
        billingPostalCode: billingPostalCode ? formatPostalCode(billingPostalCode) : undefined,
        newApplication: {
          create: {
            dateOfBirth,
            gender,
            otherGender,
            disability,
            disabilityCertificationDate,
            patientCondition,
            mobilityAids: mobilityAids || [],
            otherPatientCondition,
            temporaryPermitExpiry,
            physicianFirstName,
            physicianLastName,
            physicianMspNumber,
            physicianPhone,
            physicianAddressLine1,
            physicianAddressLine2,
            physicianCity,
            physicianPostalCode: formatPostalCode(physicianPostalCode),
            ...(omitGuardianPoa && {
              guardianFirstName,
              guardianMiddleName,
              guardianLastName,
              guardianPhone,
              guardianRelationship,
              guardianAddressLine1,
              guardianAddressLine2,
              guardianCity,
              guardianPostalCode: guardianPostalCode
                ? formatPostalCode(guardianPostalCode)
                : undefined,
              poaFormUrl,
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
    // TODO: Handle errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === DBErrorCode.LengthConstraintFailed) {
        throw new ApplicationFieldTooLongError(
          'Length constraint failed, provided value too long for an application field.'
        );
      }
    }
  }

  // Throw internal server error if application was not created
  if (!application) {
    throw new ApolloError('Application was unable to be created');
  }

  return {
    ok: true,
    applicationId: application.id,
  };
};

/**
 * Create a renewal application internally (via RCD-facing portal)
 * @returns Status of operation (ok)
 */
export const createRenewalApplication: Resolver<
  MutationCreateRenewalApplicationArgs,
  CreateRenewalApplicationResult
> = async (_, args, { prisma }) => {
  // TODO: Validation
  const { input } = args;
  const {
    applicantId,
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
    shippingPostalCode,
    billingPostalCode,
    ...data
  } = input;

  if (!process.env.PROCESSING_FEE) {
    throw new Error('Processing fee not defined');
  }

  let createdRenewalApplication;
  try {
    createdRenewalApplication = await prisma.application.create({
      data: {
        type: 'RENEWAL',
        processingFee: process.env.PROCESSING_FEE,
        donationAmount: donationAmount || 0,
        ...data,
        postalCode: formatPostalCode(postalCode),
        shippingPostalCode: shippingPostalCode ? formatPostalCode(shippingPostalCode) : undefined,
        billingPostalCode: billingPostalCode ? formatPostalCode(billingPostalCode) : undefined,
        applicant: {
          connect: { id: applicantId },
        },
        renewalApplication: {
          create: {
            physicianFirstName,
            physicianLastName,
            physicianMspNumber,
            physicianPhone,
            physicianAddressLine1,
            physicianAddressLine2,
            physicianCity,
            physicianPostalCode: formatPostalCode(physicianPostalCode),
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
  } catch {
    // TODO: Handle errors
  }

  if (!createdRenewalApplication) {
    throw new ApolloError('Renewal application was unable to be created');
  }

  return { ok: true, applicationId: createdRenewalApplication.id };
};

/**
 * Create a renewal application externally (via applicant-facing portal)
 * Requires updated field values to be provided if any of personal address, contact, or doctor info are updated.
 * @returns Status of operation (ok) and application id of new renewal application
 */
export const createExternalRenewalApplication: Resolver<
  MutationCreateExternalRenewalApplicationArgs,
  CreateExternalRenewalApplicationResult
> = async (_, args, { prisma }) => {
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

  if (!process.env.PROCESSING_FEE) {
    throw new Error('Processing fee not defined');
  }

  // TODO: Improve validation

  // Validate that fields are present if address, contact info, or doctor are updated
  // Validate updated address fields
  if (updatedAddress && (!addressLine1 || !city || !postalCode)) {
    throw new UpdatedFieldsMissingError('Missing updated personal address fields');
  }

  // Validate updated contact info fields (at least one of phone or email must be provided)
  if (updatedContactInfo && !phone) {
    throw new UpdatedFieldsMissingError('Missing updated contact info fields');
  }

  // Validate updated doctor info fields
  if (
    updatedPhysician &&
    (!physicianFirstName ||
      !physicianLastName ||
      !physicianMspNumber ||
      !physicianPhone ||
      !physicianAddressLine1 ||
      !physicianCity ||
      !physicianPostalCode)
  ) {
    throw new UpdatedFieldsMissingError('Missing updated physician fields');
  }

  // Retrieve applicant record
  const applicant = await prisma.applicant.findUnique({
    where: { id: applicantId },
    include: { medicalInformation: { include: { physician: true } } },
  });

  // If applicant not found, throw error
  if (!applicant) {
    throw new ApplicantNotFoundError(`No applicant with ID ${applicantId} was found`);
  }

  const physician = applicant.medicalInformation.physician;

  // TODO: Integrate with Shopify payments

  let application;
  try {
    application = await prisma.application.create({
      data: {
        type: 'RENEWAL',
        firstName: applicant.firstName,
        middleName: applicant.middleName,
        lastName: applicant.lastName,
        phone: updatedContactInfo && phone ? formatPhoneNumber(phone) : applicant.phone,
        email: updatedContactInfo ? email || null : applicant.email,
        receiveEmailUpdates: updatedContactInfo
          ? receiveEmailUpdates
          : applicant.receiveEmailUpdates,
        addressLine1: updatedAddress && addressLine1 ? addressLine1 : applicant.addressLine1,
        addressLine2: updatedAddress ? addressLine2 : applicant.addressLine2,
        city: updatedAddress && city ? city : applicant.city,
        postalCode:
          updatedAddress && postalCode ? formatPostalCode(postalCode) : applicant.postalCode,
        processingFee: process.env.PROCESSING_FEE,
        donationAmount: 0, // ? Investigate
        paymentMethod: 'SHOPIFY',
        // TODO: Replace shipping info with Shopify checkout inputs
        shippingAddressSameAsHomeAddress: true,
        shippingFullName: formatFullName(
          applicant.firstName,
          applicant.middleName,
          applicant.lastName
        ),
        shippingAddressLine1: applicant.addressLine1,
        shippingAddressLine2: applicant.addressLine2,
        shippingCity: applicant.city,
        shippingProvince: applicant.province,
        shippingCountry: applicant.country,
        shippingPostalCode: applicant.postalCode,
        // TODO: Replace billing info with Shopify checkout inputs
        billingAddressSameAsHomeAddress: true,
        billingFullName: formatFullName(
          applicant.firstName,
          applicant.middleName,
          applicant.lastName
        ),
        billingAddressLine1: applicant.addressLine1,
        billingAddressLine2: applicant.addressLine2,
        billingCity: applicant.city,
        billingProvince: applicant.province,
        billingCountry: applicant.country,
        billingPostalCode: applicant.postalCode,
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
            physicianPhone: updatedPhysician && physicianPhone ? physicianPhone : physician.phone,
            physicianAddressLine1:
              updatedPhysician && addressLine1 ? addressLine1 : physician.addressLine1,
            physicianAddressLine2: updatedPhysician
              ? physicianAddressLine2
              : physician.addressLine2,
            physicianCity: updatedPhysician && physicianCity ? physicianCity : physician.city,
            physicianPostalCode:
              updatedPhysician && physicianPostalCode
                ? formatPostalCode(physicianPostalCode)
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
        throw new ApplicantIdDoesNotExistError(`Applicant ID ${applicantId} does not exist`);
      } else if (err.code === DBErrorCode.LengthConstraintFailed) {
        throw new ApplicationFieldTooLongError(
          'Length constraint failed, provided value too long for an application field.'
        );
      }
    }
  }

  // Throw internal server error if renewal application was not created
  if (!application) {
    throw new ApolloError('Application was unable to be created');
  }

  return {
    ok: true,
    applicationId: application.id,
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
> = async (_, args, { prisma }) => {
  // TODO: Validation
  const { input } = args;
  const {
    applicantId,
    postalCode,
    reason,
    lostTimestamp,
    lostLocation,
    stolenPoliceFileNumber,
    stolenJurisdiction,
    stolenPoliceOfficerName,
    eventDescription,
    donationAmount,
    shippingPostalCode,
    billingPostalCode,
    ...data
  } = input;

  if (!process.env.PROCESSING_FEE) {
    throw new Error('Processing fee not defined');
  }

  // Retrieve applicant record
  const applicant = await prisma.applicant.findUnique({
    where: { id: applicantId },
  });

  // If applicant not found, throw error
  if (!applicant) {
    throw new ApplicantNotFoundError(`No applicant with ID ${applicantId} was found`);
  }

  if (!reason) throw new EmptyFieldsMissingError('No reason for the replacement was given.');

  let application;
  try {
    application = await prisma.application.create({
      data: {
        type: 'REPLACEMENT',
        processingFee: process.env.PROCESSING_FEE,
        donationAmount: donationAmount || 0,
        postalCode: formatPostalCode(postalCode),
        shippingPostalCode: shippingPostalCode ? formatPostalCode(shippingPostalCode) : undefined,
        billingPostalCode: billingPostalCode ? formatPostalCode(billingPostalCode) : undefined,
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
    // TODO: Handle more errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (
        err.code === DBErrorCode.ForeignKeyConstraintFailed &&
        getUniqueConstraintFailedFields(err)?.includes('applicantId')
      ) {
        throw new ApplicantIdDoesNotExistError(`Applicant ID ${applicantId} does not exist`);
      } else if (err.code === DBErrorCode.LengthConstraintFailed) {
        throw new ApplicationFieldTooLongError(
          'Length constraint failed, provided value too long for an application field.'
        );
      }
    }
  }

  // Throw internal server error if renewal application was not created
  if (!application) {
    throw new ApolloError('Application was unable to be created');
  }

  return {
    ok: true,
    applicationId: application.id,
  };
};

/**
 * Update the general information section of an application
 * @returns Status of the operation (ok)
 */
export const updateApplicationGeneralInformation: Resolver<
  MutationUpdateApplicationGeneralInformationArgs,
  UpdateApplicationGeneralInformationResult
> = async (_parent, args, { prisma }) => {
  // TODO: Validation
  const { input } = args;
  const { id, receiveEmailUpdates, postalCode, ...data } = input;

  let updatedApplication;
  try {
    updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        // Only set to `undefined` if `receiveEmailUpdates` is null
        receiveEmailUpdates: receiveEmailUpdates ?? undefined,
        postalCode: formatPostalCode(postalCode),
        ...data,
      },
    });
  } catch {
    // TODO: Error handling
  }

  if (!updatedApplication) {
    throw new ApolloError('Application general information was unable to be created');
  }

  return { ok: true };
};

/**
 * Update the general information section of an application
 * @returns Status of the operation (ok)
 */
export const updateNewApplicationGeneralInformation: Resolver<
  MutationUpdateNewApplicationGeneralInformationArgs,
  UpdateApplicationGeneralInformationResult
> = async (_parent, args, { prisma }) => {
  // TODO: Validation
  const { input } = args;
  const { id, receiveEmailUpdates, postalCode, dateOfBirth, gender, otherGender, ...data } = input;

  let updatedApplication;
  try {
    updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        // Only set to `undefined` if `receiveEmailUpdates` is null
        receiveEmailUpdates: receiveEmailUpdates ?? undefined,
        postalCode: formatPostalCode(postalCode),
        newApplication: {
          update: {
            dateOfBirth,
            gender,
            otherGender: otherGender ?? undefined,
          },
        },
        ...data,
      },
    });
  } catch (err) {
    // TODO: Error handling
  }

  if (!updatedApplication) {
    throw new ApolloError('Application general information was unable to be created');
  }

  return { ok: true };
};

/**
 * Update the doctor information section of an application
 * @returns Status of the operation (ok)
 */
export const updateApplicationDoctorInformation: Resolver<
  MutationUpdateApplicationDoctorInformationArgs,
  UpdateApplicationDoctorInformationResult
> = async (_parent, args, { prisma }) => {
  // TODO: Validation
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

  const application = await prisma.application.findUnique({
    where: { id },
    select: { type: true },
  });

  if (!application) {
    throw new ApolloError('Application not found');
  }

  const { type } = application;

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
              physicianPhone,
              physicianAddressLine1,
              physicianAddressLine2,
              physicianCity,
              physicianPostalCode: formatPostalCode(physicianPostalCode),
            },
          },
        }),
        ...(type === 'RENEWAL' && {
          renewalApplication: {
            update: {
              physicianFirstName,
              physicianLastName,
              physicianMspNumber,
              physicianPhone,
              physicianAddressLine1,
              physicianAddressLine2,
              physicianCity,
              physicianPostalCode: formatPostalCode(physicianPostalCode),
            },
          },
        }),
      },
    });
  } catch {
    // TODO: Error handling
  }

  if (!updatedApplication) {
    throw new ApolloError('Application doctor information was unable to be created');
  }

  return { ok: true };
};

/**
 * Update the additional information section of an application
 * @returns Status of the operation (ok)
 */
export const updateApplicationAdditionalInformation: Resolver<
  MutationUpdateApplicationAdditionalInformationArgs,
  UpdateApplicationAdditionalInformationResult
> = async (_parent, args, { prisma }) => {
  // TODO: Validation
  const { input } = args;
  const { id, ...data } = input;

  // Get existing application type (should be NEW/RENEWAL)
  const application = await prisma.application.findUnique({
    where: { id },
    select: { type: true },
  });
  if (!application) {
    // TODO: Improve validation
    throw new ApolloError('Application not found');
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
      throw new ApolloError('Replacement application cannot have additional information updated');
    }
  } catch {
    // TODO: Error handling
  }

  if (!updatedApplication) {
    throw new ApolloError('Application additional information was unable to be created');
  }

  return { ok: true };
};

/**
 * Update the payment information section of an application
 * @returns Status of the operation (ok)
 */
export const updateApplicationPaymentInformation: Resolver<
  MutationUpdateApplicationPaymentInformationArgs,
  UpdateApplicationPaymentInformationResult
> = async (_parent, args, { prisma }) => {
  // TODO: Validation
  const { input } = args;
  const { id, donationAmount, shippingPostalCode, billingPostalCode, ...data } = input;

  let updatedApplication;
  try {
    updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        donationAmount: donationAmount || 0,
        shippingPostalCode: shippingPostalCode ? formatPostalCode(shippingPostalCode) : undefined,
        billingPostalCode: billingPostalCode ? formatPostalCode(billingPostalCode) : undefined,
        ...data,
      },
    });
  } catch {
    // TODO: Error handling
  }

  if (!updatedApplication) {
    throw new ApolloError('Application payment information was unable to be updated');
  }

  return { ok: true };
};

/**
 * Update the reason for replacement section of a replacement application
 * @returns Status of the operation (ok)
 */
export const updateApplicationReasonForReplacement: Resolver<
  MutationUpdateApplicationReasonForReplacementArgs,
  UpdateApplicationReasonForReplacementResult
> = async (_parent, args, { prisma }) => {
  // TODO: Validation
  const { input } = args;
  const { id, ...data } = input;

  let updatedApplication;
  try {
    updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        replacementApplication: {
          update: data,
        },
      },
    });
  } catch {
    // TODO: Error handling
  }

  if (!updatedApplication) {
    throw new ApolloError('Application reason for replacement was unable to be created');
  }

  return { ok: true };
};

/**
 * Update the physician assessment section of a new application
 * @returns Status of the operation (ok)
 */
export const updateApplicationPhysicianAssessment: Resolver<
  MutationUpdateApplicationPhysicianAssessmentArgs,
  UpdateApplicationPhysicianAssessmentResult
> = async (_parent, args, { prisma }) => {
  // TODO: Validation
  const { input } = args;
  const { id, mobilityAids, ...data } = input;

  let updatedApplication;
  try {
    updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        newApplication: {
          update: {
            mobilityAids: mobilityAids || [],
            ...data,
          },
        },
      },
    });
  } catch {
    // TODO: Error handling
  }

  if (!updatedApplication) {
    throw new ApolloError('Application physician assessment was unable to be created');
  }

  return { ok: true };
};
