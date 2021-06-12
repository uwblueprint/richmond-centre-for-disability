import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Resolver } from '@lib/resolvers'; // Resolver type
import { PermitAlreadyExistsError } from '@lib/permits/errors'; // Employee errors
import { DBErrorCode } from '@lib/db/errors'; // Database errors

/**
 * Query all the permits in the internal-facing app
 * @returns All permits
 */
export const permits: Resolver = async (_parent, _args, { prisma }) => {
  const permits = await prisma.permit.findMany();
  return permits;
};

/**
 * Create an RCD permit
 * @returns Status of operation (ok, error)
 */
export const createPermit: Resolver = async (_, args, { prisma }) => {
  const {
    input: { rcdPermitId, expiryDate, receiptId, active, applicationId, applicantId },
  } = args;

  let permit;
  try {
    permit = await prisma.permit.create({
      data: {
        rcdPermitId,
        expiryDate,
        receiptId,
        active,
        applicationId,
        applicantId,
      },
    });
  } catch (err) {
    if (
      err.code === DBErrorCode.UniqueConstraintFailed &&
      err.meta.target.includes('rcdPermitId')
    ) {
      throw new PermitAlreadyExistsError(`Permit with ID ${rcdPermitId} already exists`);
    }
  }

  // Throw internal server error if permit was not created
  if (!permit) {
    throw new ApolloError('Permit was unable to be created');
  }

  return {
    ok: true,
  };
};
