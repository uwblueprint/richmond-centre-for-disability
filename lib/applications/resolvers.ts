import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Resolver } from '@lib/resolvers'; // Resolver type
import {
  ShopifyConfirmationNumberAlreadyExistsError,
  ApplicantIdDoesNotExistError,
  ApplicationFieldTooLongError,
} from '@lib/applications/errors'; // Application errors
import { DBErrorCode } from '@lib/db/errors'; // Database errors
import { SortOrder } from '@tools/types'; // Sorting type

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
