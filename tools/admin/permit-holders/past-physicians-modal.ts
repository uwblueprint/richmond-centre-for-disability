import { gql } from '@apollo/client';
import { Physician } from '@lib/graphql/types';

export const GET_APPLICANT_PHYSICIANS_QUERY = gql`
  query GetApplicantPhysiciansQuery($id: Int!) {
    applicant(id: $id) {
      medicalHistory {
        physician {
          name
          mspNumber
          phone
        }
      }
    }
  }
`;

export type GetApplicantPhysiciansRequest = {
  id: number;
};

export type GetApplicantPhysiciansResponse = {
  applicant: {
    medicalHistory: ReadonlyArray<{
      physician: Pick<Physician, 'name' | 'mspNumber' | 'phone'>;
    }>;
  };
};
