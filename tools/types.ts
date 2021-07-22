// Generic types used in the platform

// SortOrder type
// Note: 'asc' and 'desc' are the values used for Prisma sorting order
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

// Sort options type that contains an array of tuples of the field being sorted and the order
export type SortOptions = ReadonlyArray<[string, SortOrder]>;
