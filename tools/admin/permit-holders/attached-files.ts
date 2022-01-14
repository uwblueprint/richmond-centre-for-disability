import { gql } from '@apollo/client';
import { ApplicationProcessing, Permit, QueryApplicantArgs } from '@lib/graphql/types';

/** Attached file entry row in attached files table */
export type AttachedFilesRow = {
  fileName: string;
  associatedApp: number;
  dateUploaded: Date;
  fileUrl: string;
};

/**
 * Get previously attached files of an applicant
 * ? Shoud output depend on permits or completed applications?
 */
export const GET_ATTACHED_FILES = gql`
  query GetAttachedFiles($id: Int!) {
    applicant(id: $id) {
      permits {
        rcdPermitId
        application {
          processing {
            documentsUrl
            documentsUrlUpdatedAt
          }
        }
      }
    }
  }
`;

export type GetAttachedFilesRequest = QueryApplicantArgs;

export type GetAttachedFilesResponse = {
  applicant: {
    permits: Array<
      Pick<Permit, 'rcdPermitId'> & {
        application: {
          processing: Pick<ApplicationProcessing, 'documentsUrl' | 'documentsUrlUpdatedAt'>;
        };
      }
    >;
  };
};
