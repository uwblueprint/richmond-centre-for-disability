import { ApolloError } from 'apollo-server-errors';

/**
 * Shopify confirmation number already exists
 */
export class ShopifyConfirmationNumberAlreadyExistsError extends ApolloError {
  constructor(message: string) {
    super(message, 'SHOPIFY_CONFIRMATION_NUMBER_ALREADY_EXISTS');

    Object.defineProperty(this, 'name', { value: 'ShopifyConfirmationNumberAlreadyExistsError' });
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
 * Application field too long error
 */
export class ApplicationFieldTooLongError extends ApolloError {
  constructor(message: string) {
    super(message, 'APPLICATION_FIELD_TOO_LONG');

    Object.defineProperty(this, 'name', { value: 'ApplicationFieldTooLongError' });
  }
}

/**
 * Application not found error
 */
export class ApplicationNotFoundError extends ApolloError {
  constructor(message: string) {
    super(message, 'APPLICATION_NOT_FOUND');

    Object.defineProperty(this, 'name', { value: 'ApplicationNotFoundError' });
  }
}

/**
 * Missing updated fields error (when submitting renewal application)
 */
export class UpdatedFieldsMissingError extends ApolloError {
  constructor(message: string) {
    super(message, 'UPDATED_FIELDS_MISSING_ERROR');

    Object.defineProperty(this, 'name', { value: 'UpdatedFieldsMissingError' });
  }
}

/**
 * Empty or missing fields error (when submitting replacement application)
 */
export class EmptyFieldsMissingError extends ApolloError {
  constructor(message: string) {
    super(message, 'EMPTY_FIELDS_MISSING_ERROR');

    Object.defineProperty(this, 'name', { value: 'EmptyFieldsMissingError' });
  }
}

/**
 * Permit is past 6 months expired
 */
export class AppPastSixMonthsExpiredError extends ApolloError {
  constructor(message: string) {
    super(message, 'APP_PAST_SIX_MONTHS_EXPIRED');

    Object.defineProperty(this, 'name', { value: 'AppPastSixMonthsExpiredError' });
  }
}
