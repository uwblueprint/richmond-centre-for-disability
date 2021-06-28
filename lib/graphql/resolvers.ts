import { meta } from '@lib/meta/resolvers'; // Metadata resolvers
import { employees, createEmployee } from '@lib/employees/resolvers'; // Employee resolvers
import { applicants, createApplicant } from '@lib/applicants/resolvers'; // Applicant resolvers
import { physicians, createPhysician } from '@lib/physicians/resolvers'; // Physician resolvers
import { applications, createApplication } from '@lib/applications/resolvers';
import { permits, createPermit } from '@lib/permits/resolvers';
import { IFieldResolver } from 'graphql-tools'; // GraphQL field resolver
import { Context } from '@lib/context'; // Context type
import { dateScalar } from '@lib/scalars'; // Custom date scalar implementation
import { authenticate } from '@lib/auth-guards';
import { Role } from '@lib/graphql/types';

// Resolver type
export type Resolver<P = undefined> = IFieldResolver<P, Context>;

const resolvers = {
  Query: {
    meta: meta,
    applicants: authenticate(applicants, [Role.Admin, Role.Secretary]),
    employees: authenticate(employees, [Role.Admin]),
    physicians: authenticate(physicians, [Role.Admin, Role.Secretary]),
    applications: authenticate(applications, [Role.Admin, Role.Secretary]),
    permits: authenticate(permits, [Role.Admin, Role.Secretary]),
  },
  Mutation: {
    createApplicant: authenticate(createApplicant, [Role.Admin, Role.Secretary]),
    createEmployee: authenticate(createEmployee, [Role.Admin]),
    createPhysician: authenticate(createPhysician, [Role.Admin, Role.Secretary]),
    createApplication: authenticate(createApplication, [Role.Admin, Role.Secretary]),
    createPermit: authenticate(createPermit, [Role.Admin, Role.Secretary]),
  },
  Date: dateScalar,
};

export default resolvers;
