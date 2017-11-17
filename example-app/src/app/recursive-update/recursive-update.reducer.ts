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
  static TYPE = 'recursiveUpdate/BLOCK_UI';
  type = BlockUIAction.TYPE;
}

export class UnblockUIAction implements Action {
  static TYPE = 'dynamic/UNBLOCK_UI';
  type = UnblockUIAction.TYPE;
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
  });

export function reducer(_s: any, _a: any) {
  return combineReducers<any, any>({
    formState(
      state: FormGroupState<FormValue> = INITIAL_STATE,
      a: BlockUIAction | UnblockUIAction,
    ) {
      state = formGroupReducer(state, a);

      switch (a.type) {
        case BlockUIAction.TYPE: {
          state = updateRecursive<FormValue>(
            state,
            s => setUserDefinedProperty('wasDisabled', s.isDisabled, s),
          );
          return disable(state);
        }

        case UnblockUIAction.TYPE: {
          state = enable(state);
          return updateRecursive<FormValue>(
            state,
            s => s.userDefinedProperties.wasDisabled ? disable(s) : s,
          );
        }

        default: {
          return state;
        }
      }
    },
  })(_s, _a);
};
