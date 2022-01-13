/**
 * Error thrown when verifying the sign in fails due to a DB-related error
 */
export class VerifySignInError extends Error {
  constructor(message: string) {
    super(message);
  }
}
