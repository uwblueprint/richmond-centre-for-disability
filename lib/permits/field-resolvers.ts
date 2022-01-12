import { Resolver } from '@lib/graphql/resolvers'; // Resolver type
import { Permit } from '@lib/graphql/types'; // Permit type

/**
 * Field resolver to fetch the applicant that the permit belongs to
 * @returns Applicant object
 */
export const permitApplicantResolver: Resolver<Permit> = async (parent, _args, { prisma }) => {
  return await prisma.applicant.findUnique({
    where: { id: parent?.applicantId },
  });
};

/**
 * Field resolver to fetch the application associated with a permit
 * @returns Application object
 */
export const permitApplicationResolver: Resolver<Permit> = async (parent, _args, { prisma }) => {
  return await prisma.application.findUnique({
    where: { id: parent?.applicationId },
  });
};
