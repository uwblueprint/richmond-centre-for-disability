/**
 * GraphQL schema for physicians
 */

import { gql } from '@apollo/client';

export default gql`
  type Physician {
    # General information
    mspNumber: String!
    firstName: String!
    lastName: String!
    phone: String!
    status: PhysicianStatus!

    # Address
    addressLine1: String!
    addressLine2: String
    city: String!
    province: Province!
    country: String!
    postalCode: String!
  }

  input ComparePhysiciansInput {
    # General information
    mspNumber: String!
    firstName: String!
    lastName: String!
    phone: String!

    # Address
    addressLine1: String!
    addressLine2: String
    city: String!
    province: Province!
    country: String!
    postalCode: String!
  }

  # Query many doctors
  input PhysiciansFilter {
    order: [[String!]!]
    firstName: String
    lastName: String
    mspNumber: String
    limit: Int
    offset: Int
  }

  type PhysiciansResult {
    result: [Physician!]!
    totalCount: Int!
  }

  type ComparePhysiciansResult {
    match: Boolean!
    status: PhysicianMatchStatus
    existingPhysicianData: Physician
  }

  enum PhysicianMatchStatus {
    DOES_NOT_EXIST
    DOES_NOT_MATCH_EXISTING
  }
`;
