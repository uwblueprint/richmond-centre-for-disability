import { PrismaClient } from '@prisma/client'; // PrismaClient type
import prisma from '@prisma/index'; // Prisma client

export type Context = {
  prisma: PrismaClient;
};

export default function context(): Context {
  return {
    prisma,
  };
}
