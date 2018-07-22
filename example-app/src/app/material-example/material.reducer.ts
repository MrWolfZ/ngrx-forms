import { Action, combineReducers } from '@ngrx/store';
import {
  box,
  Boxed,
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
  hobbies: Boxed<string[]>;
  dateOfBirth: string;
  agreeToTermsOfUse: boolean;
}

export interface State extends RootState {
  material: {
    formState: FormGroupState<FormValue>;
    submittedValue: FormValue | undefined;
  };
}

export class SetSubmittedValueAction implements Action {
  static readonly TYPE = 'material/SET_SUBMITTED_VALUE';
  readonly type = SetSubmittedValueAction.TYPE;
  constructor(public submittedValue: FormValue) { }
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
  hobbies: box([]),
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

const reducers = combineReducers<State['material'], any>({
  formState(s = INITIAL_STATE, a: Action) {
    return validationFormGroupReducer(s, a);
  },
  submittedValue(s: FormValue | undefined, a: SetSubmittedValueAction) {
    switch (a.type) {
      case SetSubmittedValueAction.TYPE:
        return a.submittedValue;

      default:
        return s;
    }
  },
});

export function reducer(s: State['material'], a: Action) {
  return reducers(s, a);
}
