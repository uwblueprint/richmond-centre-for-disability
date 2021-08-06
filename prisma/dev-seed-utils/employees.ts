/* eslint-disable no-console */
// Relative paths required, path aliases throw error with seed command
import prisma from '../index'; // Prisma client
import { Role } from '../../lib/graphql/types'; // GraphQL types

// Seed data
const employees = [
  {
    firstName: 'Oustan',
    lastName: 'Ding',
    email: 'oustanding+employee@uwblueprint.org',
  },
  {
    firstName: 'Christian',
    lastName: 'Chan',
    email: 'christianchan+employee@uwblueprint.org',
  },
  {
    firstName: 'Jihad',
    lastName: 'Bunkheila',
    email: 'jihadbunkheila+employee@uwblueprint.org',
  },
  {
    firstName: 'Angela',
    lastName: 'Dietz',
    email: 'angeladietz+employee@uwblueprint.org',
  },
  {
    firstName: 'Emilio',
    lastName: 'Mena',
    email: 'emiliomena+employee@uwblueprint.org',
  },
  {
    firstName: 'Jeffrey',
    lastName: 'Zhang',
    email: 'jeffreyzhang+employee@uwblueprint.org',
  },
  {
    firstName: 'Jennifer',
    lastName: 'Tsai',
    email: 'jennifertsai+employee@uwblueprint.org',
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
        role: Role.Admin,
        firstName: employee.firstName,
        lastName: employee.lastName,
      },
      create: {
        role: Role.Admin,
        email: employee.email,
        firstName: employee.firstName,
        lastName: employee.lastName,
      },
    });
    employeeUpserts.push(employeeUpsert);
    console.log({ employeeUpsert });
  }
}
