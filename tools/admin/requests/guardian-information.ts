/** Guardian information in forms */
export type GuardianInformation = {
  omitGuardianPoa: boolean;
  firstName: string;
  middleName: string | null;
  lastName: string;
  relationship: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  postalCode: string;
  poaFormS3ObjectKey: string | null;
};
