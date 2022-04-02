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
 * Refresh temporary s3 application document url if it has expired.
 * @returns Application processing object
 */
export const applicationProcessingResolver: FieldResolver<
  Application,
  Omit<ApplicationProcessing, 'invoice'>
> = async (parent, _args, { prisma }) => {
  const application = await prisma.application
    .findUnique({ where: { id: parent.id } })
    .applicationProcessing();

  if (!application) {
    return null;
  }

  if (!process.env.APPLICATION_DOCUMENT_LINK_TTL_DAYS) {
    throw new ApolloError('Application document link duration not defined');
  }
  // Update the signed S3 URL if it has expired.
  // Get the valid duration period from env.
  const applicationDocumentLinkDuration = parseInt(process.env.APPLICATION_DOCUMENT_LINK_TTL_DAYS);
  const DAY = 24 * 60 * 60 * 1000;
  const daysDifference =
    Math.floor(new Date().getTime() / DAY) -
    Math.floor(application?.documentsUrlUpdatedAt.getTime() / DAY);
  if (daysDifference > applicationDocumentLinkDuration) {
    let signedUrl;
    try {
      signedUrl = getSignedUrlForS3(application.documentsS3ObjectKey as string);
    } catch (error) {
      throw new ApolloError(`Failed to get application document URL: ${error}`);
    }
    try {
      await prisma.application.update({
        where: { id: application.id },
        data: {
          applicationProcessing: {
            update: {
              documentsUrl: signedUrl,
            },
          },
        },
      });
    } catch {
      throw new ApolloError('Failed to update temporary application document URL');
    }
    return await prisma.application
      .findUnique({ where: { id: parent.id } })
      .applicationProcessing();
  }
  return application;
};
