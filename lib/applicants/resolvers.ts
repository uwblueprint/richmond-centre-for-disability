import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Resolver } from '@lib/graphql/resolvers'; // Resolver type
import { InvalidPhoneNumberSuffixLengthError } from '@lib/applicants/errors'; // Applicant errors
import { getActivePermit } from '@lib/applicants/utils'; // Applicant utils
import {
  Applicant,
  MutationSetApplicantAsActiveArgs,
  MutationSetApplicantAsInactiveArgs,
  MutationUpdateApplicantDoctorInformationArgs,
  MutationUpdateApplicantGeneralInformationArgs,
  MutationUpdateApplicantGuardianInformationArgs,
  MutationVerifyIdentityArgs,
  QueryApplicantArgs,
  QueryApplicantsArgs,
  SetApplicantAsActiveResult,
  SetApplicantAsInactiveResult,
  UpdateApplicantDoctorInformationResult,
  UpdateApplicantGeneralInformationResult,
  UpdateApplicantGuardianInformationResult,
  VerifyIdentityResult,
} from '@lib/graphql/types'; // GraphQL types
import { DateUtils } from 'react-day-picker'; // Date utils
import { SortOrder } from '@tools/types'; // Sorting Type

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
export const applicants: Resolver<
  QueryApplicantsArgs,
  { result: Array<Omit<Applicant, 'guardian' | 'medicalInformation'>>; totalCount: number }
> = async (_parent, { filter }, { prisma }) => {
  // Create default filter
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
      rcdUserIDSearch,
      nameFilters,
      firstSearch,
      middleSearch,
      lastSearch;

    // Parse search input for id or name
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

    const TODAY = new Date();

    // Permit status filter depends on expiry date
    switch (permitStatus) {
      case 'ACTIVE':
        expiryDateLowerBound = TODAY;
        break;
      case 'EXPIRED':
        expiryDateUpperBound = TODAY;
        break;
      case 'EXPIRING':
        expiryDateLowerBound = TODAY;
        expiryDateUpperBound = DateUtils.addMonths(TODAY, 1);
        break;
    }

    // Permit status and expiry date range filters both look at the permit expiryDate.
    // For this reason we need to filter on expiryDate twice to take both filters in account.
    const permitFilter = {
      some: {
        AND: [
          {
            expiryDate: {
              gte: expiryDateLowerBound?.toISOString(),
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
    };

    // Update default filter since there were filter arguments
    where = {
      rcdUserId: rcdUserIDSearch,
      status: userStatus,
      permits: permitFilter,
      ...nameFilters,
    };
  }

  // Map the input sorting format into key value pairs that can be used by Prisma
  // This currently only filters by name but can be extended to more filters by adding them in the orderBy statement
  const sortingOrder: Record<string, SortOrder> = {};

  if (filter?.order) {
    filter.order.forEach(([field, order]) => (sortingOrder[field] = order as SortOrder));
  }

  const take = filter?.limit || undefined;
  const skip = filter?.offset || undefined;

  const totalCount = await prisma.applicant.count({
    where,
  });

  const applicants = await prisma.applicant.findMany({
    where,
    skip,
    take,
    orderBy: [
      { firstName: sortingOrder.name || SortOrder.ASC },
      { lastName: sortingOrder.name || SortOrder.ASC },
    ],
  });

  return {
    result: applicants,
    totalCount: totalCount,
  };
};

/**
 * Query an applicant based on ID
 * @returns Applicant with given ID
 */
export const applicant: Resolver<
  QueryApplicantArgs,
  Omit<Applicant, 'guardian' | 'medicalInformation'>
> = async (_parent, args, { prisma }) => {
  const { id } = args;
  const applicant = await prisma.applicant.findUnique({
    where: {
      id,
    },
  });
  return applicant;
};

/**
 * Update general information of an applicant (personal, contact, address)
 * @returns Status of the operation
 */
export const updateApplicantGeneralInformation: Resolver<
  MutationUpdateApplicantGeneralInformationArgs,
  UpdateApplicantGeneralInformationResult
> = async (_parent, args, { prisma }) => {
  // TODO: Validation
  const { input } = args;
  const { id, ...data } = input;

  let updatedApplicant;
  try {
    updatedApplicant = await prisma.applicant.update({
      where: { id },
      data,
    });
  } catch {
    // TODO: Handle error
  }

  if (!updatedApplicant) {
    throw new ApolloError('Applicant was unable to be updated');
  }

  return { ok: true };
};

/**
 * Update information of an applicant's doctor
 * @returns Status of the operation
 */
export const updateApplicantDoctorInformation: Resolver<
  MutationUpdateApplicantDoctorInformationArgs,
  UpdateApplicantDoctorInformationResult
> = async (_parent, args, { prisma }) => {
  // TODO: Validation
  const { input } = args;
  const { id, ...data } = input;

  let updatedApplicant;
  try {
    await prisma.applicant.update({
      where: { id },
      data: {
        medicalInformation: {
          update: {
            physician: {
              update: data,
            },
          },
        },
      },
    });
  } catch {
    // TODO: Handle error
  }

  if (!updatedApplicant) {
    throw new ApolloError("Applicant's physician was unable to be updated");
  }

  return { ok: true };
};

/**
 * Update information of an applicant's guardian
 * @returns Status of the operation
 */
export const updateApplicantGuardianInformation: Resolver<
  MutationUpdateApplicantGuardianInformationArgs,
  UpdateApplicantGuardianInformationResult
> = async (_parent, args, { prisma }) => {
  const { input } = args;
  const { id, ...data } = input;

  let updatedApplicant;
  try {
    updatedApplicant = await prisma.applicant.update({
      where: { id },
      data: {
        guardian: {
          update: data,
        },
      },
    });
  } catch {
    // TODO: Handle error
  }

  if (!updatedApplicant) {
    throw new ApolloError("Applicant's guardian was unable to be updated");
  }

  return { ok: true };
};

/**
 * Set applicant status to ACTIVE
 * @returns Status of the operation (ok)
 */
export const setApplicantAsActive: Resolver<
  MutationSetApplicantAsActiveArgs,
  SetApplicantAsActiveResult
> = async (_parent, args, { prisma }) => {
  // TODO: Validation
  const { input } = args;
  const { id } = input;

  let updatedApplicant;
  try {
    updatedApplicant = await prisma.applicant.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        inactiveReason: null,
      },
    });
  } catch {
    // TODO: Error handling
  }

  if (!updatedApplicant) {
    throw new ApolloError('Unable to set applicant status to active');
  }

  return { ok: true };
};

