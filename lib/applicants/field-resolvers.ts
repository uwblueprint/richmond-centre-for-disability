import { Resolver } from '@lib/resolvers'; // Resolver type
import { Applicant } from '@lib/types'; // Applicant type

/**
 * Field resolver to fetch all applications belonging to an applicant
 * @returns Array of application objects
 */
export const applicantApplicationsResolver: Resolver<Applicant> = async (
  parent,
  _args,
  { prisma }
) => {
  return await prisma.application.findMany({ where: { applicantId: parent?.id } });
};

/**
 * Field resolver to fetch all permits belonging to an applicant
 * @returns Array of permit objects
 */
export const applicantPermitsResolver: Resolver<Applicant> = async (parent, _args, { prisma }) => {
  return await prisma.permit.findMany({ where: { applicantId: parent?.id } });
};

/**
 * Field resolver to fetch the guardian associated with an applicant
 * @returns Guardian object
 */
export const applicantGuardianResolver: Resolver<Applicant> = async (parent, _args, { prisma }) => {
  return await prisma.guardian.findUnique({ where: { applicantId: parent?.id } });
};

/**
 * Field resolver to fetch the medical information object associated with an applicant
 * @returns MedicalInformation object
 */
export const applicantMedicalInformationResolver: Resolver<Applicant> = async (
  parent,
  _args,
  { prisma }
) => {
  return await prisma.medicalInformation.findUnique({
    where: { applicantId: parent?.id },
  });
};
