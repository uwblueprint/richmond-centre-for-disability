import { Session } from 'next-auth'; // Session type
import { Role } from '@lib/graphql/types'; // Role enum

/**
 * Verifies that a user has one of the required roles to access a page
 * @param session - Session object from NextAuth
 * @param rolesAllowed - Readonly array of roles required - if not provided, user must be an Admin
 * @returns whether the user is authorized
 */
export const authorize = (session: Session | null, rolesAllowed?: ReadonlyArray<Role>): boolean => {
  // User must be signed in and must have a valid role
  if (!session || !session.role) {
    return false;
  }

  // Admins have access to all pages
  if (session.role === Role.Admin) {
    return true;
  }

  // All roles are permitted if the rolesAllowed parameter is not provided
  if (rolesAllowed === undefined) {
    return true;
  }

  // Check whether the user's role is allowed to access the page
  return rolesAllowed.includes(session.role as Role);
};
