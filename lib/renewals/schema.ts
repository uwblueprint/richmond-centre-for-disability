// TODO: This schema is not finalized and will be changed following the creation of the createRenewalApplication API
export default `
  type Renewal {
    id: ID!
    usesAccessibleConvertedVan: Boolean!
    requiresWiderParkingSpace: Boolean!
    applicationId: ID!
  }
`;
