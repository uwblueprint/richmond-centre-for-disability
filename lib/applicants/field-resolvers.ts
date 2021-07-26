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

/**
 * Field resolver to fetch the medical history object associated with an applicant
 * @returns MedicalHistory obejct
 */

export const applicantMedicalHistoryResolver: Resolver<Applicant> = async (
  parent,
  _args,
  { prisma }
) => {
  const applications = await prisma.application.findMany({
    where: {
      applicantId: parent?.id,
    },
    select: {
      physicianMspNumber: true,
      id: true,
    },
  });

  const physicians = await prisma.$transaction(
    applications.map(application => {
      return prisma.physician.findUnique({
        where: {
          mspNumber: application.physicianMspNumber,
        },
      });
    })
  );

  const result = applications.map((application, i) => {
    return {
      applicationId: application.id,
      physician: physicians[i],
    };
  });

  return result;
};
