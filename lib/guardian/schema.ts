/**
 * GraphQL schema for guardians
 */

import { gql } from '@apollo/client';

export default gql`
  type Guardian {
    # General information
    firstName: String!
    middleName: String
    lastName: String!
    phone: String!
    relationship: String!

    # Address
    addressLine1: String!
    addressLine2: String
    city: String!
    province: Province!
    country: String!
    postalCode: String!

    # POA form
    poaFormS3ObjectKey: String
    poaFormS3ObjectUrl: String
  }
`;
