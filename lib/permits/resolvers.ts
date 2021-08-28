import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Prisma } from '@prisma/client'; // Prisma client
import { Resolver } from '@lib/resolvers'; // Resolver type
import {
  PermitAlreadyExistsError,
  ApplicantIdDoesNotExistError,
  ApplicationIdDoesNotExistError,
} from '@lib/permits/errors'; // Permit errors
import { DBErrorCode, getUniqueConstraintFailedFields } from '@lib/db/errors'; // Database errors

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
    input: { applicantId, applicationId },
  } = args;

  let permit;
  try {
    permit = await prisma.permit.create({
      data: {
        ...args.input,
        applicant: {
          connect: { id: applicantId },
        },
        application: {
          connect: { id: applicationId },
        },
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (
        err.code === DBErrorCode.UniqueConstraintFailed &&
        getUniqueConstraintFailedFields(err)?.includes('rcdPermitId')
      ) {
        throw new PermitAlreadyExistsError(
          `Permit with ID ${args.input.rcdPermitId} already exists`
        );
      } else if (
        err.code === DBErrorCode.ForeignKeyConstraintFailed &&
        getUniqueConstraintFailedFields(err)?.includes('applicantId')
      ) {
        throw new ApplicantIdDoesNotExistError(
          `Applicant ID ${args.input.applicantId} does not exist`
        );
      } else if (
        err.code === DBErrorCode.ForeignKeyConstraintFailed &&
        getUniqueConstraintFailedFields(err)?.includes('applicationId')
      ) {
        throw new ApplicationIdDoesNotExistError(
          `Application ID ${args.input.applicationId} does not exist`
        );
      }
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
