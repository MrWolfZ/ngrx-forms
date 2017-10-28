import { Action } from '@ngrx/store';

import { Actions, FocusAction, UnfocusAction } from '../actions';
import { FormArrayState } from '../state';
import { disableReducer } from './reducer/disable';
import { enableReducer } from './reducer/enable';
import { markAsDirtyReducer } from './reducer/mark-as-dirty';
import { markAsPristineReducer } from './reducer/mark-as-pristine';
import { childReducer } from './reducer/util';

export function formArrayReducerInternal<TValue>(state: FormArrayState<TValue>, action: Actions<TValue[]>) {
  switch (action.type) {
    case FocusAction.TYPE:
    case UnfocusAction.TYPE:
      return childReducer(state, action);
  }

  state = enableReducer(state, action);
  state = disableReducer(state, action);
  state = markAsDirtyReducer(state, action);
  state = markAsPristineReducer(state, action);

  return state;
}

export function formArrayReducer<TValue>(state: FormArrayState<TValue>, action: Action) {
  return formArrayReducerInternal(state, action as any);
}
