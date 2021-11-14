import gql from 'graphql-tag'; // GraphQL tag

// TODO: This schema is not finalized and will be changed following the creation of the createRenewalApplication API
export default gql`
  type Renewal {
    id: Int!
    usesAccessibleConvertedVan: Boolean!
    requiresWiderParkingSpace: Boolean!
    applicationId: Int!
  }
`;
