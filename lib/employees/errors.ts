import { ApolloError } from 'apollo-server-errors';

/**
 * Employee with some email already exists
 */
export class EmployeeAlreadyExistsError extends ApolloError {
  constructor(message: string) {
    super(message, 'EMPLOYEE_ALREADY_EXISTS');

    Object.defineProperty(this, 'name', { value: 'EmployeeAlreadyExistsError' });
  }
}
