import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Prisma } from '@prisma/client'; // Prisma client
import { Resolver } from '@lib/graphql/resolvers'; // Resolver type
import {
  EmployeeAlreadyDeletedError,
  EmployeeAlreadyExistsError,
  EmployeeNotFoundError,
} from '@lib/employees/errors'; // Employee errors
import { DBErrorCode, getUniqueConstraintFailedFields } from '@lib/db/errors'; // Database errors
import { SortOrder } from '@tools/types'; // Sorting Type
import {
  CreateEmployeeResult,
  DeleteEmployeeResult,
  Employee,
  MutationCreateEmployeeArgs,
  MutationDeleteEmployeeArgs,
  MutationSetEmployeeAsActiveArgs,
  MutationUpdateEmployeeArgs,
  QueryEmployeeArgs,
  QueryEmployeesArgs,
  SetEmployeeAsActiveResult,
  UpdateEmployeeResult,
} from '@lib/graphql/types';

/**
 * Query for one employee in the internal-facing app given id
 * @returns employee if found, null otherwise
 */
export const employee: Resolver<QueryEmployeeArgs, Employee> = async (
  _parent,
  args,
  { prisma }
) => {
  const employee = await prisma.employee.findUnique({
    where: {
      id: args.id,
    },
  });
  return employee;
};

/**
 * Query all the RCD employees in the internal-facing app
 * Sorting:
 * - order: array of tuples of the field being sorted and the order. Default [['firstName', 'asc'], ['lastName', 'asc']]
 *
 * Pagination:
 * - offset: Number of results to skip.
 * - limit: Number of result to return
 * @returns All RCD employees
 */
export const employees: Resolver<
  QueryEmployeesArgs,
  { result: Array<Employee>; totalCount: number }
> = async (_parent, { filter }, { prisma }) => {
  const sortingOrder: Record<string, SortOrder> = {};
  if (filter?.order) {
    filter.order.forEach(([field, order]) => (sortingOrder[field] = order as SortOrder));
  }

  const take = filter?.limit || undefined;
  const skip = filter?.offset || undefined;

  const where = {
    active: true,
  };

  const totalCount = await prisma.employee.count({
    where,
  });

  const employees = await prisma.employee.findMany({
    where,
    skip,
    take,
    orderBy: [
      { firstName: sortingOrder.name || SortOrder.ASC },
      { lastName: sortingOrder.name || SortOrder.ASC },
    ],
  });
  return {
    result: employees,
    totalCount: totalCount,
  };
};

/**
 * Create an RCD employee
 * @returns Status of operation (ok, error)
 */
export const createEmployee: Resolver<MutationCreateEmployeeArgs, CreateEmployeeResult> = async (
  _,
  args,
  { prisma }
) => {
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
    employee: user,
  };
};

/**
 * Update an employee
 * @returns status of operation (ok)
 */
export const updateEmployee: Resolver<MutationUpdateEmployeeArgs, UpdateEmployeeResult> = async (
  _,
  args,
  { prisma }
) => {
  const { input } = args;
  const { id, ...rest } = input;
  const employeeData = { ...rest };

  let updatedEmployee;
  try {
    updatedEmployee = await prisma.employee.update({
      where: {
        id: id,
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
    employee: updatedEmployee,
  };
};

/**
 * Delete an employee
 * @returns status of operation (ok)
 */
export const deleteEmployee: Resolver<MutationDeleteEmployeeArgs, DeleteEmployeeResult> = async (
  _,
  args,
  { prisma }
) => {
  const id = args.input.id;

  const employee = await prisma.employee.findUnique({
    where: {
      id,
    },
    select: {
      active: true,
    },
  });

  if (employee === null) {
    throw new EmployeeNotFoundError(`Employee with ID ${id} not found`);
  } else if (!employee.active) {
    throw new EmployeeAlreadyDeletedError(`Employee with ID ${id} already deleted`);
  }

  let updatedEmployee;
  try {
    updatedEmployee = await prisma.employee.update({
      where: { id },
      data: { active: false },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === DBErrorCode.RecordNotFound) {
        throw new EmployeeNotFoundError(`Employee with ID ${id} not found`);
      }
    }
  }
  if (!updatedEmployee) throw new ApolloError('Employee was unable to be deleted');
  return { ok: true, employee: updatedEmployee };
};

/**
 * Set an employee as active
 * @returns status of operation (ok) and updated employee
 */
export const setEmployeeAsActive: Resolver<
  MutationSetEmployeeAsActiveArgs,
  SetEmployeeAsActiveResult
> = async (_, args, { prisma }) => {
  const email = args.input.email;

  let updatedEmployee;
  try {
    updatedEmployee = await prisma.employee.update({
      where: { email },
      data: { active: true },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === DBErrorCode.RecordNotFound) {
        throw new EmployeeNotFoundError(`Employee with email ${email} not found`);
      }
    }
  }

  if (!updatedEmployee) {
    throw new ApolloError('Unable to set employee as active.');
  }

  return { ok: true, employee: updatedEmployee };
};
