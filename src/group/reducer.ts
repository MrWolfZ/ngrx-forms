import { Action } from '@ngrx/store';

import { FormGroupState, KeyValue } from '../state';
import { Actions, FocusAction, UnfocusAction, SetLastKeyDownCodeAction } from '../actions';
import { childReducer } from './reducer/util';
import { setValueReducer } from './reducer/set-value';
import { setErrorsReducer } from './reducer/set-errors';
import { enableReducer } from './reducer/enable';
import { disableReducer } from './reducer/disable';
import { markAsDirtyReducer } from './reducer/mark-as-dirty';
import { markAsPristineReducer } from './reducer/mark-as-pristine';
import { markAsTouchedReducer } from './reducer/mark-as-touched';
import { markAsUntouchedReducer } from './reducer/mark-as-untouched';
import { markAsSubmittedReducer } from './reducer/mark-as-submitted';
import { markAsUnsubmittedReducer } from './reducer/mark-as-unsubmitted';

export function formGroupReducerInternal<TValue extends KeyValue>(state: FormGroupState<TValue>, action: Actions<TValue>) {
  switch (action.type) {
    case FocusAction.TYPE:
    case UnfocusAction.TYPE:
    case SetLastKeyDownCodeAction.TYPE:
      return childReducer(state, action);
  }

  state = setValueReducer(state, action);
  state = setErrorsReducer(state, action);
  state = enableReducer(state, action);
  state = disableReducer(state, action);
  state = markAsDirtyReducer(state, action);
  state = markAsPristineReducer(state, action);
  state = markAsTouchedReducer(state, action);
  state = markAsUntouchedReducer(state, action);
  state = markAsSubmittedReducer(state, action);
  state = markAsUnsubmittedReducer(state, action);

  return state;
}

export function formGroupReducer<TValue extends KeyValue>(state: FormGroupState<TValue>, action: Action) {
  return formGroupReducerInternal(state, action as any);
}
