import NextAuth from 'next-auth'; // Next Auth
import Providers from 'next-auth/providers'; // Next Auth providers
import Adapters from 'next-auth/adapters'; // Next Auth adapters
import prisma from '@prisma/index'; // Prisma client
import sendVerificationRequest from '@lib/auth/sendVerificationRequest'; // Send verification email
import { VerifySignInError } from '@lib/auth/errors'; // Error raised when failing to verify signin
import { Role } from '@lib/graphql/types';
import { loginSchema } from '@lib/auth/validation';
import { ValidationError } from 'yup';
import { Prisma } from '@prisma/client';

/**
 * Database config for Next Auth
 */
const databaseConfig = {
  type: 'postgres',
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: {
    sslmode: 'require',
    rejectUnauthorized: false,
  },
};

/**
 * Next Auth configuration
 */
export default NextAuth({
  providers: [
    Providers.Email({
      server: {
        host: process.env.NA_EMAIL_HOST as string,
        port: parseInt(process.env.NA_EMAIL_PORT as string, 10),
        auth: {
          user: process.env.NA_EMAIL_USER as string,
          pass: process.env.NA_EMAIL_PASSWORD as string,
        },
      },
      from: process.env.NA_EMAIL_FROM,
      maxAge: 60 * 60, // 1 hour max life for login request
      sendVerificationRequest,
    }),
  ],
  adapter: Adapters.Prisma.Adapter({
    prisma,
    modelMapping: {
      User: 'employee',
      Account: 'account',
      Session: 'session',
      VerificationRequest: 'verificationRequest',
    },
  }),
  pages: {
    error: '/admin',
    verifyRequest: '/admin/verify',
  },
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60, // 1 month expiry
    updateAge: 0, // Update JWT on each login
  },
  jwt: {
    secret: process.env.NA_JWT_SECRET,
  },
  callbacks: {
    session: async (session, user) => {
      session.role = user.role as Role;
      session.id = user.id as number;
      session.firstName = user.firstName as string;
      session.lastName = user.lastName as string;

      return Promise.resolve(session);
    },
    jwt: async (token, user) => {
      user ? (token.role = user.role) : null;
      user ? (token.id = user.id) : null;
      user ? (token.firstName = user.firstName) : null;
      user ? (token.lastName = user.lastName) : null;

      return Promise.resolve(token);
    },
    signIn: async user => {
      try {
        const validatedUser = await loginSchema.validate(user);

        // Check if user email exists in DB (throw error if not found)
        const employee = await prisma.employee.findUnique({
          where: {
            email: validatedUser.email,
          },
          select: {
            active: true,
          },
          rejectOnNotFound: true,
        });

        if (!employee.active) {
          throw new VerifySignInError('This employee is not active');
        }

        return true;
      } catch (err) {
        if (err instanceof ValidationError) {
          // Yup validation failure
          throw new VerifySignInError('Invalid email input');
        } else if ((err as Prisma.PrismaClientKnownRequestError).name === 'NotFoundError') {
          // User does not exist
          throw new VerifySignInError('This email has not been registered by the admin.');
        } else {
          throw new Error('Internal server error');
        }
      }
    },
  },
  database: databaseConfig,
});
