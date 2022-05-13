import { PatientCondition, PermitType } from '@prisma/client';
import { date, mixed, object, string } from 'yup';

/**
 * Validation schema for physician assessment form
 */
export const physicianAssessmentSchema = object({
  disability: string().required('Please enter a disabling condition'),
  disabilityCertificationDate: date()
    .max(new Date(), 'Date must be in the past')
    .required('Please enter a valid certification date'),
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
    then: date()
      .typeError('Please select an expiry date')
      .min(new Date(Date.now() - 86400000), 'Date must be in the future') //set min date to yesterday so expiry is on or after current day
      .required('Please select an expiry date'),
    otherwise: date().nullable().default(null),
  }),
});

/**
 * Create New / Doctor's Information validation schema
 */

export const requestPhysicianInformationSchema = object({
  firstName: string().required('Please enter a first name'),
  lastName: string().required('Please enter a last name'),
  mspNumber: string()
    .matches(/^\d+$/, 'Must only contain numbers')
    .required('Please enter the MSP number'),
  phone: string().min(10, 'Must be a valid phone number').required('Please enter a phone number'),
  addressLine1: string().required('Please enter an address'),
  addressLine2: string().nullable().default(null),
  city: string().required('Please enter a city'),
  postalCode: string()
    .min(6, 'Must be a valid postal code')
    .max(7, 'Must be a valid postal code')
    .required('Please enter a postal code'),
});

export const editPhysicianInformationSchema = object({
  doctorInformation: requestPhysicianInformationSchema,
});
