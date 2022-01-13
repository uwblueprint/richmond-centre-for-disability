import { gql } from '@apollo/client'; // gql tag
import {
  Applicant,
  Application,
  ApplicationProcessing,
  ApplicationStatus,
  ApplicationType,
  PermitType,
  QueryApplicationsArgs,
} from '@lib/graphql/types'; //GraphQL types

/** Application row data */
export type ApplicationRow = {
  name: {
    firstName: string;
    middleName: string | null;
    lastName: string;
    rcdUserId: number | null;
  };
  dateReceived: Date;
  type: ApplicationType;
  permitType: PermitType;
  status: ApplicationStatus;
};

export const GET_APPLICATIONS_QUERY = gql`
  query GetApplicationsQuery($filter: ApplicationsFilter) {
    applications(filter: $filter) {
      result {
        id
        firstName
        middleName
        lastName
        type
        permitType
        createdAt
        applicant {
          rcdUserId
        }
        processing {
          status
        }
      }
      totalCount
    }
  }
`;

export type GetApplicationsRequest = QueryApplicationsArgs;

export type GetApplicationsResponse = {
  applications: {
    result: ReadonlyArray<
      Pick<
        Application,
        'id' | 'firstName' | 'middleName' | 'lastName' | 'type' | 'permitType' | 'createdAt'
      > & {
        applicant: Pick<Applicant, 'rcdUserId'>;
        processing: Pick<ApplicationProcessing, 'status'>;
      }
    >;
    totalCount: number;
  };
};
