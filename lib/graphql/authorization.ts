import { Role } from '@lib/graphql/types';
import { Resolver } from '@lib/graphql/resolvers';

/**
 * authorize is a wrapper function around graphQL resolvers that grants or denies access to certain resources based on an employee's role.
 * Admins are authorized for all routes and do not have to be added in the authorizedRoles parameter.
 * @param {Resolver} resolver - graphQL resolver for query or mutation.
 * @param {ReadonlyArray<Role>} [authorizedRoles = []] - Optional array of additonal roles that are authorized to access this resource. Admin does not have to be included as they authorized by default
 * @returns {Resolver | null} - resolver if authorized or null otherwise.
 */
export const authorize =
  (resolver: Resolver, authorizedRoles: ReadonlyArray<Role> = []): Resolver =>
  (root, args, context, info) => {
    const userRole = context.session?.role as Role;

    // If user is an Admin or has the necessary permissions, allow the query or mutation to go through.
    if (userRole && (userRole === Role.Admin || authorizedRoles.includes(userRole))) {
      return resolver(root, args, context, info);
    }

    // Otherwise restrict and respond with null.
    return null;
  };
