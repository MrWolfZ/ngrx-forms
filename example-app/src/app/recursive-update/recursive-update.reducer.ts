import { Action, combineReducers } from '@ngrx/store';
import {
  createFormGroupState,
  disable,
  enable,
  formGroupReducer,
  FormGroupState,
  setUserDefinedProperty,
  updateGroup,
  updateRecursive,
} from 'ngrx-forms';

import { State as RootState } from '../app.reducer';

export interface FormValue {
  firstName: string;
  lastName: string;
  email: string;
  sex: string;
  favoriteColor: string;
  employed: boolean;
  notes: string;
}

export interface State extends RootState {
  recursiveUpdate: {
    formState: FormGroupState<FormValue>;
  };
}

export class BlockUIAction implements Action {
  static readonly TYPE = 'recursiveUpdate/BLOCK_UI';
  readonly type = BlockUIAction.TYPE;
}

export class UnblockUIAction implements Action {
  static readonly TYPE = 'dynamic/UNBLOCK_UI';
  readonly type = UnblockUIAction.TYPE;
}

export const FORM_ID = 'recursiveUpdate';

export const INITIAL_STATE = updateGroup<FormValue>(
  createFormGroupState<FormValue>(FORM_ID, {
    firstName: '',
    lastName: '',
    email: '',
    sex: '',
    favoriteColor: '',
    employed: false,
    notes: '',
  }),
  {
    employed: disable,
    notes: disable,
    sex: disable,
  },
);

export function formStateReducer(state = INITIAL_STATE, a: BlockUIAction | UnblockUIAction) {
  state = formGroupReducer(state, a);

  switch (a.type) {
    case BlockUIAction.TYPE: {
      state = updateRecursive(
        state,
        s => setUserDefinedProperty(s, 'wasDisabled', s.isDisabled),
      );
      return disable(state);
    }

    case UnblockUIAction.TYPE: {
      state = enable(state);
      return updateRecursive(
        state,
        s => s.userDefinedProperties.wasDisabled ? disable(s) : s,
      );
    }

    default: {
      return state;
    }
  }
}

const reducers = combineReducers<State['recursiveUpdate'], any>({
  formState: formStateReducer,
});

export function reducer(s: State['recursiveUpdate'], a: Action) {
  return reducers(s, a);
}
