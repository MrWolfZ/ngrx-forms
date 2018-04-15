import { Action, combineReducers } from '@ngrx/store';
import {
  createFormGroupReducerWithUpdate,
  createFormGroupState,
  disable,
  enable,
  FormGroupState,
  updateGroup,
  validate,
} from 'ngrx-forms';
import { minLength, required, requiredTrue } from 'ngrx-forms/validation';

import { State as RootState } from '../app.reducer';

export interface PasswordValue {
  password: string;
  confirmPassword: string;
}

export interface FormValue {
  userName: string;
  createAccount: boolean;
  password: PasswordValue;
  dayOfBirth: number;
  monthOfBirth: string;
  yearOfBirth: number;
  agreeToTermsOfUse: boolean;
}

export interface State extends RootState {
  syncValidation: {
    formState: FormGroupState<FormValue>;
  };
}

export const FORM_ID = 'syncValidation';

export const INITIAL_STATE = createFormGroupState<FormValue>(FORM_ID, {
  userName: '',
  createAccount: true,
  password: {
    password: '',
    confirmPassword: '',
  },
  dayOfBirth: 1,
  monthOfBirth: 'January',
  yearOfBirth: 1970,
  agreeToTermsOfUse: false,
});

function validatePasswordsMatch(value: PasswordValue) {
  if (value.password === value.confirmPassword) {
    return {};
  }

  return {
    match: value,
  };
}

const validationFormGroupReducer = createFormGroupReducerWithUpdate<FormValue>({
  userName: validate(required),
  password: (state, parentState) => {
    if (!parentState.value.createAccount) {
      return disable(state);
    }

    state = enable(state);
    state = validate(state, validatePasswordsMatch);
    return updateGroup<PasswordValue>(state, {
      password: validate([required, minLength(8)]),
    });
  },
  agreeToTermsOfUse: validate<boolean>(requiredTrue),
});


export function reducer(_s: any, _a: any) {
  return combineReducers({
    formState(s = INITIAL_STATE, a: Action) {
      return validationFormGroupReducer(s, a);
    },
  })(_s, _a);
};
