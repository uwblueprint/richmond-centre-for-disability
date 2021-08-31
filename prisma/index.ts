import { PrismaClient } from '@prisma/client'; // Prisma ORM

// Add Prisma to the NodeJS global type
declare global {
  // var must be used for globally scoped variables
  // eslint-disable-next-line no-var
  var prisma: PrismaClient;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma;
