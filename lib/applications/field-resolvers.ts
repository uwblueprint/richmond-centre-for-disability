import { ApolloError } from 'apollo-server-micro';
import { FieldResolver } from '@lib/graphql/resolvers'; // Resolver type
import { Applicant, Application, ApplicationProcessing, NewApplication } from '@lib/graphql/types'; // Application type
import { getSignedUrlForS3 } from '@lib/utils/s3-utils';
import { Permit } from '@prisma/client';

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
    | 'mostRecentApplication'
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
    | 'paymentRefundedEmployee'
  >
> = async (parent, _args, { prisma, logger }) => {
  const applicationProcessing = await prisma.application
    .findUnique({ where: { id: parent.id } })
    .applicationProcessing({
      include: {
        appNumberEmployee: true,
        appHolepunchedEmployee: true,
        walletCardCreatedEmployee: true,
        reviewRequestEmployee: true,
        applicationInvoice: { include: { employee: true } },
        documentsUrlEmployee: true,
        appMailedEmployee: true,
        paymentRefundedEmployee: true,
      },
    });

  if (!applicationProcessing) {
    return null;
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
      const message = `Error generating AWS URL for application documents: ${e}`;
      logger.error(message);
      throw new ApolloError(message);
    }
  }

  return { ...applicationProcessing, documentsUrl: null };
};

/**
 * Fetch the permit that was granted as the result of the completion of an application
 * @returns permit that was administered after application completion
 */
export const applicationPermitResolver: FieldResolver<
  Application,
  Omit<Permit, 'application'> | null
> = async (parent, _args, { prisma }) => {
  return await prisma.application.findUnique({ where: { id: parent.id } }).permit();
};

/**
 * Get POA form S3 object URL (new applications)
 * @returns URL for POA form of new application
 */
export const applicationPoaFormS3ObjectUrlResolver: FieldResolver<
  NewApplication,
  string | null
> = async (parent, _args, { logger }) => {
  if (!parent.poaFormS3ObjectKey) {
    return null;
  }

  let url: string;
  try {
    const durationSeconds = parseInt(process.env.APPLICATION_DOCUMENT_LINK_TTL_HOURS) * 60 * 60;
    url = getSignedUrlForS3(parent.poaFormS3ObjectKey, durationSeconds);
  } catch (e) {
    const message = `Error generating AWS URL for POA form: ${e}`;
    logger.error(message);
    throw new ApolloError(message);
  }

  return url;
};
