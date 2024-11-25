import { Application, ApplicationProcessing, Invoice, Permit } from '@lib/graphql/types';

/** APP history entry record (API response) */
export type AppHistoryRecord = Pick<Permit, 'rcdPermitId' | 'expiryDate'> & {
  application: Pick<Application, 'id' | 'type' | 'permitType' | 'createdAt'> & {
    processing: Pick<ApplicationProcessing, 'documentsUrl' | 'documentsS3ObjectKey'> & {
      invoice: Pick<Invoice, 's3ObjectUrl' | 's3ObjectKey'>;
    };
  };
};

/** APP history entry row in APP history card (FE) */
export type PermitRecord = Pick<Permit, 'rcdPermitId' | 'expiryDate'> & {
  application: Pick<Application, 'id' | 'type' | 'permitType' | 'createdAt'> & {
    processing: Pick<ApplicationProcessing, 'documentsUrl' | 'documentsS3ObjectKey'> & {
      invoice: Pick<Invoice, 's3ObjectUrl' | 's3ObjectKey'>;
    };
  };
};
