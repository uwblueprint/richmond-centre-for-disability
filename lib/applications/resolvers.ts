import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Prisma } from '@prisma/client'; // Prisma client
import { Resolver } from '@lib/resolvers'; // Resolver type
import {
  ShopifyConfirmationNumberAlreadyExistsError,
  ApplicantIdDoesNotExistError,
  ApplicationFieldTooLongError,
  ApplicationNotFoundError,
  UpdatedFieldsMissingError,
} from '@lib/applications/errors'; // Application errors
import { ApplicantNotFoundError } from '@lib/applicants/errors'; // Applicant errors
import { DBErrorCode, getUniqueConstraintFailedFields } from '@lib/db/errors'; // Database errors
import { SortOrder } from '@tools/types'; // Sorting type
import { PaymentType } from '@lib/graphql/types'; // GraphQL types
import { formatPhoneNumber, formatPostalCode } from '@lib/utils/format'; // Formatting utils

/**
 * Query an application by ID
 * @returns Application with given ID
 */
export const application: Resolver = async (_parent, args, { prisma }) => {
  const application = await prisma.application.findUnique({ where: { id: parseInt(args.id) } });
  return application;
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
export const applications: Resolver = async (_parent, { filter }, { prisma }) => {
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
    let userIDSearch, firstSearch, middleSearch, lastSearch, nameFilters;

    if (parseInt(search)) {
      userIDSearch = parseInt(search);
    } else if (search) {
      // Split search to first, middle and last name elements
      [firstSearch, middleSearch, lastSearch] = search?.split(' ');

      // If all search elements are present, search by each respectively
      // search by first AND middle AND last
      if (firstSearch && middleSearch && lastSearch) {
        nameFilters = {
          AND: [
            { firstName: { equals: firstSearch, mode: 'insensitive' } },
            { middleName: { equals: middleSearch, mode: 'insensitive' } },
            { lastName: { equals: lastSearch, mode: 'insensitive' } },
          ],
        };
        // If there are only two search elements, second element can correspond to either the middle or last name
        // search by first AND (middle OR last)
      } else if (firstSearch && middleSearch) {
        nameFilters = {
          firstName: { equals: firstSearch, mode: 'insensitive' },
          OR: [
            { middleName: { equals: middleSearch, mode: 'insensitive' } },
            { lastName: { equals: middleSearch, mode: 'insensitive' } },
          ],
        };
        // If there is only one search element, it can correspond to the first, middle or last name
        // search by first OR middle OR last
      } else {
        nameFilters = {
          OR: [
            { firstName: { equals: firstSearch, mode: 'insensitive' } },
            { middleName: { equals: firstSearch, mode: 'insensitive' } },
            { lastName: { equals: firstSearch, mode: 'insensitive' } },
          ],
        };
      }
    }

    // Parse sorting order
    if (order && order.length > 0) {
      const sortingOrder: Array<Record<string, SortOrder>> = [];
      order.forEach(([field, order]: [string, SortOrder]) => {
        if (field === 'name') {
          // Primary sort is by first name and secondary sort is by last name
          sortingOrder.push({ firstName: order });
          sortingOrder.push({ lastName: order });
        } else if (field === 'dateReceived') {
          sortingOrder.push({ createdAt: order });
        }
      });
      orderBy = sortingOrder;
    }

    where = {
      applicant: {
        id: userIDSearch,
      },
      applicationProcessing: {
        status: status,
      },
      isRenewal: requestType ? requestType === 'Renewal' : undefined,
      permitType: permitType,
      ...nameFilters,
    };
  }

  // Get number of applications with desired filters
  const applicationsCount = await prisma.application.count({
    where,
  });

  // Get applications with filter, sorting, pagination
  const applications = await prisma.application.findMany({
    skip: filter?.offset || 0,
    take: filter?.limit || 20,
    orderBy: orderBy,
    where,
    include: {
      applicationProcessing: true,
    },
  });

  return {
    result: applications,
    totalCount: applicationsCount,
  };
};

/**
 * Create an RCD application
 * @returns Status of operation (ok, error)
 */
