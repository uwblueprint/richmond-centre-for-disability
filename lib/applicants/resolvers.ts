import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Resolver } from '@lib/resolvers'; // Resolver type
import {
  ApplicantAlreadyExistsError,
  ApplicantNotFoundError,
  RcdUserIdAlreadyExistsError,
} from '@lib/applicants/errors'; // Applicant errors
import { DBErrorCode } from '@lib/db/errors'; // Database errors
import { MspNumberDoesNotExistError } from '@lib/physicians/errors'; // Physician errors
import { formatPhoneNumber, formatPostalCode } from '@lib/utils/format'; // Formatting utils
import { PermitStatus } from '@lib/types';
import { DateUtils } from 'react-day-picker';
import { SortOrder } from '@tools/types';

/**
 * Query and filter RCD applicants from the internal facing app.
 *
 * Optional Filters:
 * - permitStatus: VALID, EXPIRED, EXPIRING_THIRTY
 * - userStatus: ACTIVE, INACTIVE
 * - expiryDateRangeFrom: Permit Expiry Date start
 * - expiryDateRangeTo: Permit Expiry Date end
 * - search: Search by first, middle, last name or by RCD user ID
 *
 * Pagination:
 * - offset: Number of results to skip, default 0
 * - limit: Number of result to return, default 20
 * @returns All RCD applicants that match the filter(s).
 */
export const applicants: Resolver = async (_parent, { filter }, { prisma }) => {
  let where = {};

  if (filter) {
    const {
      permitStatus = undefined,
      userStatus = undefined,
      expiryDateRangeFrom = undefined,
      expiryDateRangeTo = undefined,
      search = undefined,
    } = filter;

    let expiryDateUpperBound,
      expiryDateLowerBound,
      userIDSearch,
      firstSearch,
      lastSearch,
      middleSearch;

    if (parseInt(search)) {
      userIDSearch = parseInt(search);
    } else if (search) {
      [firstSearch, middleSearch, lastSearch] = search?.split(' ');
      middleSearch = middleSearch || firstSearch;
      lastSearch = lastSearch || middleSearch || firstSearch;
    }

    const TODAY = new Date();

    switch (permitStatus) {
      case PermitStatus.Valid:
        expiryDateLowerBound = TODAY;
        break;
      case PermitStatus.Expired:
        expiryDateUpperBound = TODAY;
        break;
      case PermitStatus.ExpiringThirty:
        expiryDateLowerBound = TODAY;
        expiryDateUpperBound = DateUtils.addMonths(TODAY, 1);
        break;
    }

    const containsPermitFilter = !!(permitStatus || expiryDateRangeFrom || expiryDateRangeTo);
    const permitFilter = containsPermitFilter
      ? {
          some: {
            expiryDate: { gte: expiryDateUpperBound, lte: expiryDateLowerBound },
            AND: [
              {
                expiryDate: { gte: expiryDateRangeFrom, lte: expiryDateRangeTo },
              },
            ],
          },
        }
      : undefined;

    where = {
      rcdUserId: userIDSearch,
      status: userStatus,
      OR: [
        { firstName: { contains: firstSearch, mode: 'insensitive' } },
        { middleName: { contains: middleSearch, mode: 'insensitive' } },
        { lastName: { contains: lastSearch, mode: 'insensitive' } },
      ],
      permits: permitFilter,
    };
  }

  const sortingOrder: Record<string, SortOrder> = filter?.order
    ? filter.order.foreach((col: string, order: SortOrder) => (sortingOrder[col] = order))
    : { name: SortOrder.ASC }; // default sorting order

  const take = filter?.limit || 20; // default skip
  const skip = filter?.offset || 0; // default take

  const applicants = await prisma.applicant.findMany({
    where: where,
    skip: skip,
    take: take,
    orderBy: [{ firstName: sortingOrder.name }, { lastName: sortingOrder.name }],
  });

  return applicants;
};

/**
 * Query an applicant based on ID
 * @returns Applicant with given ID
 */
export const applicant: Resolver = async (_parent, args, { prisma }) => {
  const applicant = await prisma.applicant.findUnique({
    where: {
      id: parseInt(args.id),
    },
  });
  return applicant;
};

/**
 * Create an applicant
 * @returns Status of operation (ok)
 */
export const createApplicant: Resolver = async (_, args, { prisma }) => {
  const { input } = args;
  const {
    medicalInformation: { physicianMspNumber, ...medicalInformation },
    guardian,
    ...rest
  } = input;

  // Get physician record with physicianMspNumber
  const physician = await prisma.physician.findUnique({
    where: {
      mspNumber: physicianMspNumber,
    },
  });

  // If physician doesn't exist, throw an error
  if (!physician) {
    throw new MspNumberDoesNotExistError(
      `Physician with MSP number ${physicianMspNumber} could not be found`
    );
  }

  let applicant;
  try {
    applicant = await prisma.applicant.create({
      data: {
        ...rest,
        postalCode: formatPostalCode(input.postalCode),
        phone: formatPhoneNumber(input.phone),
        medicalInformation: {
          create: { ...medicalInformation, physicianId: physician.id },
        },
        guardian: {
          create: guardian,
        },
      },
    });
  } catch (err) {
    if (err.code === DBErrorCode.UniqueConstraintFailed && err.meta.target.includes('email')) {
      throw new ApplicantAlreadyExistsError(`Applicant with email ${input.email} already exists`);
    }
  }

  // Throw internal server error if applicant was not created
  if (!applicant) {
    throw new ApolloError('Applicant was unable to be created');
  }

  return {
    ok: true,
  };
};

/**
 * Update an applicant
 * @returns Status of operation (ok)
 */
export const updateApplicant: Resolver = async (_, args, { prisma }) => {
  const { input } = args;
  const { id, ...rest } = input;
  const formattedApplicantData = {
    ...rest,
    phone: formatPhoneNumber(input.phone),
    postalCode: formatPostalCode(input.postalCode),
  };

  let updatedApplicant;
  try {
    updatedApplicant = await prisma.applicant.update({
      where: {
        id: parseInt(id),
      },
      data: formattedApplicantData,
    });
  } catch (err) {
    if (err.code === DBErrorCode.RecordNotFound) {
      throw new ApplicantNotFoundError(`Applicant with ID ${id} not found`);
    }
    if (err.code === DBErrorCode.UniqueConstraintFailed && err.meta.target.includes('email')) {
      throw new ApplicantAlreadyExistsError(`Applicant with email ${input.email} already exists`);
    }
    if (err.code === DBErrorCode.UniqueConstraintFailed && err.meta.target.includes('rcdUserId')) {
      throw new RcdUserIdAlreadyExistsError(
        `Applicant with RCD user ID ${input.rcdUserId} already exists`
      );
    }
  }

  if (!updatedApplicant) {
    throw new ApolloError('Applicant was unable to be updated');
  }

  return {
    ok: true,
  };
};
