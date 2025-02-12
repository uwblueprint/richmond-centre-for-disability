import { Resolver } from '@lib/graphql/resolvers';
import {
  ComparePhysiciansInput,
  ComparePhysiciansResult,
  QueryComparePhysiciansArgs,
  PhysiciansFilter,
  PhysiciansResult,
} from '@lib/graphql/types';
import { stripPhoneNumber, stripPostalCode } from '@lib/utils/format';
import { Physician } from '@prisma/client';
import { Prisma } from '@prisma/client';

/**
 * Query and filter physicians from the database.
 * Supports filtering by first name, last name, and MSP number.
 * Supports pagination and sorting.
 * @returns All physicians that match the filter(s).
 */
export const physicians: Resolver<{ filter: PhysiciansFilter }, PhysiciansResult> = async (
  _parent,
  { filter },
  { prisma }
) => {
  // Create default filter
  let where: Prisma.PhysicianWhereInput = {};

  if (filter) {
    const { firstName, lastName, mspNumber } = filter;

    // Update filter based on input
    where = {
      ...(firstName && { firstName: { startsWith: firstName, mode: 'insensitive' } }),
      ...(lastName && { lastName: { startsWith: lastName, mode: 'insensitive' } }),
      ...(mspNumber && { mspNumber: { equals: mspNumber } }),
    };
  }

  // Map the input sorting format into key-value pairs that can be used by Prisma
  const sortingOrder: Record<string, Prisma.SortOrder> = {};

  if (filter?.order) {
    filter.order.forEach(([field, order]) => (sortingOrder[field] = order as Prisma.SortOrder));
  }

  const take = filter?.limit || undefined;
  const skip = filter?.offset || undefined;

  const totalCount = await prisma.physician.count({
    where,
  });

  const physicians = await prisma.physician.findMany({
    where,
    skip,
    take,
    // orderBy: sortingOrder,
  });

  return {
    result: physicians,
    totalCount,
  };
};

/**
 * Compare physician data passed in from UI to existing physician data in DB
 * @returns Whether physician data match, type of mismatch, existing physician data in DB
 */
export const comparePhysicians: Resolver<QueryComparePhysiciansArgs, ComparePhysiciansResult> =
  async (_, args, { prisma }) => {
    const { input } = args;
    const { mspNumber } = input;

    // Search for existing physician
    const existingPhysician = await prisma.physician.findUnique({
      where: { mspNumber },
    });

    if (!existingPhysician) {
      return {
        match: false,
        status: 'DOES_NOT_EXIST',
        existingPhysicianData: null,
      };
    }

    const inputPhysician = {
      ...input,
      phone: stripPhoneNumber(input.phone),
      postalCode: stripPostalCode(input.postalCode),
    };

    for (const field in inputPhysician) {
      if (
        inputPhysician[field as keyof ComparePhysiciansInput] !==
        existingPhysician[field as keyof Physician]
      ) {
        return {
          match: false,
          status: 'DOES_NOT_MATCH_EXISTING',
          existingPhysicianData: existingPhysician,
        };
      }
    }

    return { match: true, status: null, existingPhysicianData: null };
  };
