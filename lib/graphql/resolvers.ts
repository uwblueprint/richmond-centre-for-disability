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
  setApplicantAsActive,
  setApplicantAsInactive,
  verifyIdentity,
} from '@lib/applicants/resolvers'; // Applicant resolvers
import {
  application,
  applications,
  createNewApplication,
  createRenewalApplication,
  createExternalRenewalApplication,
  createReplacementApplication,
  updateApplicationGeneralInformation,
  updateApplicationDoctorInformation,
  updateApplicationAdditionalInformation,
  updateApplicationPaymentInformation,
  updateApplicationReasonForReplacement,
  updateApplicationPhysicianAssessment,
  updateNewApplicationGeneralInformation,
} from '@lib/applications/resolvers'; // Application resolvers
import {
  approveApplication,
  rejectApplication,
  completeApplication,
  updateApplicationProcessingAssignAppNumber,
  updateApplicationProcessingHolepunchParkingPermit,
  updateApplicationProcessingCreateWalletCard,
  updateApplicationProcessingGenerateInvoice,
  updateApplicationProcessingUploadDocuments,
  updateApplicationProcessingMailOut,
  updateApplicationProcessingReviewRequestInformation,
} from '@lib/application-processing/resolvers'; // Application processing resolvers
import { Context } from '@lib/graphql/context'; // Context type
import { dateScalar } from '@lib/graphql/scalars'; // Custom date scalar implementation
import { authorize } from '@lib/graphql/authorization'; // Authorization wrapper
import {
  applicantMostRecentPermitResolver,
  applicantActivePermitResolver,
  applicantPermitsResolver,
  applicantCompletedApplicationsResolver,
  applicantGuardianResolver,
  applicantMedicalInformationResolver,
  applicantMostRecentApplicationResolver,
} from '@lib/applicants/field-resolvers'; // Applicant field resolvers
import {
  __resolveApplicationType,
  applicationApplicantResolver,
  applicationProcessingResolver,
  applicationPoaFormS3ObjectUrlResolver,
  applicationPermitResolver,
} from '@lib/applications/field-resolvers'; // Application field resolvers
import { medicalInformationPhysicianResolver } from '@lib/medical-information/field-resolvers';
import {
  generatePermitHoldersReport,
  generateApplicationsReport,
  generateAccountantReport,
} from '@lib/reports/resolvers';
import { permitApplicationResolver } from '@lib/permits/field-resolvers';
import { invoiceEmployeeResolver } from '@lib/invoices/field-resolvers';
import {
  applicationProcessingAppHolepunchedEmployeeResolver,
  applicationProcessingAppMailedEmployeeResolver,
  applicationProcessingAppNumberEmployeeResolver,
  applicationProcessingDocumentsUrlEmployeeResolver,
  applicationProcessingInvoiceResolver,
  applicationProcessingReviewRequestCompletedEmployeeResolver,
  applicationProcessingWalletCardCreatedEmployeeResolver,
} from '@lib/application-processing/field-resolvers';
import { guardianPoaFormS3ObjectUrlResolver } from '@lib/guardian/field-resolvers';

/**
 * Resolver return type - accounts for extra fields
 * R - Return object
 */
