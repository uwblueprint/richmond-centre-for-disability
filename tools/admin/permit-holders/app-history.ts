import {
  Application,
  ApplicationProcessing,
  Invoice,
  NewApplication,
  Permit,
  PermitType,
} from '@lib/graphql/types';

/** APP history entry record (API response) */
export type AppHistoryRecord = Pick<Permit, 'rcdPermitId' | 'expiryDate'> & {
  application: Pick<Application, 'id'> & {
    processing: Pick<ApplicationProcessing, 'documentsUrl' | 'documentsS3ObjectKey'> & {
      invoice: Pick<Invoice, 's3ObjectUrl' | 's3ObjectKey'>;
    };
  } & (
      | ({ type: 'NEW' } & Pick<NewApplication, 'permitType'>)
      | { type: 'RENEWAL' | 'REPLACEMENT'; permitType: undefined }
    );
};

/** APP history entry row in APP history card (FE) */
export type PermitRecord = Pick<Permit, 'rcdPermitId' | 'expiryDate'> & {
  application: Pick<Application, 'id' | 'type'> & {
    processing: Pick<ApplicationProcessing, 'documentsUrl' | 'documentsS3ObjectKey'> & {
      invoice: Pick<Invoice, 's3ObjectUrl' | 's3ObjectKey'>;
    };
    permitType: PermitType | undefined;
  };
};
