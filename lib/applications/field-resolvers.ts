import { ApolloError } from 'apollo-server-micro';
import { FieldResolver } from '@lib/graphql/resolvers'; // Resolver type
import { Applicant, Application, ApplicationProcessing } from '@lib/graphql/types'; // Application type
import { getSignedUrlForS3 } from '@lib/utils/s3-utils';

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
 * Generate temporary s3 application document url if documents have been uploaded.
 * @returns Application processing object
 */
export const applicationProcessingResolver: FieldResolver<
  Application,
  Omit<
    ApplicationProcessing,
    | 'invoice'
    | 'appNumberEmployee'
    | 'appHolepunchedEmployee'
    | 'walletCardCreatedEmployee'
    | 'reviewRequestCompletedEmployee'
    | 'documentsUrlEmployee'
    | 'appMailedEmployee'
  >
> = async (parent, _args, { prisma }) => {
  const applicationProcessing = await prisma.application
    .findUnique({ where: { id: parent.id } })
    .applicationProcessing();

  if (!applicationProcessing) {
    return null;
  }

  if (!process.env.APPLICATION_DOCUMENT_LINK_TTL_HOURS) {
    throw new ApolloError('Application document link duration not defined');
  }

  // Generate S3 url for documents if they have already been uploaded.
  if (applicationProcessing.documentsS3ObjectKey) {
    try {
      const durationSeconds = parseInt(process.env.APPLICATION_DOCUMENT_LINK_TTL_HOURS) * 60 * 60;
      return {
        ...applicationProcessing,
        documentsUrl: getSignedUrlForS3(
          applicationProcessing.documentsS3ObjectKey,
          durationSeconds
        ),
      };
    } catch (e) {
      throw new ApolloError(`Error generating AWS URL for application documents: ${e}`);
    }
  }

  return { ...applicationProcessing, documentsUrl: null };
};
