import NextAuth from 'next-auth'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Role } from '@lib/graphql/types';

// From https://next-auth.js.org/getting-started/typescript#module-augmentation
declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  interface Session {
    user: {
      name: null;
      email: string | null;
      image: null;
    };
    id: number;
    role: Role;
    firstName: string;
    lastName: string;
  }
}
