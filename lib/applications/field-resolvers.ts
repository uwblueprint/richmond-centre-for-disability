import { Resolver } from '@lib/graphql/resolvers'; // Resolver type
import { Application } from '@lib/graphql/types'; // Application type

/**
 * Field resolver to fetch the applicant that the application belongs to
 * @returns Applicant object
 */
export const applicationApplicantResolver: Resolver<Application> = async (
  parent,
  _args,
  { prisma }
) => {
  if (!parent.applicantId) {
    return null;
  }

  return await prisma.applicant.findUnique({ where: { id: parent.applicantId } });
};

/**
 * Field resolver to fetch the permit associated with an application.
 * NOTE/TODO: Each application should have exactly one permit. Fix schema.
 * @returns Array of permit objects
 */
export const applicationPermitResolver: Resolver<Application> = async (
  parent,
  _args,
  { prisma }
) => {
  return (await prisma.permit.findMany({ where: { applicationId: parent?.id } }))?.[0];
};

/**
 * Field resolver to fetch the application_processing information associated with an application.
 * @returns ApplicationProcessing object
 */
export const applicationApplicationProcessingResolver: Resolver<Application> = async (
  parent,
  _args,
  { prisma }
) => {
  return await prisma.application
    .findUnique({
      where: { id: parent.id },
      select: { applicationProcessing: true },
    })
    .applicationProcessing();
};

/**
 * Field resolver to fetch the replacement information associated with an application.
 * @returns Replacement object
 */
export const applicationReplacementResolver: Resolver<Application> = async (
  parent,
  _args,
  { prisma }
) => {
  return await prisma.replacement.findUnique({ where: { applicationId: parent?.id } });
};
