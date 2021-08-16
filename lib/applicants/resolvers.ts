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
 * All fields are optional.
 *
 * Filters:
 * - permitStatus: VALID, EXPIRED, EXPIRING_THIRTY
 * - userStatus: ACTIVE, INACTIVE
 * - expiryDateRangeFrom: Permit Expiry Date start
 * - expiryDateRangeTo: Permit Expiry Date end
 * - search: Search by first, middle, last name or by RCD user ID
 *
 * Pagination:
 * - offset: Number of results to skip.
 * - limit: Number of result to return
 *
 * Sorting:
 * - order: array of tuples of the field being sorted and the order. Default [['firstName', 'asc'], ['lastName', 'asc']]
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
      nameFilters,
      firstSearch,
      middleSearch,
      lastSearch;

    if (parseInt(search)) {
      userIDSearch = parseInt(search);
    } else if (search) {
      [firstSearch, middleSearch, lastSearch] = search?.split(' ');
      middleSearch = middleSearch || firstSearch;
      lastSearch = lastSearch || middleSearch;

      nameFilters = [
        { firstName: { contains: firstSearch, mode: 'insensitive' } },
        { middleName: { contains: middleSearch, mode: 'insensitive' } },
        { lastName: { contains: lastSearch, mode: 'insensitive' } },
      ];
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
            AND: [
              {
                expiryDate: {
                  gt: expiryDateLowerBound?.toISOString(),
                  lte: expiryDateUpperBound?.toISOString(),
                },
              },
              {
                expiryDate: {
                  gte: expiryDateRangeFrom?.toISOString(),
                  lte: expiryDateRangeTo?.toISOString(),
                },
              },
            ],
          },
        }
      : undefined;

    where = {
      rcdUserId: userIDSearch,
      status: userStatus,
      OR: nameFilters,
      permits: permitFilter,
    };
  }
  const sortingOrder: Record<string, SortOrder> = {};

  if (filter.order) {
    filter.order.forEach(([field, order]: [string, SortOrder]) => (sortingOrder[field] = order));
  }

  const take = filter?.limit;
  const skip = filter?.offset;

  const totalCount = await prisma.applicant.count({
    where: where,
  });

  const applicants = await prisma.applicant.findMany({
    where: where,
    skip: skip,
    take: take,
    orderBy: [
      { firstName: sortingOrder.name || SortOrder.ASC },
      { lastName: sortingOrder.name || SortOrder.ASC },
    ],
  });

  return {
    node: applicants,
    totalCount: totalCount,
  };
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
