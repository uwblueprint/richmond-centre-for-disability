export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENV: 'development' | 'production' | 'test';
      PROCESSING_FEE: string;
      APPLICATION_DOCUMENT_LINK_TTL_HOURS: string;
      INVOICE_LINK_TTL_DAYS: string;
    }
  }
}
