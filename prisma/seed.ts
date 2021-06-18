import prisma from '../prisma/index'; // Relative path required, path aliases throw error with seed command
import { Role } from '@prisma/client';

const main = async () => {
  if (process.env.NODE_ENV === 'production') {
    await prodSeed();
  } else {
    await devSeed();
  }
};

const prodSeed = async () => {
  const employees = [
    {
      firstName: 'Oustan',
      lastName: 'Ding',
      email: 'oustanding+employee@uwblueprint.org',
    },
  ];

  await employeeUpsert(employees);
};

const devSeed = async () => {
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

  await employeeUpsert(employees);
};

const employeeUpsert = async (
  employees: { firstName: string; lastName: string; email: string }[]
) => {
  const employeeUpserts = [];

  for (const employee of employees) {
    const employeeUpsert = await prisma.employee.upsert({
      where: { email: employee.email },
      update: {
        role: Role.ADMIN,
        firstName: employee.firstName,
        lastName: employee.lastName,
        emailVerified: new Date().toISOString(),
      },
      create: {
        role: Role.ADMIN,
        email: employee.email,
        firstName: employee.firstName,
        lastName: employee.lastName,
        emailVerified: new Date().toISOString(),
      },
    });
    employeeUpserts.push(employeeUpsert);
    // eslint-disable-next-line no-console
    console.log({ employeeUpsert });
  }
};

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
