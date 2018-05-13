import { Action } from '@ngrx/store';

import { Actions, AddGroupControlAction, FocusAction, isNgrxFormsAction, RemoveGroupControlAction, UnfocusAction } from '../actions';
import { FormArrayState, isArrayState } from '../state';
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
import { moveControlReducer } from './reducer/move-control';
import { removeControlReducer } from './reducer/remove-control';
import { resetReducer } from './reducer/reset';
import { setAsyncErrorReducer } from './reducer/set-async-error';
import { setErrorsReducer } from './reducer/set-errors';
import { setUserDefinedPropertyReducer } from './reducer/set-user-defined-property';
import { setValueReducer } from './reducer/set-value';
import { startAsyncValidationReducer } from './reducer/start-async-validation';
import { swapControlReducer } from './reducer/swap-control';
import { childReducer } from './reducer/util';

export function formArrayReducerInternal<TValue>(state: FormArrayState<TValue>, action: Actions<TValue[]>) {
  if (!isArrayState(state)) {
    throw new Error('The state must be an array state');
  }

  if (!isNgrxFormsAction(action)) {
    return state;
  }

  if (!action.controlId.startsWith(state.id)) {
    return state;
  }

  switch (action.type) {
    case FocusAction.TYPE:
    case UnfocusAction.TYPE:
    case AddGroupControlAction.TYPE:
    case RemoveGroupControlAction.TYPE:
      return childReducer(state, action);

    default:
      break;
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
  state = setUserDefinedPropertyReducer(state, action);
  state = resetReducer(state, action);
  state = addControlReducer(state, action);
  state = removeControlReducer(state, action);
  state = swapControlReducer(state, action);
  state = moveControlReducer(state, action);

  return state;
}

/**
 * This reducer function updates a form array state with actions.
 */
export function formArrayReducer<TValue>(state: FormArrayState<TValue> | undefined, action: Action) {
  if (!state) {
    throw new Error('The array state must be defined!');
  }

  return formArrayReducerInternal(state, action as any);
}
