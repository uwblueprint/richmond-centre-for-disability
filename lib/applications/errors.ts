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
 * Applicantion field too long error
 */
export class ApplicationFieldTooLongError extends ApolloError {
  constructor(message: string) {
    super(message, 'APPLICATION_FIELD_TOO_LONG');

    Object.defineProperty(this, 'name', { value: 'ApplicationFieldTooLongError' });
  }
}
