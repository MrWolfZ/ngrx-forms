import { Action } from '@ngrx/store';

import { Actions } from '../actions';
import { FormControlState, FormControlValueTypes, isArrayState, isGroupState } from '../state';
import { disableReducer } from './reducer/disable';
import { enableReducer } from './reducer/enable';
import { focusReducer } from './reducer/focus';
import { markAsDirtyReducer } from './reducer/mark-as-dirty';
import { markAsPristineReducer } from './reducer/mark-as-pristine';
import { markAsSubmittedReducer } from './reducer/mark-as-submitted';
import { markAsTouchedReducer } from './reducer/mark-as-touched';
import { markAsUnsubmittedReducer } from './reducer/mark-as-unsubmitted';
import { markAsUntouchedReducer } from './reducer/mark-as-untouched';
import { resetReducer } from './reducer/reset';
import { setErrorsReducer } from './reducer/set-errors';
import { setUserDefinedPropertyReducer } from './reducer/set-user-defined-property';
import { setValueReducer } from './reducer/set-value';
import { unfocusReducer } from './reducer/unfocus';

export function formControlReducerInternal<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: Actions<TValue>,
): FormControlState<TValue> {
  if (isGroupState(state) || isArrayState(state)) {
    throw new Error('State must be control state');
  }

  if (action.controlId !== state.id) {
    return state;
  }

  state = setValueReducer(state, action);
  state = setErrorsReducer(state, action);
  state = enableReducer(state, action);
  state = disableReducer(state, action);
  state = focusReducer(state, action);
  state = unfocusReducer(state, action);
  state = markAsDirtyReducer(state, action);
  state = markAsPristineReducer(state, action);
  state = markAsTouchedReducer(state, action);
  state = markAsUntouchedReducer(state, action);
  state = markAsSubmittedReducer(state, action);
  state = markAsUnsubmittedReducer(state, action);
  state = setUserDefinedPropertyReducer(state, action);
  state = resetReducer(state, action);

  return state;
}

export function formControlReducer<TValue extends FormControlValueTypes>(state: FormControlState<TValue>, action: Action) {
  return formControlReducerInternal(state, action as any);
}
