import { gql } from '@apollo/client';
import { Application } from '@lib/graphql/types';

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
      >
    >;
  };
};
