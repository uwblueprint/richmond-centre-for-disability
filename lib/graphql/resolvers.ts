import { meta } from '@lib/meta/resolvers'; // Metadata resolvers
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
  createApplicant,
  updateApplicant,
  verifyIdentity,
} from '@lib/applicants/resolvers'; // Applicant resolvers
import { physicians, createPhysician, upsertPhysician } from '@lib/physicians/resolvers'; // Physician resolvers
import {
  application,
  applications,
  createApplication,
  updateApplication,
  createRenewalApplication,
  createReplacementApplication,
} from '@lib/applications/resolvers'; // Application resolvers
import { permits, createPermit } from '@lib/permits/resolvers'; // Permit resolvers
import {
  updateApplicationProcessing,
  completeApplication,
} from '@lib/application-processing/resolvers'; // Application processing resolvers
import { IFieldResolver } from 'graphql-tools'; // GraphQL field resolver
import { Context } from '@lib/context'; // Context type
import { dateScalar } from '@lib/scalars'; // Custom date scalar implementation
import { authorize } from '@lib/authorization'; // Authorization wrapper
import { Role } from '@lib/types'; // Role type
import {
  applicantApplicationsResolver,
  applicantPermitsResolver,
  applicantGuardianResolver,
  applicantMedicalInformationResolver,
  applicantMedicalHistoryResolver,
  applicantMostRecentPermitResolver,
  applicantActivePermitResolver,
  applicantFileHistoryResolver,
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

// Resolver type
export type Resolver<P = undefined> = IFieldResolver<P, Context>;

// authorize is a wrapper around graphQL resolvers that protects and restricts routes based on RCD employee roles.
const resolvers = {
  Query: {
    meta,
    applicants: authorize(applicants, [Role.Secretary]),
    employees: authorize(employees),
    physicians: authorize(physicians, [Role.Secretary]),
    applications: authorize(applications, [Role.Secretary]),
    application: authorize(application, [Role.Secretary]),
    permits: authorize(permits, [Role.Secretary]),
    applicant: authorize(applicant, [Role.Secretary]),
    employee: authorize(employee, [Role.Admin]),
  },
  Mutation: {
    createApplicant: authorize(createApplicant, [Role.Secretary]),
    updateApplicant: authorize(updateApplicant, [Role.Secretary]),
    createEmployee: authorize(createEmployee),
    updateEmployee: authorize(updateEmployee, [Role.Admin]),
    deleteEmployee: authorize(deleteEmployee, [Role.Admin]),
    createPhysician: authorize(createPhysician, [Role.Secretary]),
    upsertPhysician: authorize(upsertPhysician, [Role.Secretary]),
    createApplication: authorize(createApplication, [Role.Secretary]),
    createRenewalApplication,
    createReplacementApplication,
    updateApplication: authorize(updateApplication, [Role.Secretary]),
    createPermit: authorize(createPermit, [Role.Secretary]),
    updateMedicalInformation: authorize(updateMedicalInformation, [Role.Secretary]),
    updateGuardian: authorize(updateGuardian, [Role.Secretary]),
    updateApplicationProcessing: authorize(updateApplicationProcessing, [Role.Secretary]),
    completeApplication: authorize(completeApplication, [Role.Secretary]),
    verifyIdentity,
  },
  Date: dateScalar,
  Applicant: {
    applications: applicantApplicationsResolver,
    permits: applicantPermitsResolver,
    guardian: applicantGuardianResolver,
    medicalInformation: applicantMedicalInformationResolver,
    medicalHistory: applicantMedicalHistoryResolver,
    mostRecentPermit: applicantMostRecentPermitResolver,
    activePermit: applicantActivePermitResolver,
    fileHistory: applicantFileHistoryResolver,
  },
  Application: {
    applicant: applicationApplicantResolver,
    permit: applicationPermitResolver,
    applicationProcessing: applicationApplicationProcessingResolver,
    replacement: applicationReplacementResolver,
    renewal: applicationRenewalResolver,
  },
  MedicalInformation: {
    physician: medicalInformationPhysicianResolver,
  },
  Permit: {
    applicant: permitApplicantResolver,
    application: permitApplicationResolver,
  },
};

export default resolvers;
