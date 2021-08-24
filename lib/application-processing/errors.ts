import { ApolloError } from 'apollo-server-errors'; // Apollo error

/**
 * Application not found error
 */
export class ApplicationNotFoundError extends ApolloError {
  constructor(message: string) {
    super(message, 'APPLICATION_NOT_FOUND');

    Object.defineProperty(this, 'name', { value: 'ApplicationNotFoundError' });
  }
}