/**
 * Set applicant status to INACTIVE
 * @returns Status of the operation (ok)
 */
export const setApplicantAsInactive: Resolver<
  MutationSetApplicantAsInactiveArgs,
  SetApplicantAsInactiveResult
> = async (_parent, args, { prisma }) => {
  // TODO: Validation
  const { input } = args;
  const { id, reason } = input;

  let updatedApplicant;
  try {
    updatedApplicant = await prisma.applicant.update({
      where: { id },
      data: {
        status: 'INACTIVE',
        inactiveReason: reason,
      },
    });
  } catch {
    // TODO: Error handling
  }

  if (!updatedApplicant) {
    throw new ApolloError('Unable to set applicant status to inactive');
  }

  return { ok: true };
};

/**
 * Verify applicant identity when applying for an APP, given the RCD user ID,
 * last 4 digits of phone number, and date of birth.
 * Requires that the above information matches a record in the DB, and that the
 * applicant has an active permit that is expiring within the next 30 days.
 * @returns Whether identity could be verified (ok), failure reason if ok=false, applicant ID if ok=true
 */
export const verifyIdentity: Resolver<MutationVerifyIdentityArgs, VerifyIdentityResult> = async (
  _,
  args,
  { prisma }
) => {
  const {
    input: { userId, phoneNumberSuffix, dateOfBirth, acceptedTos },
  } = args;

  // Phone number suffix must be of length 4
  if (phoneNumberSuffix.length != 4) {
    throw new InvalidPhoneNumberSuffixLengthError(
      'Last 4 digits of phone number must be 4 digits long'
    );
  }

  // Retrieve applicant with matching info
  const applicant = await prisma.applicant.findUnique({
    where: {
      rcdUserId: userId,
    },
    select: {
      id: true,
      rcdUserId: true,
      phone: true,
      dateOfBirth: true,
    },
  });

  // Applicant not found
  if (!applicant) {
    return {
      ok: false,
      failureReason: 'IDENTITY_VERIFICATION_FAILED',
      applicantId: null,
    };
  }

  // Verify that phone number suffix and date of birth match
  if (
    !applicant.phone.endsWith(phoneNumberSuffix) ||
    applicant.dateOfBirth.getTime() !== dateOfBirth.getTime()
  ) {
    return {
      ok: false,
      failureReason: 'IDENTITY_VERIFICATION_FAILED',
      applicantId: null,
    };
  }

  // Verify that active permit exists and is expiring within 30 days
  const activePermit = await getActivePermit(applicant.id);

  if (activePermit === null) {
    return {
      ok: false,
      failureReason: 'APP_DOES_NOT_EXPIRE_WITHIN_30_DAYS',
      applicantId: null,
    };
  }

  // Note: 30 days = 30 * 24 * 60 * 60 * 1000 milliseconds
  if (activePermit.expiryDate.getTime() - new Date().getTime() > 30 * 24 * 60 * 60 * 1000) {
    return {
      ok: false,
      failureReason: 'APP_DOES_NOT_EXPIRE_WITHIN_30_DAYS',
      applicantId: null,
    };
  }

  // Update applicant's accepted TOS timestamp
  try {
    prisma.applicant.update({
      where: {
        id: applicant.id,
      },
      data: {
        acceptedTos,
      },
    });
  } catch (err) {
    throw new ApolloError("Failed to update applicant's accepted TOS timestamp");
  }

  return {
    ok: true,
    failureReason: null,
    applicantId: applicant.id,
  };
};
