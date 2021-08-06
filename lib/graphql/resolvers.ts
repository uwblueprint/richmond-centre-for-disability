import { GraphQLResolveInfo } from 'graphql'; // GraphQL resolve info type
import { MergeInfo } from 'apollo-server-micro'; // Apollo server merge info type
import { meta } from '@lib/meta/resolvers'; // Metadata resolvers
import { employees, createEmployee } from '@lib/employees/resolvers'; // Employee resolvers
import { applicant, applicants, createApplicant, updateApplicant } from '@lib/applicants/resolvers'; // Applicant resolvers
import { physicians, createPhysician, upsertPhysician } from '@lib/physicians/resolvers'; // Physician resolvers
import { applications, createApplication } from '@lib/applications/resolvers';
import { permits, createPermit } from '@lib/permits/resolvers';
import { Context } from '@lib/context'; // Context type
import { dateScalar } from '@lib/scalars'; // Custom date scalar implementation
import { authorize } from '@lib/authorization';
import { Role } from '@lib/types'; // Role type
import {
  applicantApplicationsResolver,
  applicantPermitsResolver,
  applicantGuardianResolver,
  applicantMedicalInformationResolver,
  applicantMedicalHistoryResolver,
} from '@lib/applicants/field-resolvers'; // Applicant field resolvers
import {
  applicationApplicantResolver,
  applicationPermitResolver,
} from '@lib/applications/field-resolvers'; // Application field resolvers
import { permitApplicantResolver, permitApplicationResolver } from '@lib/permits/field-resolvers'; // Permit field resolvers
import { updateMedicalInformation } from '@lib/medicalInformation/resolvers'; // Medical information resolvers
import { medicalInformationPhysicianResolver } from '@lib/medicalInformation/field-resolvers'; // Medical information field resolvers
import { updateGuardian } from '@lib/guardian/resolvers'; // Guardian resolvers

/**
 * Resolver type used in GraphQL resolvers. Based on the IFieldResolver type from graphql-tools.
 * R - Return type (required)
 * A - Args type (required)
 * P - Parent type, which should be specified for field resolvers (default `undefined`)
 */
export type Resolver<A = Record<string, any>, P = undefined> = (
  parent: P,
  args: A,
  context: Context,
  info: GraphQLResolveInfo & {
    mergeInfo: MergeInfo;
  }
) => any;

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
