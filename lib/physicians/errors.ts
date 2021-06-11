import { ApolloError } from 'apollo-server-errors';

/**
 * Physician create errors
 */
export class PhysicianCreateError extends ApolloError {
  constructor(message: string) {
    super(message, 'PHYSICIAN_CREATE_ERROR');

    Object.defineProperty(this, 'name', { value: 'PhysicianCreateError' });
  }
}
