import { Action, ActionReducerMap } from '@ngrx/store';
import { createFormGroupState, formGroupReducer, FormGroupState } from 'ngrx-forms';

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
  simpleForm: {
    formState: FormGroupState<FormValue>;
    submittedValue: FormValue | undefined;
  };
}

export class SetSubmittedValueAction implements Action {
  static readonly TYPE = 'simpleForm/SET_SUBMITTED_VALUE';
  readonly type = SetSubmittedValueAction.TYPE;
  constructor(public submittedValue: FormValue) { }
}

export const FORM_ID = 'simpleForm';

export const INITIAL_STATE = createFormGroupState<FormValue>(FORM_ID, {
  firstName: '',
  lastName: '',
  email: '',
  sex: '',
  favoriteColor: '',
  employed: false,
  notes: '',
});

export const reducers: ActionReducerMap<State['simpleForm'], any> = {
  formState(s = INITIAL_STATE, a: Action) {
    return formGroupReducer(s, a);
  },
  submittedValue(s: FormValue | undefined, a: SetSubmittedValueAction) {
    switch (a.type) {
      case SetSubmittedValueAction.TYPE:
        return a.submittedValue;

      default:
        return s;
    }
  },
};
