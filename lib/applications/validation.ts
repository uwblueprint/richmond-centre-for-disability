import {
  permitHolderInformationSchema,
  requestPermitHolderInformationSchema,
} from '@lib/applicants/validation';
import { physicianAssessmentSchema } from '@lib/physicians/validation';
import { object, string } from 'yup';

/**
 * Create new request form validation schema
 */
export const createNewRequestFormSchema = object({
  permitHolder: permitHolderInformationSchema,
  physicianAssessment: physicianAssessmentSchema,
  paymentInformation: paymentInformationSchema,
});

/**
 * Create renewal request form validation schema
 */
export const renewalRequestFormSchema = object({
  permitHolder: requestPermitHolderInformationSchema,
  paymentInformation: paymentInformationSchema,
});

/**
 * Create replacement request form validation schema
 */
export const replacementFormSchema = object({
  permitHolder: requestPermitHolderInformationSchema,
  paymentInformation: paymentInformationSchema,
});
