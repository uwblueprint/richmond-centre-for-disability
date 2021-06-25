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

/**
 * Applicant ID does not exist
 */
export class ApplicantIdDoesNotExistError extends ApolloError {
  constructor(message: string) {
    super(message, 'APPLICANT_ID_DOES_NOT_EXIST');

    Object.defineProperty(this, 'name', { value: 'ApplicantIdDoesNotExistError' });
  }
}

/**
 * Application ID does not exist
 */
export class ApplicationIdDoesNotExistError extends ApolloError {
  constructor(message: string) {
    super(message, 'APPLICATION_ID_DOES_NOT_EXIST');

    Object.defineProperty(this, 'name', { value: 'ApplicationIdDoesNotExistError' });
  }
}
