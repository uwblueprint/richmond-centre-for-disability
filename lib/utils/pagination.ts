import { UserInputError } from 'apollo-server-micro';

import { SEARCH_PAGE_SIZE, MAX_SEARCH_PAGE_SIZE } from './search-limits';

export function getSearchPagination(
  filter?: { limit?: number | null; offset?: number | null } | null
): { take: number; skip: number } {
  const take = filter?.limit ?? SEARCH_PAGE_SIZE;
  const skip = filter?.offset ?? 0;
  if (!Number.isSafeInteger(take) || take < 1 || take > MAX_SEARCH_PAGE_SIZE) {
    throw new UserInputError(`limit must be an integer between 1 and ${MAX_SEARCH_PAGE_SIZE}`);
  }
  if (!Number.isSafeInteger(skip) || skip < 0) {
    throw new UserInputError('offset must be a nonnegative integer');
  }
  return { take, skip };
}
