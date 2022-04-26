import { gql } from '@apollo/client';
import {
  Application,
  ApplicationProcessing,
  Invoice,
  NewApplication,
  Permit,
  PermitType,
  QueryApplicantArgs,
} from '@lib/graphql/types';

/** APP history entry row in APP history table */
export type PermitRecord = Pick<Permit, 'rcdPermitId' | 'expiryDate'> & {
  application: Pick<Application, 'id' | 'type'> & {
    processing: Pick<ApplicationProcessing, 'documentsUrl'> & {
      invoice: Pick<Invoice, 's3ObjectUrl'>;
    };
    permitType: PermitType | undefined;
  };
};

/** Get APP history for applicant */
export const GET_APP_HISTORY = gql`
  query GetApplicantAppHistory($id: Int!) {
    applicant(id: $id) {
      permits {
        rcdPermitId
        expiryDate
        application {
          id
          type
          processing {
            documentsUrl
            invoice {
              s3ObjectUrl
            }
          }
          ... on NewApplication {
            permitType
          }
        }
      }
    }
  }
`;

export type GetAppHistoryRequest = QueryApplicantArgs;

export type GetAppHistoryResponse = {
  applicant: {
    permits: Array<
      Pick<Permit, 'rcdPermitId' | 'expiryDate'> & {
        application: Pick<Application, 'id'> & {
          processing: Pick<ApplicationProcessing, 'documentsUrl'> & {
            invoice: Pick<Invoice, 's3ObjectUrl'>;
          };
        } & (
            | ({ type: 'NEW' } & Pick<NewApplication, 'permitType'>)
            | { type: 'RENEWAL' | 'REPLACEMENT'; permitType: undefined }
          );
      }
    >;
  };
};
