import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Prisma } from '@prisma/client'; // Prisma client
import { Resolver } from '@lib/graphql/resolvers'; // Resolver type
import { ApplicantNotFoundError } from '@lib/applicants/errors'; // Applicant errors
import { DBErrorCode } from '@lib/db/errors'; // Database errors

/**
 * Update the medical information of an applicant
 * @returns Status of operation (ok)
 */
export const updateMedicalInformation: Resolver = async (_, args, { prisma }) => {
  const { input } = args;
  const { applicantId, ...rest } = input;

  let updatedApplicant;
  try {
    updatedApplicant = await prisma.applicant.update({
      where: {
        id: applicantId,
      },
      data: {
        medicalInformation: {
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
    throw new ApolloError('Medical information was unable to be updated');
  }

  return {
    ok: true,
  };
};
