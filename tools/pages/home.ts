import { gql } from '@apollo/client'; // gql tag
import { Meta } from '@lib/types'; // User schema

export const GET_METADATA_QUERY = gql`
  query GetOrgName {
    meta {
      orgName
    }
  }
`;

export type GetMetadataResponseType = {
  meta: Pick<Meta, 'orgName'>;
};
