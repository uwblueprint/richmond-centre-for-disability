import { Resolver } from '@lib/resolvers'; // Resolver type
import { Application } from '@lib/types';

export const applicationApplicantResolver: Resolver<Application> = async (
  parent,
  _args,
  { prisma }
) => {
  return await prisma.applicant.findUnique({ where: { id: parent?.applicantId || undefined } });
};

export const applicationPermitResolver: Resolver<Application> = async (
  parent,
  _args,
  { prisma }
) => {
  return await prisma.permit.findMany({ where: { applicationId: parent?.id } });
};
