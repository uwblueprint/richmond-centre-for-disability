import { Prisma } from '@prisma/client'; // Prisma client
import { FieldResolver } from '@lib/graphql/resolvers'; // Resolver type
import { Applicant, Application, Guardian, MedicalInformation, Permit } from '@lib/graphql/types'; // Applicant type
import { SortOrder } from '@tools/types'; // Sorting type
import { getActivePermit, getMostRecentPermit } from '@lib/applicants/utils'; // Applicant utils
import { ApolloError } from 'apollo-server-micro'; // Apollo errors
import { flattenApplication } from '@lib/applications/utils';

/**
 * Field resolver to fetch the most recent permit of an applicant
 * @returns Permit object
 */
export const applicantMostRecentPermitResolver: FieldResolver<
  Applicant,
  Omit<Permit, 'application'>
> = async parent => {
  try {
    return await getMostRecentPermit(parent.id);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new ApolloError(err.message);
    }

    throw new ApolloError('Error querying most recent permit');
  }
};

/**
 * Field resolver to fetch the active permit object associated with an applicant
 * @returns Permit object if active permit exists, `null` otherwise
 */
export const applicantActivePermitResolver: FieldResolver<
  Applicant,
  Omit<Permit, 'application'> | null
> = async parent => {
  try {
    return await getActivePermit(parent.id);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new ApolloError(err.message);
    }

    throw new ApolloError('Error querying active permit');
  }
};

/**
 * Field resolver to fetch all permits belonging to an applicant, ordered by expiry date (most recent first)
 * @returns Array of permit objects
 */
export const applicantPermitsResolver: FieldResolver<
  Applicant,
  Array<Omit<Permit, 'application'>>
> = async (parent, _args, { prisma }) => {
  return await prisma.applicant
    .findUnique({
      where: { id: parent.id },
    })
    .permits({ orderBy: { expiryDate: SortOrder.DESC } });
};

/**
 * Fetch all completed applications belonging to an applicant ordered by application date (most recent first)
 * @returns Array of completed applications
 */
export const applicantCompletedApplicationsResolver: FieldResolver<
  Applicant,
  Array<Omit<Application, 'processing' | 'applicant'>>
> = async (parent, _args, { prisma }) => {
  const applications = await prisma.applicant
    .findUnique({ where: { id: parent.id } })
    .applications({
      where: { applicationProcessing: { status: 'COMPLETED' } },
      include: { newApplication: true, renewalApplication: true, replacementApplication: true },
      orderBy: { createdAt: SortOrder.DESC },
    });

  return applications.map(flattenApplication);
};

/**
 * Field resolver to fetch the guardian associated with an applicant
 * @returns Guardian object
 */
export const applicantGuardianResolver: FieldResolver<Applicant, Guardian | null> = async (
  parent,
  _args,
  { prisma }
) => {
  return await prisma.applicant.findUnique({ where: { id: parent.id } }).guardian();
};

/**
 * Field resolver to fetch the medical information object associated with an applicant
 * @returns MedicalInformation object
 */
export const applicantMedicalInformationResolver: FieldResolver<
  Applicant,
  Omit<MedicalInformation, 'physician'>
> = async (parent, _args, { prisma }) => {
  return await prisma.applicant
    .findUnique({
      where: { id: parent.id },
    })
    .medicalInformation();
};
