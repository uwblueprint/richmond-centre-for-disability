export type TypeaheadSearchState = { input: string; search: string; offset: number };
export const initialTypeaheadState: TypeaheadSearchState = { input: '', search: '', offset: 0 };
type Action =
  | { type: 'input'; value: string }
  | { type: 'search'; value: string }
  | { type: 'page'; offset: number };

export function typeaheadSearchReducer(
  state: TypeaheadSearchState,
  action: Action
): TypeaheadSearchState {
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
