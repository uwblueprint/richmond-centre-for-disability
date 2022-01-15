/** Guardian information in forms */
export type GuardianInformation = {
  firstName: string;
  middleName: string | null;
  lastName: string;
  relationship: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  postalCode: string;
  poaFormUrl: string | null;
};
