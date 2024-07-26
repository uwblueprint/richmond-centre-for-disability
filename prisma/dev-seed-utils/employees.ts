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
    firstName: 'Anish',
    lastName: 'Aggarwal',
    email: 'anishaggarwal+employee@uwblueprint.org',
  },
  {
    firstName: 'Bonnie',
    lastName: 'Chin',
    email: 'bonniechin+employee@uwblueprint.org',
  },
  {
    firstName: 'Andy',
    lastName: 'Lee',
    email: 'andylee+employee@uwblueprint.org',
  },
  {
    firstName: 'Amanda',
    lastName: 'Guo',
    email: 'amandaguo+employee@uwblueprint.org',
  },
  {
    firstName: 'Vedant',
    lastName: 'Patel',
    email: 'vedantpatel+employee@uwblueprint.org',
  },
  {
    firstName: 'Carelynn',
    lastName: 'Tsai',
    email: 'carelynntsai+employee@uwblueprint.org',
  },
  {
    firstName: 'Leo',
    lastName: 'Huang',
    email: 'leohuang+employee@uwblueprint.org',
  },
  {
    firstName: 'Sherry',
    lastName: 'Li',
    email: 'sherryli+employee@uwblueprint.org',
  },
  {
    firstName: 'Chinemerem',
    lastName: 'Chigbo',
    email: 'chinemeremchigbo+employee@uwblueprint.org',
  },
  {
    firstName: 'Bowen',
    lastName: 'Zhu',
    email: 'bowenzhu+employee@uwblueprint.org',
  },
  {
    firstName: 'Adil',
    lastName: 'Kapadia',
    email: 'adilkapadia+employee@uwblueprint.org',
  },
  {
    firstName: 'Keane',
    lastName: 'Moraes',
    email: 'keanejonathan3+employee@gmail.com',
  },
  {
    firstName: 'Matthew',
    lastName: 'Wang',
    email: 'matthewwang+employee@uwblueprint.org',
  },
  {
    firstName: 'Sharujan',
    lastName: 'Sreekaran',
    email: 'sharujansreekaran+employee@uwblueprint.org',
  },
  {
    firstName: 'Jenny',
    lastName: 'Vong',
    email: 'jennyvong+employee@uwblueprint.org',
  },
  {
    firstName: 'Jennifer',
    lastName: 'Chen',
    email: 'jenn.chenn93+employee@gmail.com',
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
