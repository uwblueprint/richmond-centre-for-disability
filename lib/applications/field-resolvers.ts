import { FieldResolver } from '@lib/graphql/resolvers'; // Resolver type
import { Application } from '@lib/graphql/types'; // Application type

// Application field resolver type
type ApplicationFieldResolver = FieldResolver<Application>;

/**
 * Field resolver to fetch the applicant that the application belongs to
 * @returns Applicant object
 */
export const applicationApplicantResolver: ApplicationFieldResolver = async (
  parent,
  _args,
  { prisma }
) => {
  return await prisma.application.findUnique({ where: { id: parent.id } }).applicant();
};

/**
 * Field resolver to fetch the permit associated with an application.
 * NOTE/TODO: Each application should have exactly one permit. Fix schema.
 * @returns Array of permit objects
 */
export const applicationPermitResolver: ApplicationFieldResolver = async (
  parent,
  _args,
  { prisma }
) => {
  return await prisma.application.findUnique({ where: { id: parent.id } }).permit();
};

/**
 * Field resolver to fetch the application_processing information associated with an application.
 * @returns ApplicationProcessing object
 */
export const applicationApplicationProcessingResolver: ApplicationFieldResolver = async (
  parent,
  _args,
  { prisma }
) => {
  return await prisma.application
    .findUnique({
      where: { id: parent.id },
    })
    .applicationProcessing();
};

/**
 * Field resolver to fetch the replacement information associated with an application.
 * @returns Replacement object
 */
export const applicationReplacementResolver: ApplicationFieldResolver = async (
  parent,
  _args,
  { prisma }
) => {
  return await prisma.application.findUnique({ where: { id: parent.id } }).replacement();
};
