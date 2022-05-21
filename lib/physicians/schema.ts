/**
 * GraphQL schema for physicians
 */

import { gql } from '@apollo/client';

export default gql`
  type Physician {
    # General information
    mspNumber: Int!
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
`;
