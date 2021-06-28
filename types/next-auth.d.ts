import NextAuth from 'next-auth'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Role } from '@prisma/client';

// From https://next-auth.js.org/getting-started/typescript#module-augmentation
declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  interface Session {
    user: {
      id: number;
      role: Role;
      firstName: string;
      lastName: string;
    };
  }
}
