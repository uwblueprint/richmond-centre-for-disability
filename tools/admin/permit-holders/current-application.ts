import {
  Application,
  ApplicationProcessing,
  Invoice,
  MedicalInformation,
  Permit,
  RenewalApplication,
} from '@lib/graphql/types';
import { NewApplication } from '@prisma/client';

/** Current application type */
export type CurrentApplication = Pick<Application, 'id' | 'permitType'> & {
  processing: Pick<ApplicationProcessing, 'status' | 'documentsUrl' | 'documentsS3ObjectKey'> & {
    invoice: Pick<Invoice, 's3ObjectUrl' | 's3ObjectKey'> | null;
  };
  permit: Pick<Permit, 'expiryDate'> | null;
} & (
    | ({ type: 'NEW' } & Pick<
        NewApplication,
        | 'disability'
        | 'disabilityCertificationDate'
        | 'patientCondition'
        | 'otherPatientCondition'
        | 'mobilityAids'
        | 'temporaryPermitExpiry'
        | 'usesAccessibleConvertedVan'
        | 'accessibleConvertedVanLoadingMethod'
        | 'requiresWiderParkingSpace'
        | 'requiresWiderParkingSpaceReason'
        | 'otherRequiresWiderParkingSpaceReason'
      >)
    | ({ type: 'RENEWAL' } & {
        disability: undefined;
        disabilityCertificationDate: undefined;
        patientCondition: undefined;
        otherPatientCondition: undefined;
        mobilityAids: undefined;
        temporaryPermitExpiry: undefined;
      } & Pick<
          RenewalApplication,
          | 'usesAccessibleConvertedVan'
          | 'accessibleConvertedVanLoadingMethod'
          | 'requiresWiderParkingSpace'
          | 'requiresWiderParkingSpaceReason'
          | 'otherRequiresWiderParkingSpaceReason'
        >)
    | ({ type: 'REPLACEMENT' } & {
        disability: undefined;
        disabilityCertificationDate: undefined;
        patientCondition: undefined;
        otherPatientCondition: undefined;
        mobilityAids: undefined;
        temporaryPermitExpiry: undefined;
        usesAccessibleConvertedVan: undefined;
        accessibleConvertedVanLoadingMethod: undefined;
        requiresWiderParkingSpace: undefined;
        requiresWiderParkingSpaceReason: undefined;
        otherRequiresWiderParkingSpaceReason: undefined;
      })
  );

/** Applicant medical information type in current application card */
export type MedicalInformationSectionData = Pick<
  MedicalInformation,
  | 'disability'
  | 'disabilityCertificationDate'
  | 'patientCondition'
  | 'otherPatientCondition'
  | 'mobilityAids'
>;
