import { phoneNumberRegex, postalCodeRegex } from '@lib/utils/validation';
import { MobilityAid, PatientCondition, PermitType } from '@prisma/client';
import { date, lazy, mixed, object, string, array, number } from 'yup';

/**
 * Validation schema for physician assessment form
 */
export const physicianAssessmentSchema = object({
  disability: string().required('Please enter a disabling condition'),
  disabilityCertificationDate: lazy(() =>
    date()
      .transform((_value, originalValue) => {
        return new Date(originalValue);
      })
      .max(new Date(), 'Date must be in the past')
      .required('Please enter a valid certification date')
  ),
  patientCondition: array(
    mixed<PatientCondition>()
      .oneOf(Object.values(PatientCondition))
      .required('Please select a condition')
  )
    .default([])
    .min(1, 'Please select at least one condition'),
  otherPatientCondition: string()
    .nullable()
    .default(null)
    .when('patientCondition', (value, _schema) => {
      return value.includes('OTHER')
        ? string()
            .typeError('Please enter a description for the condition')
            .required('Please enter a description for the condition')
        : string().nullable().default(null);
    }),
  permitType: mixed<PermitType>()
    .oneOf(Object.values(PermitType))
    .required('Please select a mobility impairment type'),
  temporaryPermitExpiry: date()
    .transform((_value, originalValue) => {
      return new Date(originalValue);
    })
    .when('permitType', {
      is: 'TEMPORARY',
      then: date()
        .typeError('Please select an expiry date')
        .min(new Date(Date.now() - 86400000), 'Date must be in the future') //set min date to yesterday so expiry is on or after current day
        .required('Please select an expiry date'),
      otherwise: date().nullable().default(null),
    }),
  mobilityAids: array(
    mixed<MobilityAid>()
      .oneOf(Object.values(MobilityAid))
      .required('Please select a mobility impairment type')
  ).required(),
  otherMobilityAids: string()
    .nullable()
    .default(null)
    .when('mobilityAids', mobilityAids => {
      return mobilityAids.includes('OTHERS')
        ? string()
            .typeError('Please enter a description for the mobility aids')
            .required('Please enter a description for the mobility aids') // add required validation
        : string().nullable().default(null);
    }),
});

/**
 * Validation schema for edit reason for replacement form
 */
export const editPhysicianAssessmentSchema = object({
  physicianAssessment: physicianAssessmentSchema,
});

/**
 * Validation schema for physician assessment mutation
 */
export const physicianAssessmentMutationSchema = physicianAssessmentSchema.shape({
  id: number().positive('Invalid application ID').required('Application ID missing'),
});

/**
 * Create New / Doctor's Information validation schema
 */

export const requestPhysicianInformationSchema = object({
  firstName: string().required('Please enter a first name'),
  lastName: string().required('Please enter a last name'),
  mspNumber: string().required('Please enter the MSP number'),
  phone: string()
    .required('Please enter a phone number')
    .matches(phoneNumberRegex, 'Please enter a valid phone number in the format 000-000-0000'),
  addressLine1: string().required('Please enter an address'),
  addressLine2: string().nullable().default(null),
  city: string().required('Please enter a city'),
  postalCode: string()
    .required('Please enter a postal code')
    .matches(postalCodeRegex, 'Please enter a valid postal code in the format X0X 0X0'),
});

export const editPhysicianInformationSchema = object({
  doctorInformation: requestPhysicianInformationSchema,
});
