import { Action, ActionReducerMap } from '@ngrx/store';
import {
  createFormGroupState,
  disable,
  enable,
  formGroupReducer,
  FormGroupState,
  updateGroup,
  validate,
} from 'ngrx-forms';
import { minLength, required, requiredTrue } from 'ngrx-forms/validation';

import { ValidationErrors } from '@angular/forms';
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

// @ts-ignore
declare module 'ngrx-forms/src/state' {
  interface ValidationErrors {
    passwordMatch?: PasswordValue;
  }
}

function validatePasswordsMatch(value: PasswordValue): ValidationErrors {
  if (value.password === value.confirmPassword) {
    return {};
  }

  return {
    passwordMatch: value,
  };
}

export const validateAndUpdateForm = updateGroup<FormValue>({
  userName: validate(required),
  password: (state, parentState) => {
    if (!parentState.value.createAccount) {
      return disable(state);
    }

    state = enable(state);
    state = validate(state, validatePasswordsMatch);
    return updateGroup<PasswordValue>(state, {
      password: validate(required, minLength(8)),
    });
  },
  agreeToTermsOfUse: validate(requiredTrue),
});

export const reducers: ActionReducerMap<State['syncValidation']> = {
  formState(s = INITIAL_STATE, a: Action) {
    return validateAndUpdateForm(formGroupReducer(s, a));
  },
};
