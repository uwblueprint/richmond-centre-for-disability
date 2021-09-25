import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Prisma } from '@prisma/client'; // Prisma client
import { Resolver } from '@lib/resolvers'; // Resolver type
import { EmployeeAlreadyExistsError } from '@lib/employees/errors'; // Employee errors
import { DBErrorCode, getUniqueConstraintFailedFields } from '@lib/db/errors'; // Database errors

/**
 * Query for one employee in the internal-facing app given id
 * @returns employee row
 */
export const employee: Resolver = async (_parent, _args, { prisma }) => {
  const employee = await prisma.employee.findUnique({
    where: {
      id: parseInt(_args.id),
    },
  });
  return employee;
};

/**
 * Query all the RCD employees in the internal-facing app
 * @returns All RCD employees
 */
export const employees: Resolver = async (_parent, _args, { prisma }) => {
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
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === DBErrorCode.UniqueConstraintFailed &&
      getUniqueConstraintFailedFields(err)?.includes('email')
    ) {
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
