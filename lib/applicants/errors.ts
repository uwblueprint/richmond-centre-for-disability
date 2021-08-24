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

/**
 * Applicant with same RCD user ID already exists (must be unique)
 */
export class RcdUserIdAlreadyExistsError extends ApolloError {
  constructor(message: string) {
    super(message, 'RCD_USER_ID_ALREADY_EXISTS');

    Object.defineProperty(this, 'name', { value: 'RcdUserIdAlreadyExistsError' });
  }
}

/**
 * Applicant with provided ID was not found in the DB
 */
export class ApplicantNotFoundError extends ApolloError {
  constructor(message: string) {
    super(message, 'APPLICANT_NOT_FOUND');

    Object.defineProperty(this, 'name', { value: 'ApplicantNotFoundError' });
  }
}

/**
 * Phone number suffix is of invalid length error
 */
export class InvalidPhoneNumberSuffixLengthError extends ApolloError {
  constructor(message: string) {
    super(message, 'INVALID_PHONE_NUMBER_SUFFIX');

    Object.defineProperty(this, 'name', { value: 'InvalidPhoneNumberSuffixLengthError' });
  }
}
