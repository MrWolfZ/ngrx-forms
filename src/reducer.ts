import { Action, ActionReducer } from '@ngrx/store';

import { formArrayReducer } from './array/reducer';
import { formControlReducer } from './control/reducer';
import { formGroupReducer } from './group/reducer';
import { AbstractControlState, FormControlState, FormState, isArrayState, isFormState, isGroupState } from './state';
import { ProjectFn } from './update-function/util';

export function formStateReducer<TValue>(
  state: FormState<TValue> | AbstractControlState<TValue> | undefined,
  action: Action,
): FormState<TValue> {
  if (!state) {
    throw new Error('The form state must be defined!');
  }

  if (!isFormState(state)) {
    throw new Error(`state must be a form state, got ${state}`);
  }

  if (isGroupState(state)) {
    return formGroupReducer(state, action) as any;
  }

  if (isArrayState(state)) {
    return formArrayReducer(state, action) as any;
  }

  return formControlReducer(state as FormControlState<any>, action) as any;
}

/**
 * This function creates a reducer function that first applies an action to the state
 * and afterwards applies all given update functions one after another to the resulting
 * form state. However, the update functions are only applied if the form state changed
 * as result of applying the action. If you need the update functions to be applied
 * regardless of whether the state changed (e.g. because the update function closes
 * over variables that may change independently of the form state) you can simply apply
 * the update manually (e.g. `updateFunction(formStateReducer(state, action))`).
 *
 * The following (contrived) example uses this function to create a reducer that after
 * each action validates the child control `name` to be required and sets the child
 * control `email`'s value to be `''` if the name is invalid.
 *
 * ```typescript
 * interface FormValue {
 *   name: string;
 *   email: string;
 * }
 *
 * const updateFormState = updateGroup<FormValue>(
 *   {
 *     name: validate(required),
 *   },
 *   {
 *     email: (email, parentGroup) =>
 *       parentGroup.controls.name.isInvalid
 *         ? setValue('', email)
 *         : email,
 *   },
 * );
 *
 * const reducer = createFormStateReducerWithUpdate<FormValue>(updateFormState);
 * ```
 */
export function createFormStateReducerWithUpdate<TValue>(
  updateFnOrUpdateFnArr: ProjectFn<FormState<TValue>> | ProjectFn<FormState<TValue>>[],
  ...updateFnArr: ProjectFn<FormState<TValue>>[]
): ActionReducer<FormState<TValue>> {
  updateFnArr = [...(Array.isArray(updateFnOrUpdateFnArr) ? updateFnOrUpdateFnArr : [updateFnOrUpdateFnArr]), ...updateFnArr];
  return (state: FormState<TValue> | undefined, action: Action): FormState<TValue> => {
    const newState = formStateReducer(state as AbstractControlState<TValue>, action);
    return newState === state ? state : updateFnArr.reduce((s, f) => f(s), newState);
  };
}
