import { ApolloError } from 'apollo-server-errors';

/**
 * Applicant with same email already exists
 */
export class ApplicantAlreadyExistsError extends ApolloError {
  constructor(message: string) {
    super(message, 'APPLICANT_ALREADY_EXISTS');

    Object.defineProperty(this, 'name', { value: 'ApplicantAlreadyExistsError' });
  }
}
