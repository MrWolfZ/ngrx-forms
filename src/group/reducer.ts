import { Action } from '@ngrx/store';

import { Actions, AddArrayControlAction, FocusAction, RemoveArrayControlAction, UnfocusAction } from '../actions';
import { FormGroupState, isGroupState, KeyValue } from '../state';
import { addControlReducer } from './reducer/add-control';
import { clearAsyncErrorReducer } from './reducer/clear-async-error';
import { disableReducer } from './reducer/disable';
import { enableReducer } from './reducer/enable';
import { markAsDirtyReducer } from './reducer/mark-as-dirty';
import { markAsPristineReducer } from './reducer/mark-as-pristine';
import { markAsSubmittedReducer } from './reducer/mark-as-submitted';
import { markAsTouchedReducer } from './reducer/mark-as-touched';
import { markAsUnsubmittedReducer } from './reducer/mark-as-unsubmitted';
import { markAsUntouchedReducer } from './reducer/mark-as-untouched';
import { removeControlReducer } from './reducer/remove-control';
import { resetReducer } from './reducer/reset';
import { setAsyncErrorReducer } from './reducer/set-async-error';
import { setErrorsReducer } from './reducer/set-errors';
import { setUserDefinedPropertyReducer } from './reducer/set-user-defined-property';
import { setValueReducer } from './reducer/set-value';
import { startAsyncValidationReducer } from './reducer/start-async-validation';
import { childReducer } from './reducer/util';

export function formGroupReducerInternal<TValue extends KeyValue>(state: FormGroupState<TValue>, action: Actions<TValue>) {
  if (!isGroupState(state)) {
    throw new Error('State must be group state');
  }

  switch (action.type) {
    case FocusAction.TYPE:
    case UnfocusAction.TYPE:
    case AddArrayControlAction.TYPE:
    case RemoveArrayControlAction.TYPE:
      return childReducer(state, action);
  }

  state = setValueReducer(state, action);
  state = setErrorsReducer(state, action);
  state = startAsyncValidationReducer(state, action);
  state = setAsyncErrorReducer(state, action);
  state = clearAsyncErrorReducer(state, action);
  state = enableReducer(state, action);
  state = disableReducer(state, action);
  state = markAsDirtyReducer(state, action);
  state = markAsPristineReducer(state, action);
  state = markAsTouchedReducer(state, action);
  state = markAsUntouchedReducer(state, action);
  state = markAsSubmittedReducer(state, action);
  state = markAsUnsubmittedReducer(state, action);
  state = addControlReducer(state, action);
  state = removeControlReducer(state, action);
  state = setUserDefinedPropertyReducer(state, action);
  state = resetReducer(state, action);

  return state;
}

/**
 * This reducer function updates a form group state with actions.
 */
export function formGroupReducer<TValue extends KeyValue>(state: FormGroupState<TValue>, action: Action) {
  return formGroupReducerInternal(state, action as any);
}
