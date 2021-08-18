import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Resolver } from '@lib/resolvers'; // Resolver type
import {
  ShopifyConfirmationNumberAlreadyExistsError,
  ApplicantIdDoesNotExistError,
  ApplicationFieldTooLongError,
} from '@lib/applications/errors'; // Application errors
import { DBErrorCode } from '@lib/db/errors'; // Database errors
import { SortOrder } from '@tools/types';

/**
 * Query all the RCD applications in the internal-facing app
 * @returns All RCD applications
 */
export const applications: Resolver = async (_parent, { filter }, { prisma }) => {
  const { order, permitType, requestType, status, search, limit = 20, offset = 0 } = filter;

  let userIDSearch, firstSearch, middleSearch, lastSearch;

  if (parseInt(search)) {
    userIDSearch = parseInt(search);
  } else if (search) {
    [firstSearch, middleSearch, lastSearch] = search.split(' ');
    middleSearch = middleSearch || firstSearch;
    lastSearch = lastSearch || middleSearch;
  }

  let orderBy = undefined;

  if (order && order.length > 0) {
    const sortingOrder: Array<Record<string, SortOrder>> = [];
    order.forEach(([field, order]: [string, SortOrder]) => {
      if (field === 'name') {
        sortingOrder.push({ firstName: order });
        sortingOrder.push({ lastName: order });
      } else if (field === 'dateReceived') {
        sortingOrder.push({ createdAt: order });
      }
    });
    orderBy = sortingOrder;
  }

  const applicationsCount = await prisma.application.count({
    where: {
      applicant: {
        id: userIDSearch,
      },
      applicationProcessing: {
        status: status || undefined,
      },
      isRenewal: requestType ? requestType === 'Renewal' : undefined,
      permitType: permitType || undefined,
      AND: [
        {
          OR: [
            { firstName: { contains: firstSearch, mode: 'insensitive' } },
            { middleName: { contains: middleSearch, mode: 'insensitive' } },
            { lastName: { contains: lastSearch, mode: 'insensitive' } },
          ],
        },
      ],
    },
  });

  const applications = await prisma.application.findMany({
    skip: offset,
    take: limit,
    orderBy: orderBy,
    where: {
      applicant: {
        id: userIDSearch,
      },
      applicationProcessing: {
        status: status || undefined,
      },
      isRenewal: requestType ? requestType === 'Renewal' : undefined,
      permitType: permitType || undefined,
      AND: [
        {
          OR: [
            { firstName: { contains: firstSearch, mode: 'insensitive' } },
            { middleName: { contains: middleSearch, mode: 'insensitive' } },
            { lastName: { contains: lastSearch, mode: 'insensitive' } },
          ],
        },
      ],
    },
    select: {
      firstName: true,
      lastName: true,
      id: true,
      createdAt: true,
      permitType: true,
      isRenewal: true,
      applicationProcessing: {
        select: {
          status: true,
        },
      },
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
    if (
      err.code === DBErrorCode.UniqueConstraintFailed &&
      err.meta?.target.includes('shopifyConfirmationNumber')
    ) {
      throw new ShopifyConfirmationNumberAlreadyExistsError(
        `Application with Shopify confirmation number ${shopifyConfirmationNumber} already exists`
      );
    } else if (
      err.code === DBErrorCode.ForeignKeyConstraintFailed &&
      err.meta?.target.includes('applicantId')
    ) {
      throw new ApplicantIdDoesNotExistError(`Applicant ID ${applicantId} does not exist`);
    } else if (err.code === DBErrorCode.LengthConstraintFailed) {
      throw new ApplicationFieldTooLongError(
        'Length constraint failed, provided value too long for an application field.'
      );
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
