import {
  newPermitHolderInformationSchema,
  requestPermitHolderInformationSchema,
} from '@lib/applicants/validation';
import { physicianAssessmentSchema } from '@lib/physicians/validation';

/**
 * Create new request form validation schema
 */
export const createNewRequestFormSchema =
  newPermitHolderInformationSchema.concat(physicianAssessmentSchema);

/**
 * Create renewal request form validation schema
 */
export const renewalRequestFormSchema = requestPermitHolderInformationSchema;

/**
 * Create replacement request form validation schema
 */
export const replacementFormSchema = requestPermitHolderInformationSchema;
