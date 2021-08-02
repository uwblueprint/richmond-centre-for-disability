import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Resolver } from '@lib/resolvers'; // Resolver type
import { ApplicantNotFoundError } from '@lib/applicants/errors'; // Applicant errors
import { DBErrorCode } from '@lib/db/errors'; // Database errors

/**
 * Update the guardian of an applicant
 * @returns Status of operation (ok)
 */
export const updateGuardian: Resolver = async (_, args, { prisma }) => {
  const { input } = args;
  const { applicantId, ...rest } = input;

  let updatedGuardian;
  try {
    updatedGuardian = await prisma.guardian.update({
      where: {
        applicantId,
      },
      data: rest,
    });
  } catch (err) {
    if (err.code === DBErrorCode.RecordNotFound) {
      throw new ApplicantNotFoundError(`Applicant with ID ${applicantId} does not exist`);
    }
  }

  if (!updatedGuardian) {
    throw new ApolloError('Guardian was unable to be updated');
  }

  return {
    ok: true,
  };
};
