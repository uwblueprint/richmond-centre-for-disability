import { ApolloError } from 'apollo-server-errors';

/**
 * Permit with some permit ID already exists
 */
export class PermitAlreadyExistsError extends ApolloError {
  constructor(message: string) {
    super(message, 'PERMIT_ALREADY_EXISTS');

    Object.defineProperty(this, 'name', { value: 'PermitAlreadyExistsError' });
  }
}
