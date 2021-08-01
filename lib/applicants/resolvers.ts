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
import { PermitStatus } from '@tools/pages/permit-holders';
import { DateUtils } from 'react-day-picker';
import { SortOrder } from '@tools/types';

/**
 * TODO: update comments
 * Query all the RCD applicants in the internal-facing app
 * @returns All RCD applicants
 */
export const applicants: Resolver = async (_parent, args, { prisma }) => {
  const {
    order,
    permitStatus,
    userStatus,
    expiryDateRangeFrom,
    expiryDateRangeTo,
    search,
    limit,
    offset,
  } = args;

  let expiryDateUpperBound, expiryDateLowerBound, nameSearch, userIDSearch;

  const TODAY = new Date();

  if (permitStatus === PermitStatus.VALID) {
    expiryDateLowerBound = TODAY;
  }
  if (permitStatus === PermitStatus.EXPIRED) {
    expiryDateUpperBound = TODAY;
  }
  if (permitStatus === PermitStatus.EXPIRING_THIRTY) {
    expiryDateLowerBound = TODAY;
    expiryDateUpperBound = DateUtils.addMonths(TODAY, 1);
  }

  if (parseInt(search)) {
    userIDSearch = parseInt(search);
  } else {
    nameSearch = search.split(' ');
  }

  const sortingOrder: Record<string, SortOrder> = order
    ? order.foreach((col: string, order: SortOrder) => (sortingOrder[col] = order))
    : { name: SortOrder.ASC };

  // TODO: add try catch
  const applicants = await prisma.applicant.findMany({
    skip: offset || undefined,
    take: limit || 20,
    where: {
      id: userIDSearch,
      status: userStatus || undefined,
      OR: [
        { firstName: { in: nameSearch } },
        { middleName: { in: nameSearch } },
        { lastName: { in: nameSearch } },
      ],
      permits: {
        some: {
          expiryDate: { gte: expiryDateUpperBound, lte: expiryDateLowerBound },
          AND: [
            {
              expiryDate: {
                gte: expiryDateRangeFrom || undefined,
                lte: expiryDateRangeTo || undefined,
              },
            },
          ],
        },
      },
    },
    orderBy: [{ firstName: sortingOrder['name'] }, { lastName: sortingOrder['name'] }],
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
