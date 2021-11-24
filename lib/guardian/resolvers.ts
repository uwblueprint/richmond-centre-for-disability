import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Prisma } from '@prisma/client'; // Prisma client
import { Resolver } from '@lib/graphql/resolvers'; // Resolver type
import { ApplicantNotFoundError } from '@lib/applicants/errors'; // Applicant errors
import { DBErrorCode } from '@lib/db/errors'; // Database errors
import { MutationUpdateGuardianArgs } from '@lib/graphql/types';

/**
 * Update the guardian of an applicant
 * @returns Status of operation (ok)
 */
export const updateGuardian: Resolver<MutationUpdateGuardianArgs> = async (_, args, { prisma }) => {
  const { input } = args;
  const { applicantId, ...rest } = input;
  const { firstName, lastName, addressLine1, city, province, postalCode, relationship } = rest;

  // TODO: Fix validation
  if (
    firstName === null ||
    lastName === null ||
    addressLine1 === null ||
    city === null ||
    province === null ||
    postalCode === null ||
    relationship === null
  ) {
    return;
  }

  let updatedApplicant;
  try {
    updatedApplicant = await prisma.applicant.update({
      where: {
        id: applicantId,
      },
      data: {
        guardian: {
          update: rest,
        },
      },
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === DBErrorCode.RecordNotFound
    ) {
      throw new ApplicantNotFoundError(`Applicant with ID ${applicantId} does not exist`);
    }
  }

  if (!updatedApplicant) {
    throw new ApolloError('Guardian was unable to be updated');
  }

  return {
    ok: true,
  };
};
