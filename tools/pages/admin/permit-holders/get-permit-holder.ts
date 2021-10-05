import { gql } from '@apollo/client'; // GraphQL queries
import {
  Applicant,
  Application,
  ApplicationProcessing,
  Permit,
  Physician,
  Guardian,
  ApplicationFileAttachments,
  UserStatus,
} from '@lib/graphql/types'; // GraphQL types

export const GET_PERMIT_HOLDER = gql`
  query GetPermitHolder($id: ID!) {
    applicant(id: $id) {
      id
      rcdUserId
      firstName
      middleName
      lastName
      gender
      customGender
      dateOfBirth
      email
      phone
      province
      city
      addressLine1
      addressLine2
      postalCode
      status

      permits {
        id
        rcdPermitId
        expiryDate
        receiptId
        active
        applicationId
        application {
          isRenewal
          applicationProcessing {
            status
          }
        }
      }

      medicalHistory {
        physician {
          name
          mspNumber
          phone
        }
      }

      medicalInformation {
        physician {
          name
          mspNumber
          addressLine1
          addressLine2
          city
          province
          postalCode
          phone
          status
          notes
        }
      }

      guardian {
        id
        firstName
        middleName
        lastName
        addressLine1
        addressLine2
        city
        province
        postalCode
        phone
        relationship
        notes
      }

      fileHistory {
        documentUrls
        appNumber
        createdAt
      }

      applications {
        id
        disability
        affectsMobility
        mobilityAidRequired
        cannotWalk100m
        aid
        createdAt
        notes
      }
    }
  }
`;

export type GetPermitHolderRequest = {
  id: number;
};

export type GetPermitHolderResponse = {
  readonly applicant: Pick<
    Applicant,
    | 'id'
    | 'rcdUserId'
    | 'firstName'
    | 'middleName'
    | 'lastName'
    | 'gender'
    | 'customGender'
    | 'dateOfBirth'
    | 'email'
    | 'phone'
    | 'province'
    | 'city'
    | 'addressLine1'
    | 'addressLine2'
    | 'postalCode'
    | 'status'
  > & {
    permits: ReadonlyArray<
      Pick<Permit, 'rcdPermitId' | 'expiryDate' | 'applicationId'> & {
        application: Pick<Application, 'isRenewal'> & {
          applicationProcessing: Pick<ApplicationProcessing, 'status'>;
        };
      }
    >;
  } & {
    readonly physician: Pick<
      Physician,
      | 'name'
      | 'mspNumber'
      | 'addressLine1'
      | 'addressLine2'
      | 'city'
      | 'province'
      | 'postalCode'
      | 'phone'
      | 'status'
      | 'notes'
    >;
  } & {
    readonly medicalHistory: ReadonlyArray<{
      readonly physician: Pick<Physician, 'name' | 'mspNumber' | 'phone'>;
    }>;
  } & {
    readonly medicalInformation: {
      readonly physician: Pick<
        Physician,
        | 'name'
        | 'mspNumber'
        | 'addressLine1'
        | 'addressLine2'
        | 'city'
        | 'province'
        | 'postalCode'
        | 'phone'
        | 'status'
        | 'notes'
      >;
    };
  } & {
    readonly guardian: Pick<
      Guardian,
      | 'id'
      | 'firstName'
      | 'middleName'
      | 'lastName'
      | 'addressLine1'
      | 'addressLine2'
      | 'city'
      | 'province'
      | 'postalCode'
      | 'phone'
      | 'relationship'
      | 'notes'
    >;
  } & {
    readonly fileHistory: ReadonlyArray<
      Pick<ApplicationFileAttachments, 'documentUrls' | 'appNumber' | 'createdAt'>
    >;
  } & {
    applications: ReadonlyArray<
      Pick<
        Application,
        | 'id'
        | 'disability'
        | 'affectsMobility'
        | 'mobilityAidRequired'
        | 'cannotWalk100m'
        | 'aid'
        | 'createdAt'
        | 'notes'
      >
    >;
  };
};

/**
 * Type for data required in Set Permit Holder Status modal
 */
export type PermitHolderToUpdateStatus = {
  readonly id: number;
  readonly status: UserStatus;
};
