import { FieldResolver } from '@lib/graphql/resolvers';
import { Guardian } from '@lib/graphql/types';
import { getSignedUrlForS3 } from '@lib/utils/s3-utils';
import { ApolloError } from 'apollo-server-micro';

/**
 * Get POA form S3 object URL for POAs
 * @returns URL for POA form of an applicant's POA
 */
export const guardianPoaFormS3ObjectUrlResolver: FieldResolver<Guardian, string | null> =
  async parent => {
    if (!process.env.APPLICATION_DOCUMENT_LINK_TTL_HOURS) {
      throw new ApolloError('Application document link duration not defined');
    }

    if (!parent.poaFormS3ObjectKey) {
      return null;
    }

    let url: string;
    try {
      const durationSeconds = parseInt(process.env.APPLICATION_DOCUMENT_LINK_TTL_HOURS) * 60 * 60;
      url = getSignedUrlForS3(parent.poaFormS3ObjectKey, durationSeconds);
    } catch (e) {
      throw new ApolloError(`Error generating AWS URL for POA form: ${e}`);
    }

    return url;
  };
