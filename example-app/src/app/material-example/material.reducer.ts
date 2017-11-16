import { Action } from '@ngrx/store';
import {
  cast,
  createFormGroupReducerWithUpdate,
  createFormGroupState,
  disable,
  enable,
  FormGroupState,
  updateGroup,
  validate,
  setErrors,
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
  sex: string;
  favoriteColor: string;
  dateOfBirth: string;
  agreeToTermsOfUse: boolean;
}

export interface State extends RootState {
  material: {
    formState: FormGroupState<FormValue>;
  };
}

export const FORM_ID = 'material';

export const INITIAL_STATE = createFormGroupState<FormValue>(FORM_ID, {
  userName: '',
  createAccount: true,
  password: {
    password: '',
    confirmPassword: '',
  },
  sex: '',
  favoriteColor: '',
  dateOfBirth: new Date(Date.UTC(1970, 0, 1)).toISOString(),
  agreeToTermsOfUse: false,
});

function validatePasswordsMatch(password: string, confirmPassword: string) {
  if (password === confirmPassword) {
    return {};
  }

  return {
    match: {
      password,
      confirmPassword,
    },
  };
}

const validationFormGroupReducer = createFormGroupReducerWithUpdate<FormValue>({
  userName: validate(required),
  password: (state, parentState) => {
    if (!parentState.value.createAccount) {
      return disable(state);
    }

    state = enable(state);
    return updateGroup<PasswordValue>({
      password: validate([required, minLength(8)]),
      confirmPassword: validate(value => validatePasswordsMatch(state.value.password, value)),
    })(cast(state));
  },
  agreeToTermsOfUse: validate<boolean>(requiredTrue),
});

export const reducers = {
  formState(s = INITIAL_STATE, a: Action) {
    return validationFormGroupReducer(s, a);
  },
};
