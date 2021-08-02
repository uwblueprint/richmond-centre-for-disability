import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Resolver } from '@lib/resolvers'; // Resolver type
import { ApplicantNotFoundError } from '@lib/applicants/errors'; // Applicant errors
import { DBErrorCode } from '@lib/db/errors'; // Database errors

/**
 * Update the medical information of an applicant
 * @returns Status of operation (ok)
 */
export const updateMedicalInformation: Resolver = async (_, args, { prisma }) => {
  const { input } = args;
  const { applicantId, ...rest } = input;

  let updatedMedicalInformation;
  try {
    updatedMedicalInformation = await prisma.medicalInformation.update({
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

  if (!updatedMedicalInformation) {
    throw new ApolloError('Medical information was unable to be updated');
  }

  return {
    ok: true,
  };
};
