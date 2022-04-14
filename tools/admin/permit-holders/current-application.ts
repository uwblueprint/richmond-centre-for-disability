import { gql } from '@apollo/client';
import {
  Application,
  ApplicationProcessing,
  Invoice,
  QueryApplicationArgs,
} from '@lib/graphql/types';
import { NewApplication } from '@prisma/client';

/** Get current application of an applicant */
// TODO: Add API for current application
export const GET_CURRENT_APPLICATION = gql`
  query GetApplicantCurrentApplication($id: Int!) {
    application(id: $id) {
      __typename
      id
      type
      permitType
      processing {
        status
        documentsUrl
        invoice {
          s3ObjectUrl
        }
      }
      ... on NewApplication {
        disability
        disabilityCertificationDate
        patientCondition
        mobilityAids
        temporaryPermitExpiry
      }
    }
  }
`;

export type GetCurrentApplicationRequest = QueryApplicationArgs;

export type GetCurrentApplicationResponse = {
  application: Pick<Application, 'id' | 'permitType'> & {
    processing: Pick<ApplicationProcessing, 'status' | 'documentsUrl'> & {
      invoice: Pick<Invoice, 's3ObjectUrl'> | null;
    };
  } & (
      | ({ type: 'NEW' } & Pick<
          NewApplication,
          | 'disability'
          | 'disabilityCertificationDate'
          | 'patientCondition'
          | 'mobilityAids'
          | 'temporaryPermitExpiry'
        >)
      | ({ type: 'RENEWAL' | 'REPLACEMENT' } & {
          disability: undefined;
          disabilityCertificationDate: undefined;
          patientCondition: undefined;
          mobilityAids: undefined;
          temporaryPermitExpiry: undefined;
        })
    );
};
