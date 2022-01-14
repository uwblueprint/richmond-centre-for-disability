import { gql } from '@apollo/client';
import {
  MobilityAid,
  NewApplication,
  PatientCondition,
  QueryApplicantArgs,
} from '@lib/graphql/types';

/** Disability entry row in medical history card */
export type MedicalHistoryRow = {
  disability: string;
  disabilityCertificationDate: Date;
  details: {
    disability: string;
    disabilityCertificationDate: Date;
    patientCondition: PatientCondition;
    mobilityAids: Array<MobilityAid>;
    notes: string | null;
  };
};

/** Get medical history of an applicant */
export const GET_MEDICAL_HISTORY = gql`
  query GetMedicalHistory($id: Int!) {
    applicant(id: $id) {
      completedApplications {
        __typename
        type
        ... on NewApplication {
          disability
          disabilityCertificationDate
          patientCondition
          mobilityAids
          otherPatientCondition
        }
      }
    }
  }
`;

export type GetMedicalHistoryRequest = QueryApplicantArgs;

export type GetMedicalHistoryResponse = {
  applicant: {
    completedApplications: Array<
      | ({
          type: 'NEW';
        } & Pick<
          NewApplication,
          | 'disability'
          | 'disabilityCertificationDate'
          | 'patientCondition'
          | 'mobilityAids'
          | 'otherPatientCondition'
        >)
      | { type: 'RENEWAL' | 'REPLACEMENT' }
    >;
  };
};
