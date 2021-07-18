import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Resolver } from '@lib/resolvers'; // Resolver type
import { EmployeeAlreadyExistsError } from '@lib/employees/errors'; // Employee errors
import { DBErrorCode } from '@lib/db/errors'; // Database errors

/**
 * Queries for RCD employees in the internal-facing app
 * @returns An array of RCD employees
 */
export const employees: Resolver = async (_parent, args, { prisma }) => {
  const employees = await prisma.employee.findMany();
  return employees;
};

/**
 * Create an RCD employee
 * @returns Status of operation (ok, error)
 */
export const createEmployee: Resolver = async (_, args, { prisma }) => {
  const {
    input: { firstName, lastName, email, role },
  } = args;

  let user;
  try {
    user = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        email,
        role,
      },
    });
  } catch (err) {
    if (err.code === DBErrorCode.UniqueConstraintFailed && err.meta.target.includes('email')) {
      throw new EmployeeAlreadyExistsError(`Employee with email ${email} already exists`);
    }
  }

  // Throw internal server error if user was not created
  if (!user) {
    throw new ApolloError('User was unable to be created');
  }

  return {
    ok: true,
  };
};
