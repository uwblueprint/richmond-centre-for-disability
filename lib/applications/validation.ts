import {
  permitHolderInformationSchema,
  requestPermitHolderInformationSchema,
} from '@lib/applicants/validation';
import { physicianAssessmentSchema } from '@lib/physicians/validation';
import { ReasonForReplacement } from '@prisma/client';
import { date, mixed, number, object, string } from 'yup';

/**
 * Reason for replacement form validation schema
 */
export const reasonForReplacementFormSchema = object({
  reason: mixed<ReasonForReplacement>()
    .oneOf(Object.values(ReasonForReplacement))
    .required('Please select reason for replacement'),
  lostTimestamp: date()
    .nullable()
    .default(null)
    .when('reason', {
      is: 'LOST',
      then: date()
        .transform((_value, originalValue) => {
          return new Date(originalValue);
        })
        .typeError('Please enter date APP was lost')
        .max(new Date(), 'Date must be in the past')
        .required('Please enter date APP was lost'),
    }),
  lostLocation: string()
    .nullable()
    .default(null)
    .when('reason', {
      is: 'LOST',
      then: string()
        .typeError('Please enter location APP was lost')
        .required('Please enter location APP was lost'),
    }),
  eventDescription: string()
    .nullable()
    .default(null)
    .when('reason', {
      is: (reason: ReasonForReplacement) => reason === 'LOST' || reason === 'OTHER',
      then: string()
        .typeError('Please enter event description')
        .required('Please enter event description'),
    }),
  stolenPoliceFileNumber: number()
    .nullable()
    .default(null)
    .when('reason', {
      is: 'STOLEN',
      then: number()
        .typeError('Please enter police file number')
        .required('Please enter police file number'),
    }),
  stolenJurisdiction: string().nullable().default(null).when('reason', {
    is: 'STOLEN',
    then: string().nullable(),
  }),
  stolenPoliceOfficerName: string().nullable().default(null).when('reason', {
    is: 'STOLEN',
    then: string().nullable(),
  }),
});

/**
 * Validation schema for edit reason for replacement form
 */
export const editReasonForReplacementFormSchema = object({
  reasonForReplacement: reasonForReplacementFormSchema,
});

/**
 * Create new request form validation schema
 */
export const createNewRequestFormSchema = object({
  permitHolder: permitHolderInformationSchema,
  physicianAssessment: physicianAssessmentSchema,
});

/**
 * Create renewal request form validation schema
 */
export const renewalRequestFormSchema = object({
  permitHolder: requestPermitHolderInformationSchema,
});

/**
 * Create replacement request form validation schema
 */
export const replacementFormSchema = object({
  permitHolder: requestPermitHolderInformationSchema,
  reasonForReplacement: reasonForReplacementFormSchema,
});
