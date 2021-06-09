/*eslint-disable */
import { Resolver } from '@lib/resolvers'; // Resolver type

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

  await prisma.employee.create({
    data: {
      firstName,
      lastName,
      email,
      role,
    },
  });

  return {
    ok: true,
  };
};
