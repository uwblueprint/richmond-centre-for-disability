import { SortingRule } from 'react-table'; // React Table types
import { SortOrder } from '@tools/types'; // Sort order enum

// Function type of getSortOptions - Disable eslint preventing `object` from being used
// eslint-disable-next-line
type GetSortOptions = (sortBy: SortingRule<object>[]) => ReadonlyArray<[string, SortOrder]>;

/**
 * Convert the sortBy sort options to an array of tuples to be used by GQL APIs
 * @param sortBy - sortBy state provided by React Table
 * @returns array of tuples to be used by GQL APIs - every tuple is of form [string, SortOrder]
 */
export const getSortOptions: GetSortOptions = sortBy => {
  return sortBy.map(sortField => [sortField.id, sortField.desc ? SortOrder.DESC : SortOrder.ASC]);
};
