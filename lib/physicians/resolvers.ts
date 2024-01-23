import { Resolver } from '@lib/graphql/resolvers';
import {
  ComparePhysiciansInput,
  ComparePhysiciansResult,
  QueryComparePhysiciansArgs,
} from '@lib/graphql/types';
import { stripPhoneNumber, stripPostalCode } from '@lib/utils/format';
import { Physician } from '@prisma/client';

/**
 * Compare physician data passed in from UI to existing physician data in DB
 * @returns Whether physician data match, type of mismatch, existing physician data in DB
 */
export const comparePhysicians: Resolver<
  QueryComparePhysiciansArgs,
  ComparePhysiciansResult
> = async (_, args, { prisma }) => {
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
