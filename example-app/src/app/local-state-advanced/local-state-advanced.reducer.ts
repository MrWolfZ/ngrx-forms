import { Action, combineReducers } from '@ngrx/store';
import { createFormGroupState, formGroupReducer, FormGroupState, setValue, updateGroup } from 'ngrx-forms';

export class GetManufacturersAction implements Action {
  static readonly TYPE = 'localStateAdvanced/GET_MANUFACTURERS';
  readonly type = GetManufacturersAction.TYPE;
  constructor(public countryCode: string) { }
}

export class SetManufacturersAction implements Action {
  static readonly TYPE = 'localStateAdvanced/SET_MANUFACTURERS';
  readonly type = SetManufacturersAction.TYPE;
  constructor(public manufacturers: string[]) { }
}

export interface FormValue {
  countryCode: string;
  manufacturer: string;
}

export interface LocalState {
  manufacturers: string[];
  formState: FormGroupState<FormValue>;
}

export const FORM_ID = 'localStateForm';

export const INITIAL_FORM_STATE = createFormGroupState<FormValue>(FORM_ID, {
  countryCode: '',
  manufacturer: '',
});

export const INITIAL_LOCAL_STATE: LocalState = {
  manufacturers: [],
  formState: INITIAL_FORM_STATE,
};

const reducers = combineReducers<LocalState>({
  manufacturers(manufacturers = [], a: Action) {
    // update from loaded data
    if (a.type === SetManufacturersAction.TYPE) {
      return (a as SetManufacturersAction).manufacturers;
    }
    return manufacturers;
  },
  formState(fs = INITIAL_FORM_STATE, a: Action) {
    return formGroupReducer(fs, a);
  },
});

export function reducer(oldState: LocalState = INITIAL_LOCAL_STATE, action: Action) {
  // each reducer takes care of its individual state
  let state = reducers(oldState, action);

  if (state === oldState) {
    return state;
  }

  // one overarching reducer handles inter-dependencies
  const formState = updateGroup<FormValue>({
    manufacturer: manufacturer => {
      if (!state.manufacturers.includes(manufacturer.value)) {
        return setValue('')(manufacturer);
      }
      return manufacturer;
    },
  })(state.formState);

  if (formState !== state.formState) {
    state = { ...state, formState };
  }

  return state;
}
