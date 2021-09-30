import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Prisma } from '@prisma/client'; // Prisma client
import { Resolver } from '@lib/resolvers'; // Resolver type
import { EmployeeAlreadyExistsError, EmployeeNotFoundError } from '@lib/employees/errors'; // Employee errors
import { DBErrorCode, getUniqueConstraintFailedFields } from '@lib/db/errors'; // Database errors
import { SortOrder } from '@tools/types'; // Sorting Type

/**
 * Query for one employee in the internal-facing app given id
 * @returns employee if found, null otherwise
 */
export const employee: Resolver = async (_parent, args, { prisma }) => {
  const employee = await prisma.employee.findUnique({
    where: {
      id: parseInt(args.id),
    },
  });
  return employee;
};

/**
 * Query all the RCD employees in the internal-facing app
 * @returns All RCD employees
 */
export const employees: Resolver = async (_parent, { filter }, { prisma }) => {
  const sortingOrder: Record<string, SortOrder> = {};
  if (filter?.order) {
    filter.order.forEach(([field, order]: [string, SortOrder]) => (sortingOrder[field] = order));
  }
  const employees = await prisma.employee.findMany({
    where: {
      active: true,
    },
    orderBy: [
      { firstName: sortingOrder.name || SortOrder.ASC },
      { lastName: sortingOrder.name || SortOrder.ASC },
    ],
  });
  return {
    result: employees,
  };
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

/**
 * Update an employee
 * @returns status of operation (ok)
 */
export const updateEmployee: Resolver = async (_, args, { prisma }) => {
  const { input } = args;
  const { id, ...rest } = input;
  const employeeData = { ...rest };

  let updatedEmployee;
  try {
    updatedEmployee = await prisma.employee.update({
      where: {
        id: parseInt(id),
      },
      data: employeeData,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === DBErrorCode.RecordNotFound) {
        throw new EmployeeNotFoundError(`Employee with ID ${id} not found`);
      }
      if (
        err.code === DBErrorCode.UniqueConstraintFailed &&
        getUniqueConstraintFailedFields(err)?.includes('email')
      ) {
        throw new EmployeeAlreadyExistsError(`Employee with email ${input.email} already exists`);
      }
    }
  }

  if (!updatedEmployee) {
    throw new ApolloError('Employee was unable to be updated');
  }

  return {
    ok: true,
  };
};