export type ResolverResult<R> =
  | R
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
    generateAccountantReport: authorize(generateAccountantReport, [`ACCOUNTING`]),
  },
  Mutation: {
    // Applicants
    updateApplicantGeneralInformation: authorize(updateApplicantGeneralInformation, ['SECRETARY']),
    updateApplicantDoctorInformation: authorize(updateApplicantDoctorInformation, ['SECRETARY']),
    updateApplicantGuardianInformation: authorize(updateApplicantGuardianInformation, [
      'SECRETARY',
    ]),
    setApplicantAsActive: authorize(setApplicantAsActive, ['SECRETARY']),
    setApplicantAsInactive: authorize(setApplicantAsInactive, ['SECRETARY']),
    verifyIdentity,

    // Applications
    createNewApplication: authorize(createNewApplication, ['SECRETARY']),
    createRenewalApplication: authorize(createRenewalApplication, ['SECRETARY']),
    createExternalRenewalApplication,
    createReplacementApplication: authorize(createReplacementApplication, ['SECRETARY']),
    updateApplicationGeneralInformation: authorize(updateApplicationGeneralInformation, [
      'SECRETARY',
    ]),
    updateNewApplicationGeneralInformation: authorize(updateNewApplicationGeneralInformation, [
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
    approveApplication: authorize(approveApplication, ['SECRETARY']),
    rejectApplication: authorize(rejectApplication, ['SECRETARY']),
    completeApplication: authorize(completeApplication, ['SECRETARY']),
    updateApplicationProcessingAssignAppNumber: authorize(
      updateApplicationProcessingAssignAppNumber,
      ['SECRETARY']
    ),
    updateApplicationProcessingHolepunchParkingPermit: authorize(
      updateApplicationProcessingHolepunchParkingPermit,
      ['SECRETARY']
    ),
    updateApplicationProcessingCreateWalletCard: authorize(
      updateApplicationProcessingCreateWalletCard,
      ['SECRETARY']
    ),
    updateApplicationProcessingReviewRequestInformation: authorize(
      updateApplicationProcessingReviewRequestInformation,
      ['SECRETARY']
    ),
    updateApplicationProcessingGenerateInvoice: authorize(
      updateApplicationProcessingGenerateInvoice,
      ['SECRETARY']
    ),
    updateApplicationProcessingUploadDocuments: authorize(
      updateApplicationProcessingUploadDocuments,
      ['SECRETARY']
    ),
    updateApplicationProcessingMailOut: authorize(updateApplicationProcessingMailOut, [
      'SECRETARY',
    ]),

    // Employees
    createEmployee: authorize(createEmployee),
    updateEmployee: authorize(updateEmployee),
    deleteEmployee: authorize(deleteEmployee),
  },
  Date: dateScalar,
  Applicant: {
    mostRecentPermit: applicantMostRecentPermitResolver,
    activePermit: applicantActivePermitResolver,
    permits: applicantPermitsResolver,
    mostRecentApplication: applicantMostRecentApplicationResolver,
    completedApplications: applicantCompletedApplicationsResolver,
    guardian: applicantGuardianResolver,
    medicalInformation: applicantMedicalInformationResolver,
  },
  Application: {
    __resolveType: __resolveApplicationType,
    applicant: applicationApplicantResolver,
    processing: applicationProcessingResolver,
    permit: applicationPermitResolver,
  },
  NewApplication: {
    __resolveType: __resolveApplicationType,
    applicant: applicationApplicantResolver,
    processing: applicationProcessingResolver,
    poaFormS3ObjectUrl: applicationPoaFormS3ObjectUrlResolver,
  },
  RenewalApplication: {
    __resolveType: __resolveApplicationType,
    applicant: applicationApplicantResolver,
    processing: applicationProcessingResolver,
  },
  ReplacementApplication: {
    __resolveType: __resolveApplicationType,
    applicant: applicationApplicantResolver,
    processing: applicationProcessingResolver,
  },
  Guardian: {
    poaFormS3ObjectUrl: guardianPoaFormS3ObjectUrlResolver,
  },
  MedicalInformation: {
    physician: medicalInformationPhysicianResolver,
  },
  Permit: {
    application: permitApplicationResolver,
  },
  Invoice: {
    employee: invoiceEmployeeResolver,
  },
  ApplicationProcessing: {
    invoice: applicationProcessingInvoiceResolver,
    appNumberEmployee: applicationProcessingAppNumberEmployeeResolver,
    appHolepunchedEmployee: applicationProcessingAppHolepunchedEmployeeResolver,
    walletCardCreatedEmployee: applicationProcessingWalletCardCreatedEmployeeResolver,
    reviewRequestCompletedEmployee: applicationProcessingReviewRequestCompletedEmployeeResolver,
    documentsUrlEmployee: applicationProcessingDocumentsUrlEmployeeResolver,
    appMailedEmployee: applicationProcessingAppMailedEmployeeResolver,
  },
};

export default resolvers;
