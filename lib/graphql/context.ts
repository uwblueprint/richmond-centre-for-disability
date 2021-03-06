import { PrismaClient } from '@prisma/client'; // PrismaClient type
import prisma from '@prisma/index'; // Prisma client
import { MicroRequest } from 'apollo-server-micro/dist/types';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/client';
import logger from '@logging'; // Logger
import { Logger } from 'pino';

export type Context = {
  prisma: PrismaClient;
  session: Session | null;
  logger: Logger;
};

export default async function context({ req }: { req: MicroRequest }): Promise<Context> {
  const session = await getSession({ req });

  return {
    prisma,
    session,
    logger,
  };
}
