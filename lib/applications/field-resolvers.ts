import { ApolloError } from 'apollo-server-micro';
import { FieldResolver } from '@lib/graphql/resolvers'; // Resolver type
import { Applicant, Application, ApplicationProcessing } from '@lib/graphql/types'; // Application type

/**
 * Field resolver to return the type of application
 * @returns Type of application (NewApplication, RenewalCApplication, ReplacementApplication)
 */
export const __resolveApplicationType: FieldResolver<
  Application,
  'NewApplication' | 'RenewalApplication' | 'ReplacementApplication'
> = async parent => {
  switch (parent.type) {
    case 'NEW':
      return 'NewApplication';
    case 'RENEWAL':
      return 'RenewalApplication';
    case 'REPLACEMENT':
      return 'ReplacementApplication';
    default:
      throw new ApolloError('Application is of invalid type');
  }
};

/**
 * Field resolver to fetch the applicant that the application belongs to
 * @returns Applicant object
 */
export const applicationApplicantResolver: FieldResolver<
  Application,
  Omit<
    Applicant,
    | 'mostRecentPermit'
    | 'activePermit'
    | 'permits'
    | 'completedApplications'
    | 'guardian'
    | 'medicalInformation'
  >
> = async (parent, _args, { prisma }) => {
  return await prisma.application.findUnique({ where: { id: parent.id } }).applicant();
};

/**
 * Fetch processing data of application
 * @returns Application processing object
 */
export const applicationProcessingResolver: FieldResolver<Application, ApplicationProcessing> =
  async (parent, _args, { prisma }) => {
    return await prisma.application
      .findUnique({ where: { id: parent.id } })
      .applicationProcessing();
  };
