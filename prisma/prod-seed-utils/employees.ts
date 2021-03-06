/* eslint-disable no-console */
// Relative paths required, path aliases throw error with seed command
import prisma from '../index'; // Prisma client

// Seed data
const employees = [
  {
    firstName: 'Oustan',
    lastName: 'Ding',
    email: 'oustanding+employee@uwblueprint.org',
  },
];

/**
 * Upsert employees
 */
export default async function employeeUpsert(): Promise<void> {
  const employeeUpserts = [];
  for (const employee of employees) {
    const employeeUpsert = await prisma.employee.upsert({
      where: { email: employee.email },
      update: {
        role: 'ADMIN',
        firstName: employee.firstName,
        lastName: employee.lastName,
      },
      create: {
        role: 'ADMIN',
        email: employee.email,
        firstName: employee.firstName,
        lastName: employee.lastName,
      },
    });
    employeeUpserts.push(employeeUpsert);
    console.log({ employeeUpsert });
  }
}
