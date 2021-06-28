import { Role } from '@prisma/client';
import { Resolver } from './resolvers';

export const authenticate =
  (resolver: Resolver, authorizedRoles: Array<Role>): Resolver =>
  (root, args, context, info) => {
    const userRole = context.session?.user?.role;

    // If user has the necessary permissions, allow the query or mutation to go through.
    if (userRole && authorizedRoles.includes(userRole)) {
      return resolver(root, args, context, info);
    }

    // Otherwise respond with null.
    return null;
  };
