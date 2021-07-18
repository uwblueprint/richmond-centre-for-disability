import { Resolver } from '@lib/resolvers'; // Resolver type
import { Permit } from '@lib/types';

export const permitApplicantResolver: Resolver<Permit> = async (parent, _args, { prisma }) => {
  return await prisma.applicant.findUnique({
    where: { id: parent?.applicantId },
  });
};

export const permitApplicationResolver: Resolver<Permit> = async (parent, _args, { prisma }) => {
  return await prisma.application.findUnique({
    where: { id: parent?.applicationId },
  });
};
