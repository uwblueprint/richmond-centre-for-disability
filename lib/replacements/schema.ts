import gql from 'graphql-tag'; // GraphQL tag

export default gql`
  type Replacement {
    id: Int!
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
