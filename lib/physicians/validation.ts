import { PatientCondition, PermitType } from '@prisma/client';
import { date, mixed, object, string } from 'yup';

/**
 * Validation schema for physician assessment form
 */
export const physicianAssessmentSchema = object({
  disability: string().required('Please enter a disabling condition'),
  disabilityCertificationDate: date().required('Please enter a valid certification date'),
  patientCondition: mixed<PatientCondition>()
    .oneOf(Object.values(PatientCondition))
    .required('Please select a condition'),
  otherPatientCondition: string()
    .nullable()
    .default(null)
    .when('patientCondition', {
      is: 'OTHER',
      then: string()
        .typeError('Please enter a description for the condition')
        .required('Please enter a description for the condition'),
      otherwise: string().nullable().default(null),
    }),
  permitType: mixed<PermitType>()
    .oneOf(Object.values(PermitType))
    .required('Please select a mobility impairment type'),
  temporaryPermitExpiry: date().when('permitType', {
    is: 'TEMPORARY',
    then: date().typeError('Please select an expiry date').required('Please select an expiry date'),
    otherwise: date().nullable().default(null),
  }),
});
