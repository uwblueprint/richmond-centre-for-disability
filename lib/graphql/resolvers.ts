import { meta } from '@lib/meta/resolvers'; // Metadata resolvers
import { employees, createEmployee } from '@lib/employees/resolvers'; // Employee resolvers
import { applicants, createApplicant } from '@lib/applicants/resolvers'; // Applicant resolvers
import { physicians, createPhysician } from '@lib/physicians/resolvers'; // Physician resolvers
import { applications, createApplication } from '@lib/applications/resolvers';
import { permits, createPermit } from '@lib/permits/resolvers';
import { IFieldResolver } from 'graphql-tools'; // GraphQL field resolver
import { Context } from '@lib/context'; // Context type
import { dateScalar } from '@lib/scalars'; // Custom date scalar implementation
import { authorize } from '@lib/authorization';
import { Role } from '@lib/types';

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
  },
  Mutation: {
    createApplicant: authorize(createApplicant, [Role.Secretary]),
    createEmployee: authorize(createEmployee),
    createPhysician: authorize(createPhysician, [Role.Secretary]),
    createApplication: authorize(createApplication, [Role.Secretary]),
    createPermit: authorize(createPermit, [Role.Secretary]),
  },
  Date: dateScalar,
};

export default resolvers;
