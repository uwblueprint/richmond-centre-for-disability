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

/**
 * Employee with provided ID was not found in the DB
 */
export class EmployeeNotFoundError extends ApolloError {
  constructor(message: string) {
    super(message, 'EMPLOYEE_NOT_FOUND');

    Object.defineProperty(this, 'name', { value: 'EmployeeNotFoundError' });
  }
}
