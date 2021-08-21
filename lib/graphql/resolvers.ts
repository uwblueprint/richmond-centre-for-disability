import { meta } from '@lib/meta/resolvers'; // Metadata resolvers
import { employees, createEmployee } from '@lib/employees/resolvers'; // Employee resolvers
import { applicant, applicants, createApplicant, updateApplicant } from '@lib/applicants/resolvers'; // Applicant resolvers
import { physicians, createPhysician, upsertPhysician } from '@lib/physicians/resolvers'; // Physician resolvers
import { applications, createApplication } from '@lib/applications/resolvers';
import { permits, createPermit } from '@lib/permits/resolvers';
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
} from '@lib/applicants/field-resolvers'; // Applicant field resolvers
import {
  applicationApplicantResolver,
  applicationPermitResolver,
} from '@lib/applications/field-resolvers'; // Application field resolvers
import { permitApplicantResolver, permitApplicationResolver } from '@lib/permits/field-resolvers'; // Permit field resolvers
import { updateMedicalInformation } from '@lib/medicalInformation/resolvers'; // Medical information resolvers
import { medicalInformationPhysicianResolver } from '@lib/medicalInformation/field-resolvers'; // Medical information field resolvers
import { updateGuardian } from '@lib/guardian/resolvers'; // Guardian resolvers

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
    permits: authorize(permits, [Role.Secretary]),
    applicant: authorize(applicant, [Role.Secretary]),
  },
  Mutation: {
    createApplicant: authorize(createApplicant, [Role.Secretary]),
    updateApplicant: authorize(updateApplicant, [Role.Secretary]),
    createEmployee: authorize(createEmployee),
    createPhysician: authorize(createPhysician, [Role.Secretary]),
    upsertPhysician: authorize(upsertPhysician, [Role.Secretary]),
    createApplication: authorize(createApplication, [Role.Secretary]),
    createPermit: authorize(createPermit, [Role.Secretary]),
    updateMedicalInformation: authorize(updateMedicalInformation, [Role.Secretary]),
    updateGuardian: authorize(updateGuardian, [Role.Secretary]),
  },
  Date: dateScalar,
  Applicant: {
    applications: applicantApplicationsResolver,
    permits: applicantPermitsResolver,
    guardian: applicantGuardianResolver,
    medicalInformation: applicantMedicalInformationResolver,
    medicalHistory: applicantMedicalHistoryResolver,
    mostRecentPermit: applicantMostRecentPermitResolver,
  },
  Application: {
    applicant: applicationApplicantResolver,
    permit: applicationPermitResolver,
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
