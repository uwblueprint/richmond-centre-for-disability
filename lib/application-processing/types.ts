import { Province } from '@lib/graphql/types'; // GraphQL types

/**
 * Guardian update fields for completing new application
 */
export type CompleteNewApplicationGuardianUpdate =
  | {
      create: {
        firstName: string;
        middleName: string | null;
        lastName: string;
        phone: string;
        province: Province;
        city: string;
        addressLine1: string;
        addressLine2: string | null;
        postalCode: string;
        relationship: string;
        notes: string | null;
      };
    }
  | undefined;
