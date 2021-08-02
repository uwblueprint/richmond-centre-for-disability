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

/**
 * Physician with given MSP number doesn't exist
 */
export class MspNumberDoesNotExistError extends ApolloError {
  constructor(message: string) {
    super(message, 'MSP_NUMBER_DOES_NOT_EXIST_ERROR');

    Object.defineProperty(this, 'name', { value: 'MspNumberDoesNotExistError' });
  }
}
