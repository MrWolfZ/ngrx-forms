import { Action, ActionReducerMap } from '@ngrx/store';
import {
  createFormGroupState,
  createFormStateReducerWithUpdate,
  disable,
  enable,
  FormGroupState,
  updateGroup,
  validate,
} from 'ngrx-forms';
import { equalTo, minLength, required, requiredTrue } from 'ngrx-forms/validation';

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
  hobbies: string;
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
  hobbies: '[]',
  dateOfBirth: new Date(Date.UTC(1970, 0, 1)).toISOString(),
  agreeToTermsOfUse: false,
});

const validationFormGroupReducer = createFormStateReducerWithUpdate<FormValue>(updateGroup<FormValue>({
  userName: validate(required),
  password: (state, parentState) => {
    if (!parentState.value.createAccount) {
      return disable(state);
    }

    state = enable(state);
    return updateGroup<PasswordValue>(state, {
      password: validate(required, minLength(8)),
      confirmPassword: validate(equalTo(state.value.password)),
    });
  },
  agreeToTermsOfUse: validate(requiredTrue),
}));

export const reducers: ActionReducerMap<State['material']> = {
  formState(s = INITIAL_STATE, a: Action) {
    return validationFormGroupReducer(s, a);
  },
};
