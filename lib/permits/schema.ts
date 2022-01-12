/**
 * GraphQL schema for permits
 */

import { gql } from '@apollo/client';

export default gql`
  type Permit {
    rcdPermitId: Int!
    type: PermitType!
    expiryDate: Date!
    active: Boolean!
  }
`;
