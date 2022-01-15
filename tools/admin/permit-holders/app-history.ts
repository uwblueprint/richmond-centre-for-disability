import { gql } from '@apollo/client';
import {
  Application,
  ApplicationType,
  Permit,
  PermitStatus,
  QueryApplicantArgs,
} from '@lib/graphql/types';

/** APP history entry row in APP history table */
export type AppHistoryRow = {
  applicationId: number;
  rcdPermitId: number;
  status: PermitStatus;
  requestType: ApplicationType;
  expiryDate: Date;
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
        }
      }
    }
  }
`;

export type GetAppHistoryRequest = QueryApplicantArgs;

export type GetAppHistoryResponse = {
  applicant: {
    permits: Array<
      Pick<Permit, 'rcdPermitId' | 'expiryDate'> & { application: Pick<Application, 'id' | 'type'> }
    >;
  };
};
