import { Action, combineReducers } from '@ngrx/store';
import {
  cast,
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
  static TYPE = 'recursiveUpdate/BLOCK_UI';
  type = BlockUIAction.TYPE;
}

export class UnblockUIAction implements Action {
  static TYPE = 'dynamic/UNBLOCK_UI';
  type = UnblockUIAction.TYPE;
}

export const FORM_ID = 'recursiveUpdate';

export const INITIAL_STATE = updateGroup<FormValue>({
  employed: disable,
  notes: disable,
  sex: disable,
})(createFormGroupState<FormValue>(FORM_ID, {
  firstName: '',
  lastName: '',
  email: '',
  sex: '',
  favoriteColor: '',
  employed: false,
  notes: '',
}));

export function reducer(_s: any, _a: any) {
  return combineReducers<any, any>({
    formState(state = INITIAL_STATE, a: BlockUIAction | UnblockUIAction) {
      state = formGroupReducer(state, a);

      switch (a.type) {
        case BlockUIAction.TYPE: {
          state = cast(updateRecursive<FormValue>(s => setUserDefinedProperty('wasDisabled', s.isDisabled)(s))(state));
          return disable(state);
        }

        case UnblockUIAction.TYPE: {
          state = cast(enable(state));
          return updateRecursive<FormValue>(s => s.userDefinedProperties.wasDisabled ? disable(s) : s)(state);
        }

        default: {
          return state;
        }
      }
    },
  })(_s, _a);
};
