import { Action, ActionReducerMap, combineReducers } from '@ngrx/store';
import { createFormGroupReducerWithUpdate, createFormGroupState, FormGroupState, validate } from 'ngrx-forms';
import { greaterThan, required } from 'ngrx-forms/validation';

import { State as RootState } from '../app.reducer';

export interface FormValue {
  searchTerm: string;
  numberOfResultsToShow: number;
}

export interface State extends RootState {
  asyncValidation: {
    formState: FormGroupState<FormValue>;
    searchResults: string[];
  };
}

export class SetSearchResultAction implements Action {
  static TYPE = 'asyncValidation/SET_SEARCH_RESULT';
  type = SetSearchResultAction.TYPE;
  constructor(public results: string[]) { }
}

export const FORM_ID = 'asyncValidation';

export const INITIAL_STATE = createFormGroupState<FormValue>(FORM_ID, {
  searchTerm: '',
  numberOfResultsToShow: 5,
});

const formGroupReducerWithUpdate = createFormGroupReducerWithUpdate<FormValue>({
  searchTerm: validate(required),
  numberOfResultsToShow: validate(required, greaterThan(0)),
});

export const reducers: ActionReducerMap<State['asyncValidation']> = {
  formState(s = INITIAL_STATE, a: Action) {
    return formGroupReducerWithUpdate(s, a);
  },
  searchResults(s: string[] = [], a: Action) {
    if (a.type === SetSearchResultAction.TYPE) {
      return (a as SetSearchResultAction).results;
    }

    return s;
  },
};
