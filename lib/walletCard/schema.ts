/**
 * GraphQL schema for Wallets
 */

import { gql } from '@apollo/client';

export default gql`
  type WalletCard {
    walletNumber: Int!
    s3ObjectKey: String
    s3ObjectUrl: String
    employee: Employee!
    createdAt: Date!
    updatedAt: Date!
  }
`;
