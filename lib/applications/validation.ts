import {
  newPermitHolderInformationSchema,
  requestPermitHolderInformationSchema,
} from '@lib/applicants/validation';

/**
 * Create new request form validation schema
 */
export const createNewRequestFormSchema = newPermitHolderInformationSchema;

/**
 * Create renewal request form validation schema
 */
export const renewalRequestFormSchema = requestPermitHolderInformationSchema;

/**
 * Create replacement request form validation schema
 */
export const replacementFormSchema = requestPermitHolderInformationSchema;
