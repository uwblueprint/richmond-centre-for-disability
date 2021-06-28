import { Role } from '@prisma/client';
import { Resolver } from '@lib/resolvers';

/**
 * authorize is a wrapper function around graphQL resolvers that grants or denies access to certain resources based on an employee's role.
 * @param {Resolver} resolver graphQL resolver for query or mutation.
 * @param {ReadonlyArray<Role>} authorizedRoles array of roles that are authorized to access this resource.
 * @returns {Resolver | null} resolver if authorized or null otherwise.
 */
export const authorize =
  (resolver: Resolver, authorizedRoles: ReadonlyArray<Role>): Resolver =>
  (root, args, context, info) => {
    const userRole = context.session?.user?.role;

    // If user has the necessary permissions, allow the query or mutation to go through.
    if (userRole && authorizedRoles.includes(userRole)) {
      return resolver(root, args, context, info);
    }

    // Otherwise restrict and respond with null.
    return null;
  };
