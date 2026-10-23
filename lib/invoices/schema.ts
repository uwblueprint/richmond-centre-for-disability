/**
 * GraphQL schema for invoices
 */

import { gql } from '@apollo/client';

export default gql`
  type Invoice {
    invoiceNumber: Int!
    s3ObjectKey: String
    s3ObjectUrl: String
    employee: Employee!
    createdAt: Date!
    updatedAt: Date!
  }

  type DonationTaxReceipt {
    receiptNumber: String!
    s3ObjectKey: String
    s3ObjectUrl: String
    createdAt: Date!
    updatedAt: Date!
  }
`;
