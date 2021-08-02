/**
 * DB-related error codes
 */
export enum DBErrorCode {
  LengthConstraintFailed = 'P2000',
  UniqueConstraintFailed = 'P2002',
  ForeignKeyConstraintFailed = 'P2003',
  RecordNotFound = 'P2025',
}
