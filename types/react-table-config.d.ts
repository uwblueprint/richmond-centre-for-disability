// Override React Table types
import {
  UseSortByOptions,
  UseSortByColumnOptions,
  UseSortByColumnProps,
  UseSortByState,
} from 'react-table'; // React Table types

declare module 'react-table' {
  // Add sorting options to table initialization
  export interface TableOptions<D extends Record<string, unknown>> extends UseSortByOptions<D> {}

  // Add sorting state to table state
  export interface TableState<D extends Record<string, unknown>> extends UseSortByState<D> {}

  // Add sorting options to table column interface
  export interface ColumnInterface<D extends Record<string, unknown> = Record<string, unknown>>
    extends UseSortByColumnOptions<D> {}

  // Add sorting options to table column instance
  export interface ColumnInstance<D extends Record<string, unknown> = Record<string, unknown>>
    extends UseSortByColumnProps<D> {}
}
