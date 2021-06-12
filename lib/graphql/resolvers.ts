import { meta } from '@lib/meta/resolvers'; // Metadata resolvers
import { employees, createEmployee } from '@lib/employees/resolvers'; // Employee resolvers
import { applicants, createApplicant } from '@lib/applicants/resolvers'; // Applicant resolvers
import { physicians, createPhysician } from '@lib/physicians/resolvers'; // Physician resolvers
import { applications, createApplication } from '@lib/applications/resolvers';
import { permits, createPermit } from '@lib/permits/resolvers';
import { IFieldResolver } from 'graphql-tools'; // GraphQL field resolver
import { Context } from '@lib/context'; // Context type
import { dateScalar } from '@lib/scalars'; // Custom date scalar implementation

// Resolver type
export type Resolver<P = undefined> = IFieldResolver<P, Context>;

const resolvers = {
  Query: {
    meta,
    applicants,
    employees,
    physicians,
    applications,
    permits,
  },
  Mutation: {
    createApplicant,
    createEmployee,
    createPhysician,
    createApplication,
    createPermit,
  },
  Date: dateScalar,
};

export default resolvers;
