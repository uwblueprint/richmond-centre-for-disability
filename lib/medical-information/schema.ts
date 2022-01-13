/**
 * GraphQL schema for medical information
 */

import { gql } from '@apollo/client';

export default gql`
  type MedicalInformation {
    id: Int!

    disability: String!
    disabilityCertificationDate: Date!
    patientCondition: PatientCondition!
    mobilityAids: [MobilityAid!]
    otherPatientCondition: String

    physician: Physician!
  }
`;
