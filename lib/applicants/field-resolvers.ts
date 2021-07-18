import { Resolver } from '@lib/resolvers'; // Resolver type
import { Applicant } from '@lib/types';

export const applicantApplicationsResolver: Resolver<Applicant> = async (
  parent,
  _args,
  { prisma }
) => {
  return await prisma.application.findMany({ where: { applicantId: parent?.id } });
};

export const applicantPermitsResolver: Resolver<Applicant> = async (parent, _args, { prisma }) => {
  return await prisma.permit.findMany({ where: { applicantId: parent?.id } });
};

export const applicantGuardianResolver: Resolver<Applicant> = async (parent, _args, { prisma }) => {
  return await prisma.guardian.findUnique({ where: { applicantId: parent?.id } });
};

export const applicantMedicalInformationResolver: Resolver<Applicant> = async (
  parent,
  _args,
  { prisma }
) => {
  return await prisma.medicalInformation.findUnique({
    where: { applicantId: parent?.id },
  });
};
