import NextAuth from 'next-auth'; // Next Auth
import Providers from 'next-auth/providers'; // Next Auth providers
import Adapters from 'next-auth/adapters'; // Next Auth adapters
import prisma from '@prisma/index'; // Prisma client
// TODO: import sendVerificationRequest

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
        host: process.env.NA_EMAIL_HOST,
        port: process.env.NA_EMAIL_PORT,
        auth: {
          user: process.env.NA_EMAIL_USER,
          pass: process.env.NA_EMAIL_PASS,
        },
      },
      from: process.env.NA_EMAIL_FROM,
      maxAge: 24 * 60, // 1 hour max life for login request
      // TODO: sendVerificationRequest
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
    error: '/',
    verifyRequest: '/verify',
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
      session.role = user.role;
      session.id = user.id;

      return Promise.resolve(session);
    },
    jwt: async (token, user) => {
      user ? (token.role = user.role) : null;
      user ? (token.id = user.id) : null;

      return Promise.resolve(token);
    },
  },
  database: databaseConfig,
});