export const createApplication: Resolver = async (_, args, { prisma }) => {
  const {
    input: { applicantId, shopifyConfirmationNumber },
  } = args;

  let application;
  try {
    application = await prisma.application.create({
      data: {
        ...args.input,
        applicant: {
          connect: { id: applicantId },
        },
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (
        err.code === DBErrorCode.UniqueConstraintFailed &&
        getUniqueConstraintFailedFields(err)?.includes('shopifyConfirmationNumber')
      ) {
        throw new ShopifyConfirmationNumberAlreadyExistsError(
          `Application with Shopify confirmation number ${shopifyConfirmationNumber} already exists`
        );
      } else if (
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

  // Throw internal server error if application was not created
  if (!application) {
    throw new ApolloError('Application was unable to be created');
  }

  return {
    ok: true,
  };
};

/**
 * Updates the Application object with the optional values provided
 * @returns Status of operation (ok, error)
 */
export const updateApplication: Resolver = async (_, args, { prisma }) => {
  const { input } = args;
  const { id, ...rest } = input;

  let application;
  try {
    application = await prisma.application.update({
      where: { id: parseInt(id) },
      data: {
        ...rest,
      },
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === DBErrorCode.RecordNotFound
    ) {
      throw new ApplicationNotFoundError(`Application with ID ${id} not found`);
    }
  }

  // Throw internal server error if application processing object was not updated
  if (!application) {
    throw new ApolloError('Application was unable to be updated');
  }

  return {
    ok: true,
  };
};

/**
 * Create a renewal application
 * Requires updated field values to be provided if any of personal address, contact, or doctor info are updated.
 * @returns Status of operation (ok)
 */
export const createRenewalApplication: Resolver = async (_, args, { prisma }) => {
  const {
    input: {
      applicantId,
      updatedAddress,
      addressLine1,
      addressLine2,
      city,
      postalCode,
      updatedContactInfo,
      phone,
      email,
      updatedPhysician,
      physicianName,
      physicianMspNumber,
      physicianAddressLine1,
      physicianAddressLine2,
      physicianCity,
      physicianPostalCode,
      physicianPhone,
    },
  } = args;

  // Validate that fields are present if address, contact info, or doctor are updated
  // Validate updated address fields
  if (updatedAddress && (!addressLine1 || !city || !postalCode)) {
    throw new UpdatedFieldsMissingError('Missing updated personal address fields');
  }

  // Validate updated contact info fields (at least one of phone or email must be provided)
  if (updatedContactInfo && !phone && !email) {
    throw new UpdatedFieldsMissingError('Missing updated contact info fields');
  }

  // Validate updated doctor info fields
  if (
    updatedPhysician &&
    (!physicianName ||
      !physicianMspNumber ||
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

  // Temporary Shopify confirmation number placeholder
  // TODO: Integrate with Shopify payments
  const currentDateTime = new Date().getTime().toString();
  const shopifyConfirmationNumber = currentDateTime.substr(currentDateTime.length - 7);

  let application;
  try {
    application = await prisma.application.create({
      data: {
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        dateOfBirth: applicant.dateOfBirth,
        gender: applicant.gender,
        customGender: applicant.customGender,
        email: updatedContactInfo && email ? email : applicant.email,
        phone: updatedContactInfo && phone ? formatPhoneNumber(phone) : applicant.phone,
        province: applicant.province,
        city: updatedAddress && city ? city : applicant.city,
        addressLine1: updatedAddress && addressLine1 ? addressLine1 : applicant.addressLine1,
        addressLine2: updatedAddress && addressLine2 ? addressLine2 : applicant.addressLine2,
        postalCode:
          updatedAddress && postalCode ? formatPostalCode(postalCode) : applicant.postalCode,
        isRenewal: true,
        // TODO: Link with Shopify checkout
        shopifyConfirmationNumber,
        processingFee: 26,
        paymentMethod: PaymentType.Cash,
        // TODO: Modify logic when DB schema gets changed (medicalInfo is not undefined)
        disability: applicant.medicalInformation?.disability || 'Placeholder disability',
        physicianName: updatedPhysician ? physicianName : physician.name,
        physicianMspNumber: updatedPhysician ? physicianMspNumber : physician.mspNumber,
        physicianAddressLine1: updatedPhysician ? physicianAddressLine1 : physician.addressLine1,
        physicianAddressLine2: updatedPhysician ? physicianAddressLine2 : physician.addressLine2,
        physicianCity: updatedPhysician ? physicianCity : physician.city,
        physicianPostalCode: updatedPhysician ? physicianPostalCode : physician.postalCode,
        physicianPhone: updatedPhysician ? physicianPhone : physician.phone,
        physicianProvince: physician.province,
        applicant: {
          connect: {
            id: applicantId,
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
        err.code === DBErrorCode.UniqueConstraintFailed &&
        getUniqueConstraintFailedFields(err)?.includes('shopifyConfirmationNumber')
      ) {
        throw new ShopifyConfirmationNumberAlreadyExistsError(
          `Application with Shopify confirmation number ${shopifyConfirmationNumber} already exists`
        );
      } else if (
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
  };
};
