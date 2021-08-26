import { gql } from '@apollo/client';
import { Application, ApplicationProcessing } from '@lib/graphql/types';

export const GET_APPLICANT_APPLICATIONS_QUERY = gql`
  query GetApplicantApplicationsQuery($id: ID!) {
    applicant(id: $id) {
      applications {
        id
        disability
        affectsMobility
        mobilityAidRequired
        cannotWalk100m
        aid
        notes
        createdAt
      }
    }
  }
`;

export type GetApplicantApplicationsRequest = {
  id: number;
};

export type GetApplicantApplicationsResponse = {
  applicant: {
    applications: ReadonlyArray<
      Pick<
        Application,
        | 'id'
        | 'disability'
        | 'affectsMobility'
        | 'mobilityAidRequired'
        | 'cannotWalk100m'
        | 'aid'
        | 'createdAt'
        | 'notes'
      >
    >;
  };
};

export const GET_APPLICANT_ATTACHED_FILES_QUERY = gql`
  query GetApplicantAttachedFilesQuery($id: ID!) {
    applicant(id: $id) {
      applications {
        id
        applicationProcessing {
          documentUrls
          createdAt
        }
      }
    }
  }
`;

export type GetApplicantAttachedFilesRequest = {
  id: number;
};

export type GetApplicantAttachedFilesResponse = {
  applicant: {
    applications: ReadonlyArray<
      Pick<Application, 'id'> & {
        applicationProcessing: Pick<ApplicationProcessing, 'documentUrls' | 'createdAt'>;
      }
    >;
  };
};
