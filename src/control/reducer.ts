import { Action } from '@ngrx/store';
import { FormControlState, FormControlValueTypes } from '../state';
import { Actions } from '../actions';
import { setValueReducer } from './reducer/set-value';
import { setErrorsReducer } from './reducer/set-errors';
import { enableReducer } from './reducer/enable';
import { disableReducer } from './reducer/disable';
import { focusReducer } from './reducer/focus';
import { unfocusReducer } from './reducer/unfocus';
import { markAsDirtyReducer } from './reducer/mark-as-dirty';
import { markAsPristineReducer } from './reducer/mark-as-pristine';
import { markAsTouchedReducer } from './reducer/mark-as-touched';
import { markAsUntouchedReducer } from './reducer/mark-as-untouched';
import { markAsSubmittedReducer } from './reducer/mark-as-submitted';
import { markAsUnsubmittedReducer } from './reducer/mark-as-unsubmitted';
import { setLastKeydownCodeReducer } from './reducer/set-last-keydown-code';

export function formControlReducerInternal<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: Actions<TValue>,
): FormControlState<TValue> {
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
  state = setLastKeydownCodeReducer(state, action);

  return state;
}

export function formControlReducer<TValue extends FormControlValueTypes>(state: FormControlState<TValue>, action: Action) {
  return formControlReducerInternal(state, action as any);
}
