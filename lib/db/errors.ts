import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

/**
 * DB-related error codes
 */
export enum DBErrorCode {
  LengthConstraintFailed = 'P2000',
  UniqueConstraintFailed = 'P2002',
  ForeignKeyConstraintFailed = 'P2003',
  RecordNotFound = 'P2025',
}

/**
 * Get an array of the fields that failed unique constraints
 * @param err Prisma unique constraint failed error
 * @returns Array of field names that failed unique constraint, undefined if error metadata does not exist
 */
export const getUniqueConstraintFailedFields = (
  err: PrismaClientKnownRequestError
): string[] | undefined => {
  if (!err.meta || !('target' in err.meta)) {
    return undefined;
  }

  return (err.meta as { target: string[] }).target;
};
