export default `
  type Replacement {
    id: ID!
    reason: ReasonForReplacement!
    lostTimestamp: Date
    lostLocation: String
    stolenPoliceFileNumber: Int
    stolenJurisdiction: String
    stolenPoliceOfficerName: String
    description: String
    applicationId: ID!
  }
`;