import { GraphQLResolveInfo } from 'graphql'; // GraphQL
import { MergeInfo } from 'apollo-server-micro'; // Apollo server
import {
  employees,
  createEmployee,
  updateEmployee,
  employee,
  deleteEmployee,
} from '@lib/employees/resolvers'; // Employee resolvers
import {
  applicant,
  applicants,
  updateApplicantGeneralInformation,
  updateApplicantDoctorInformation,
  updateApplicantGuardianInformation,
  verifyIdentity,
} from '@lib/applicants/resolvers'; // Applicant resolvers
import {
  application,
  applications,
  createNewApplication,
  createRenewalApplication,
  createExternalRenewalApplication,
  createReplacementApplication,
  generateApplicationsReport,
  updateApplicationGeneralInformation,
  updateApplicationDoctorInformation,
  updateApplicationAdditionalInformation,
  updateApplicationPaymentInformation,
  updateApplicationReasonForReplacement,
  updateApplicationPhysicianAssessment,
} from '@lib/applications/resolvers'; // Application resolvers
import {
  updateApplicationProcessing,
  completeApplication,
} from '@lib/application-processing/resolvers'; // Application processing resolvers
import { Context } from '@lib/graphql/context'; // Context type
import { dateScalar } from '@lib/graphql/scalars'; // Custom date scalar implementation
import { authorize } from '@lib/graphql/authorization'; // Authorization wrapper
import {
  applicantApplicationsResolver,
  applicantPermitsResolver,
  applicantGuardianResolver,
  applicantMedicalInformationResolver,
  applicantMedicalHistoryResolver,
  applicantMostRecentPermitResolver,
  applicantActivePermitResolver,
  applicantFileHistoryResolver,
  applicantMostRecentRenewalApplicationResolver,
  applicantMostRecentApplicationResolver,
} from '@lib/applicants/field-resolvers'; // Applicant field resolvers
import {
  applicationApplicantResolver,
  applicationPermitResolver,
  applicationApplicationProcessingResolver,
  applicationRenewalResolver,
} from '@lib/applications/field-resolvers'; // Application field resolvers
import { permitApplicantResolver, permitApplicationResolver } from '@lib/permits/field-resolvers'; // Permit field resolvers
import { updateMedicalInformation } from '@lib/medical-information/resolvers'; // Medical information resolvers
import { medicalInformationPhysicianResolver } from '@lib/medical-information/field-resolvers'; // Medical information field resolvers
import { updateGuardian } from '@lib/guardian/resolvers'; // Guardian resolvers
import { applicationReplacementResolver } from '@lib/applications/field-resolvers'; // Application replacement resolver
import { generatePermitHoldersReport } from '@lib/reports/resolvers';

/**
 * Resolver return type - accounts for extra fields
 * R - Return object
 */
export type ResolverResult<R> =
  | (R & Record<string, unknown>) // Return object without ID field
  | (R & Record<string, unknown> & { id: number })
  | null; // Return object with ID field

/**
 * Resolver type
 * A - Type of args (required)
 * R - Return object type; make sure to omit keys handled by field resolvers
 */
export type Resolver<A, R> = (
  parent: undefined,
  args: A,
  context: Context,
  info: GraphQLResolveInfo & {
    mergeInfo: MergeInfo;
  }
) => ResolverResult<R> | Promise<ResolverResult<R>>;

/**
 * Field resolver type
 * P - Type of parent (required)
 * R - Return object
 */
export type FieldResolver<P, R> = (
  parent: P,
  args: undefined,
  context: Context,
  info: GraphQLResolveInfo & {
    mergeInfo: MergeInfo;
  }
) => ResolverResult<R> | Promise<ResolverResult<R>>;

// authorize is a wrapper around graphQL resolvers that protects and restricts routes based on RCD employee roles.
const resolvers = {
  Query: {
    // Applicants
    applicants: authorize(applicants, ['SECRETARY']),
    applicant: authorize(applicant, ['SECRETARY']),

    // Applications
    applications: authorize(applications, ['SECRETARY']),
    application: authorize(application, ['SECRETARY']),

    // Employees
    employees: authorize(employees),
    employee: authorize(employee),

    // Reports
    generateApplicationsReport: authorize(generateApplicationsReport, ['SECRETARY']),
    generatePermitHoldersReport: authorize(generatePermitHoldersReport, ['SECRETARY']),
  },
  Mutation: {
    // Applicants
    updateApplicantGeneralInformation: authorize(updateApplicantGeneralInformation, ['SECRETARY']),
    updateApplicantDoctorInformation: authorize(updateApplicantDoctorInformation, ['SECRETARY']),
    updateApplicantGuardianInformation: authorize(updateApplicantGuardianInformation, [
      'SECRETARY',
    ]),
    verifyIdentity,

    // Applications
    createNewApplication: authorize(createNewApplication, ['SECRETARY']),
    createRenewalApplication: authorize(createRenewalApplication, ['SECRETARY']),
    createExternalRenewalApplication,
    createReplacementApplication: authorize(createReplacementApplication, ['SECRETARY']),
    updateApplicationGeneralInformation: authorize(updateApplicationGeneralInformation, [
      'SECRETARY',
    ]),
    updateApplicationDoctorInformation: authorize(updateApplicationDoctorInformation, [
      'SECRETARY',
    ]),
    updateApplicationAdditionalInformation: authorize(updateApplicationAdditionalInformation, [
      'SECRETARY',
    ]),
    updateApplicationPaymentInformation: authorize(updateApplicationPaymentInformation, [
      'SECRETARY',
    ]),
    updateApplicationReasonForReplacement: authorize(updateApplicationReasonForReplacement, [
      'SECRETARY',
    ]),
    updateApplicationPhysicianAssessment: authorize(updateApplicationPhysicianAssessment, [
      'SECRETARY',
    ]),

    // Application processing
    completeApplication: authorize(completeApplication, ['SECRETARY']),

    // Employees
    createEmployee: authorize(createEmployee),
    updateEmployee: authorize(updateEmployee),
    deleteEmployee: authorize(deleteEmployee),
  },
  Date: dateScalar,
  Applicant: {
    // applications: applicantApplicationsResolver,
    // permits: applicantPermitsResolver,
    // guardian: applicantGuardianResolver,
    // medicalInformation: applicantMedicalInformationResolver,
    // medicalHistory: applicantMedicalHistoryResolver,
    // mostRecentPermit: applicantMostRecentPermitResolver,
    // activePermit: applicantActivePermitResolver,
    // fileHistory: applicantFileHistoryResolver,
    // mostRecentRenewal: applicantMostRecentRenewalApplicationResolver,
    // mostRecentApplication: applicantMostRecentApplicationResolver,
  },
  Application: {
    // applicant: applicationApplicantResolver,
    // permit: applicationPermitResolver,
    // applicationProcessing: applicationApplicationProcessingResolver,
    // replacement: applicationReplacementResolver,
    // renewal: applicationRenewalResolver,
  },
  MedicalInformation: {
    // physician: medicalInformationPhysicianResolver,
  },
  Permit: {
    // applicant: permitApplicantResolver,
    // application: permitApplicationResolver,
  },
};

export default resolvers;
