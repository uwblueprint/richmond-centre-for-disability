export default `
  type MedicalInformation {
    id: ID!
    disability: String!
    affectsMobility: Boolean!
    mobilityAidRequired: Boolean!
    cannotWalk100m: Boolean!
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
    affectsMobility: Boolean!
    mobilityAidRequired: Boolean!
    cannotWalk100m: Boolean!
    notes: String
    certificationDate: Date
    aid: [Aid!]
    physicianMspNumber: Int!
  }

  input UpdateMedicalInformationInput {
    applicantId: Int!
    disability: String
    affectsMobility: Boolean
    mobilityAidRequired: Boolean
    cannotWalk100m: Boolean
    notes: String
    certificationDate: Date
    aid: [Aid!]
  }

  type UpdateMedicalInformationResult {
    ok: Boolean!
  }
`;