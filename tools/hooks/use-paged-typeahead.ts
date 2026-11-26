import { useReducer, useCallback } from 'react';
import { DocumentNode, OperationVariables } from '@apollo/client';
import { useQuery } from '@tools/hooks/graphql';
import { SEARCH_PAGE_SIZE } from '@lib/utils/search-limits';

type SearchState = { input: string; search: string; offset: number };
const initialState: SearchState = { input: '', search: '', offset: 0 };
type Action =
  | { type: 'input'; value: string }
  | { type: 'search'; value: string }
  | { type: 'page'; offset: number };

function searchReducer(state: SearchState, action: Action): SearchState {
  switch (action.type) {
    case 'input':
      return { input: action.value, search: '', offset: 0 };
    case 'search': {
      const search = action.value.trim();
      return search && search === state.input.trim() ? { ...state, search, offset: 0 } : state;
    }
    case 'page':
      return state.search && Number.isSafeInteger(action.offset) && action.offset >= 0
        ? { ...state, offset: action.offset }
        : state;
  }
}

type PagedTypeahead<TOption> = {
  results: TOption[];
  isLoading: boolean;
  error: boolean;
  onInputChange: (value: string) => void;
  onSearch: (value: string) => void;
  pagination: {
    offset: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (offset: number) => void;
  };
};

export function usePagedTypeahead<TData, TVariables extends OperationVariables, TOption>(
  query: DocumentNode,
  variablesFor: (search: string, offset: number) => TVariables,
  pageFrom: (data: TData) => { result: TOption[]; totalCount: number }
): PagedTypeahead<TOption> {
  const [state, dispatch] = useReducer(searchReducer, initialState);
  const active = Boolean(state.search) && state.search === state.input.trim();
  const { data, loading, error } = useQuery<TData, TVariables>(query, {
    variables: variablesFor(state.search, state.offset),
    skip: !active,
    notifyOnNetworkStatusChange: true,
    // Keep only the current page here; the widget's separate async cache is disabled as well.
    fetchPolicy: 'no-cache',
  });
  const page = active && !loading && !error && data ? pageFrom(data) : undefined;
  const onInputChange = useCallback((value: string) => dispatch({ type: 'input', value }), []);
  const onSearch = useCallback((value: string) => dispatch({ type: 'search', value }), []);
  return {
    results: page?.result || [],
    isLoading: active && loading,
    error: active && Boolean(error),
    onInputChange,
    onSearch,
    pagination: {
      offset: state.offset,
      pageSize: SEARCH_PAGE_SIZE,
      totalCount: page?.totalCount || 0,
      onPageChange: (offset: number) => dispatch({ type: 'page', offset }),
    },
  };
}
