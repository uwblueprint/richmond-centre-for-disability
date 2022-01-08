import { gql } from '@apollo/client';

export default gql`
  type MedicalInformation {
    id: ID!
    disability: String!
    patientEligibility: Eligibility!
    notes: String
    certificationDate: Date
    aid: [Aid!]
    applicant: Applicant!
    applicantId: Int!
    physician: Physician!
    physicianId: Int!
    createdAt: Date!
  }

  # Fields to specify when creating a medical information record for an applicant
  input CreateMedicalInformationInput {
    disability: String!
    patientEligibility: Eligibility!
    notes: String
    certificationDate: Date
    aid: [Aid!]
    physicianMspNumber: Int!
  }

  input UpdateMedicalInformationInput {
    applicantId: Int!
    disability: String
    patientEligibility: Eligibility
    notes: String
    certificationDate: Date
    aid: [Aid!]
    physicianId: Int
  }

  type UpdateMedicalInformationResult {
    ok: Boolean!
  }
`;
