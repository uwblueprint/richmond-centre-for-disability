export default `
  type Physician {
    name: String!
    mspNumber: Int!
    addressLine1: String!
    addressLine2: String
    city: String!
    province: Province!
    postalCode: String!
    phone: String!
    status: PhysicianStatus!
    notes: String
  }

  input CreatePhysicianInput {
    name: String!
    mspNumber: Int!
    addressLine1: String!
    addressLine2: String
    city: String!
    province: Province!
    postalCode: String!
    phone: String!
    status: PhysicianStatus!
    notes: String
  }

  type CreatePhysicianResult {
    ok: Boolean!
  }

  input UpsertPhysicianInput {
    mspNumber: Int!
    name: String!
    addressLine1: String!
    addressLine2: String
    city: String!
    province: Province
    postalCode: String!
    phone: String!
    status: PhysicianStatus
    notes: String
  }

  type UpsertPhysicianResult {
    ok: Boolean!
  }
`;