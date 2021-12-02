import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Prisma } from '@prisma/client'; // Prisma client
import { Resolver } from '@lib/resolvers'; // Resolver type
import {
  ShopifyConfirmationNumberAlreadyExistsError,
  ApplicantIdDoesNotExistError,
  ApplicationFieldTooLongError,
  ApplicationNotFoundError,
  UpdatedFieldsMissingError,
  EmptyFieldsMissingError,
} from '@lib/applications/errors'; // Application errors
import { ApplicantNotFoundError } from '@lib/applicants/errors'; // Applicant errors
import { DBErrorCode, getUniqueConstraintFailedFields } from '@lib/db/errors'; // Database errors
import { SortOrder } from '@tools/types'; // Sorting type
import { ApplicationsReportColumn, PaymentType } from '@lib/graphql/types'; // GraphQL types
import { formatPhoneNumber, formatPostalCode } from '@lib/utils/format'; // Formatting utils
import { createObjectCsvWriter } from 'csv-writer';

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
    let rcdUserIDSearch, firstSearch, middleSearch, lastSearch, nameFilters;

    if (parseInt(search)) {
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
      rcdUserId: rcdUserIDSearch,
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
 * @returns Status of operation (ok) and application id of new renewal application
 */
export const createRenewalApplication: Resolver = async (_, args, { prisma }) => {
  const {
    input: {
      applicantId,
      updatedAddress,
      firstName,
      lastName,
      addressLine1,
      addressLine2,
      city,
      postalCode,
      updatedContactInfo,
      phone,
      email,
      rcdUserId,
      updatedPhysician,
      physicianName,
      physicianMspNumber,
      physicianAddressLine1,
      physicianAddressLine2,
      physicianCity,
      physicianPostalCode,
      physicianPhone,
      usesAccessibleConvertedVan,
      requiresWiderParkingSpace,
      shippingFullName,
      shippingAddressLine1,
      shippingAddressLine2,
      shippingCity,
      shippingProvince,
      shippingPostalCode,
      billingFullName,
      billingAddressLine1,
      billingAddressLine2,
      billingCity,
      billingProvince,
      billingPostalCode,
      shippingAddressSameAsHomeAddress,
      billingAddressSameAsHomeAddress,
      donationAmount,
      paymentMethod,
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

  const applicantFirstName = firstName || applicant.firstName;
  const applicantLastName = lastName || applicant.lastName;
  const applicantEmail = updatedContactInfo ? email : applicant.email;
  const applicantCity = updatedAddress && city ? city : applicant.city;
  const applicantAddressLine1 =
    updatedAddress && addressLine1 ? addressLine1 : applicant.addressLine1;
  const applicantAddressLine2 =
    updatedAddress && addressLine2 ? addressLine2 : applicant.addressLine2;
  const applicantPostalCode =
    updatedAddress && postalCode ? formatPostalCode(postalCode) : applicant.postalCode;

  let application;
  try {
    application = await prisma.application.create({
      data: {
        firstName: applicantFirstName,
        lastName: applicantLastName,
        dateOfBirth: applicant.dateOfBirth,
        gender: applicant.gender,
        customGender: applicant.customGender,
        email: applicantEmail,
        phone: updatedContactInfo && phone ? formatPhoneNumber(phone) : applicant.phone,
        province: applicant.province,
        city: applicantCity,
        addressLine1: applicantAddressLine1,
        addressLine2: applicantAddressLine2,
        postalCode: applicantPostalCode,
        rcdUserId: rcdUserId || applicant.rcdUserId,
        isRenewal: true,
        // TODO: Link with Shopify checkout
        shopifyConfirmationNumber,
        processingFee: 26,
        donationAmount,
        paymentMethod: paymentMethod || PaymentType.Cash,
        // TODO: Modify logic when DB schema gets changed (medicalInfo is not undefined)
        disability: applicant.medicalInformation?.disability || 'Placeholder disability',
        physicianName: updatedPhysician ? physicianName : physician.name,
        physicianMspNumber: updatedPhysician ? physicianMspNumber : physician.mspNumber,
        physicianAddressLine1: updatedPhysician ? physicianAddressLine1 : physician.addressLine1,
        physicianAddressLine2: updatedPhysician ? physicianAddressLine2 : physician.addressLine2,
        physicianCity: updatedPhysician ? physicianCity : physician.city,
        physicianPostalCode: updatedPhysician
          ? formatPostalCode(physicianPostalCode)
          : physician.postalCode,
        physicianPhone: updatedPhysician ? physicianPhone : physician.phone,
        physicianProvince: physician.province,
        shippingAddressSameAsHomeAddress,
        billingAddressSameAsHomeAddress,
        shippingFullName: shippingAddressSameAsHomeAddress
          ? `${applicantFirstName} ${applicantLastName}`
          : shippingFullName,
        shippingAddressLine1: shippingAddressSameAsHomeAddress
          ? applicantAddressLine1
          : shippingAddressLine1,
        shippingAddressLine2: shippingAddressSameAsHomeAddress
          ? applicantAddressLine2
          : shippingAddressLine2,
        shippingCity: shippingAddressSameAsHomeAddress ? applicantCity : shippingCity,
        shippingPostalCode: shippingAddressSameAsHomeAddress
          ? applicantPostalCode
          : formatPostalCode(shippingPostalCode),
        shippingProvince,
        billingFullName: billingAddressSameAsHomeAddress
          ? `${applicantFirstName} ${applicantLastName}`
          : billingFullName,
        billingAddressLine1: billingAddressSameAsHomeAddress
          ? applicantAddressLine1
          : billingAddressLine1,
        billingAddressLine2: billingAddressSameAsHomeAddress
          ? applicantAddressLine2
          : billingAddressLine2,
        billingCity: billingAddressSameAsHomeAddress ? applicantCity : billingCity,
        billingProvince,
        billingPostalCode: billingAddressSameAsHomeAddress
          ? applicantPostalCode
          : formatPostalCode(billingPostalCode),
        applicant: {
          connect: {
            id: applicantId,
          },
        },
        applicationProcessing: {
          create: {},
        },
        renewal: {
          create: {
            usesAccessibleConvertedVan,
            requiresWiderParkingSpace,
          },
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
    applicationId: application.id,
  };
};

/**
 * Create a replacement application
 * Requires updated field values to be provided if any of personal address, contact, or doctor info are updated.
 * @returns Status of operation (ok)
 */
export const createReplacementApplication: Resolver = async (_, args, { prisma }) => {
  const {
    input: {
      // Permit Holder Information Card
      applicantId,
      firstName,
      lastName,
      phone,
      email,
      addressLine1,
      addressLine2,
      city,
      postalCode,
      // Reason for Replacement Card
      reason,
      // date,
      lostTimestamp,
      lostLocation,
      description,
      // Payment, Shipping, and Billing Card
      paymentMethod,
      donationAmount,
      shippingAddressSameAsHomeAddress,
      shippingFullName,
      shippingAddressLine1,
      shippingAddressLine2,
      shippingCity,
      shippingProvince,
      shippingPostalCode,
      billingAddressSameAsHomeAddress,
      billingFullName,
      billingAddressLine1,
      billingAddressLine2,
      billingCity,
      billingProvince,
      billingPostalCode,
    },
  } = args;

  // Retrieve applicant record
  const applicant = await prisma.applicant.findUnique({
    where: { id: applicantId },
    include: {
      medicalInformation: {
        include: {
          physician: true,
        },
      },
    },
  });

  // If applicant not found, throw error
  if (!applicant) {
    throw new ApplicantNotFoundError(`No applicant with ID ${applicantId} was found`);
  }

  // Temporary Shopify confirmation number placeholder,
  // TODO: Integrate with Shopify payments
  const currentDateTime = new Date().getTime().toString();
  const shopifyConfirmationNumber = currentDateTime.substr(currentDateTime.length - 7);

  if (!reason)
    throw new EmptyFieldsMissingError('No reason for the replacement request was given.');

  let application;
  try {
    const physician = applicant.medicalInformation.physician;
    application = await prisma.application.create({
      data: {
        firstName,
        lastName,
        phone: formatPhoneNumber(phone),
        email: email || applicant.email,
        dateOfBirth: applicant.dateOfBirth,
        gender: applicant.gender,
        customGender: applicant.customGender,
        province: applicant.province,
        addressLine1,
        addressLine2,
        city,
        postalCode: formatPostalCode(postalCode),
        isRenewal: false,
        // TODO: Link with Shopify checkout
        shopifyConfirmationNumber,
        processingFee: 26,
        paymentMethod,
        disability: applicant.medicalInformation.disability,
        physicianName: physician.name,
        physicianMspNumber: physician.mspNumber,
        physicianAddressLine1: physician.addressLine1,
        physicianAddressLine2: physician.addressLine2,
        physicianCity: physician.city,
        physicianPostalCode: physician.postalCode,
        physicianPhone: physician.phone,
        physicianProvince: physician.province,
        donationAmount,
        shippingAddressSameAsHomeAddress,
        shippingFullName,
        shippingAddressLine1,
        shippingAddressLine2,
        shippingCity,
        shippingProvince,
        shippingPostalCode,
        billingAddressSameAsHomeAddress,
        billingFullName,
        billingAddressLine1,
        billingAddressLine2,
        billingCity,
        billingProvince,
        billingPostalCode,
        applicant: {
          connect: {
            id: applicantId,
          },
        },
        // TODO: Modify logic when DB schema gets changed (medicalInfo is not undefined)
        applicationProcessing: {
          create: {},
        },
        replacement: {
          create: {
            reason,
            lostTimestamp,
            lostLocation,
            description,
          },
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

export const generateApplicantsReport: Resolver = async (_, args, { prisma }) => {
  const {
    input: { startDate, endDate, columns },
  } = args;

  const columnsSet = new Set(columns);

  const applications = await prisma.application.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      rcdUserId: columnsSet.has(ApplicationsReportColumn.UserId),
      firstName: columnsSet.has(ApplicationsReportColumn.ApplicantName),
      middleName: columnsSet.has(ApplicationsReportColumn.ApplicantName),
      lastName: columnsSet.has(ApplicationsReportColumn.ApplicantName),
      dateOfBirth: columnsSet.has(ApplicationsReportColumn.ApplicantDateOfBirth),
      createdAt: columnsSet.has(ApplicationsReportColumn.ApplicationDate),
      paymentMethod: columnsSet.has(ApplicationsReportColumn.PaymentMethod),
      processingFee:
        columnsSet.has(ApplicationsReportColumn.FeeAmount) ||
        columnsSet.has(ApplicationsReportColumn.TotalAmount),
      donationAmount:
        columnsSet.has(ApplicationsReportColumn.DonationAmount) ||
        columnsSet.has(ApplicationsReportColumn.TotalAmount),
      permit: {
        select: {
          rcdPermitId: true,
        },
      },
    },
  });

  // Adds totalAmount, applicantName and rcdPermitId properties to allow for csv writing
  const csvApplications = applications.map(application => {
    return {
      ...application,
      applicantName:
        application.firstName +
        (application.middleName
          ? ` ${application.middleName} ${application.lastName}`
          : ` ${application.lastName}`),
      totalAmount: (application.processingFee || 0) + (application?.donationAmount || 0),
      rcdPermitId: application.permit?.rcdPermitId,
    };
  });

  const csvHeaders = [];

  if (columnsSet.has(ApplicationsReportColumn.UserId)) {
    csvHeaders.push({ id: 'rcdUserId', title: 'User ID' });
  }
  if (columnsSet.has(ApplicationsReportColumn.ApplicantName)) {
    csvHeaders.push({ id: 'applicantName', title: 'Applicant Name' });
  }
  if (columnsSet.has(ApplicationsReportColumn.ApplicantDateOfBirth)) {
    csvHeaders.push({ id: 'dateOfBirth', title: 'Applicant DoB' });
  }
  if (columnsSet.has(ApplicationsReportColumn.AppNumber)) {
    csvHeaders.push({ id: 'rcdPermitId', title: 'APP Number' });
  }
  if (columnsSet.has(ApplicationsReportColumn.ApplicationDate)) {
    csvHeaders.push({ id: 'createdAt', title: 'Application Date' });
  }
  if (columnsSet.has(ApplicationsReportColumn.PaymentMethod)) {
    csvHeaders.push({ id: 'paymentMethod', title: 'Payment Method' });
  }
  if (columnsSet.has(ApplicationsReportColumn.FeeAmount)) {
    csvHeaders.push({ id: 'processingFee', title: 'Fee Amount' });
  }
  if (columnsSet.has(ApplicationsReportColumn.DonationAmount)) {
    csvHeaders.push({ id: 'donationAmount', title: 'Donation Amount' });
  }
  if (columnsSet.has(ApplicationsReportColumn.TotalAmount)) {
    csvHeaders.push({ id: 'totalAmount', title: 'Total Amount' });
  }

  const csvWriter = createObjectCsvWriter({
    path: 'temp/file.csv',
    header: csvHeaders,
  });

  await csvWriter.writeRecords(csvApplications);

  return {
    ok: true,
  };
};
