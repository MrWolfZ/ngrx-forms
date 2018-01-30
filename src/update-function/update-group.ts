import { Action } from '@ngrx/store';

import { formGroupReducer } from '../group/reducer';
import { computeGroupState } from '../group/reducer/util';
import { AbstractControlState, FormGroupControls, FormGroupState, KeyValue, isGroupState } from '../state';
import { ProjectFn2 } from './util';

export type StateUpdateFns<TValue extends KeyValue> =
  {[controlId in keyof TValue]?: ProjectFn2<AbstractControlState<TValue[controlId]>, FormGroupState<TValue>> };

function updateGroupControlsState<TValue extends KeyValue>(updateFns: StateUpdateFns<TValue>) {
  return (state: FormGroupState<TValue>) => {
    let hasChanged = false;
    const newControls = Object.keys(state.controls).reduce((res, key) => {
      const control = state.controls[key];
      res[key] = control;
      if (updateFns.hasOwnProperty(key)) {
        const newControl = updateFns[key]!(control, state);
        hasChanged = hasChanged || newControl !== control;
        res[key] = newControl;
      }
      return res;
    }, {} as FormGroupControls<TValue>);
    return hasChanged ? newControls : state.controls;
  };
}

function updateGroupSingle<TValue extends KeyValue>(updateFns: StateUpdateFns<TValue>) {
  return (state: FormGroupState<TValue>): FormGroupState<TValue> => {
    const newControls = updateGroupControlsState<TValue>(updateFns)(state);
    return newControls !== state.controls
      ? computeGroupState<TValue>(state.id, newControls, state.value, state.errors, state.pendingValidations, state.userDefinedProperties)
      : state;
  };
}

/**
 * This update function takes a variable number of update function objects and
 * returns a projection function that applies all objects one after another to
 * a form group state.
 *
 * The following (contrived) example uses this function to validate the child
 * control `name` to be required and set the child control `email`'s value to
 * be `''` if the name is invalid.
 *
 * ```typescript
 * interface FormValue {
 *   name: string;
 *   email: string;
 * }
 *
 * const groupUpdateFn = updateGroup<FormValue>(
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
 * const updatedState = groupUpdateFn(state);
 * ```
 */
// the weird return type is necessary to allow using updateGroup inside of updateGroup
// and with optional controls
export function updateGroup<TValue>(
  ...updateFnsArr: Array<StateUpdateFns<TValue>>,
): (state: FormGroupState<TValue> | AbstractControlState<TValue | undefined>) => FormGroupState<TValue>;

/**
 * This update function takes a form group state and a variable number of update
 * function objects and applies all objects one after another to the state.
 * Providing multiple update function objects is mainly useful if the result
 * of a later object depends on the result of previous objects.
 *
 * The following (contrived) example uses this function to validate the child
 * control `name` to be required and set the child control `email`'s value to
 * be `''` if the name is invalid.
 *
 * ```typescript
 * interface FormValue {
 *   name: string;
 *   email: string;
 * }
 *
 * const updatedState = updateGroup<FormValue>(
 *   state,
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
 * ```
 */
export function updateGroup<TValue>(
  state: FormGroupState<TValue>,
  ...updateFnsArr: Array<StateUpdateFns<TValue>>,
): FormGroupState<TValue>;

export function updateGroup<TValue extends KeyValue>(
  stateOrFunction: FormGroupState<TValue> | StateUpdateFns<TValue>,
  ...updateFnsArr: Array<StateUpdateFns<TValue>>,
) {
  if (isGroupState(stateOrFunction as any)) {
    const [first, ...rest] = updateFnsArr;
    return updateGroup(first, ...rest)(stateOrFunction as any);
  }

  return (state: FormGroupState<TValue>): FormGroupState<TValue> => {
    return [stateOrFunction as any, ...updateFnsArr].reduce((s, updateFn) => updateGroupSingle<TValue>(updateFn)(s), state);
  };
}

/**
 * This function creates a reducer function that first applies an action to the state
 * and afterwards applies all given update function objects one after another to the
 * resulting form group state.
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
 * const reducer = createFormGroupReducerWithUpdate<FormValue>(
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
 * ```
 */
export function createFormGroupReducerWithUpdate<TValue extends KeyValue>(...updateFnsArr: Array<StateUpdateFns<TValue>>) {
  return (state: FormGroupState<TValue>, action: Action) => {
    state = formGroupReducer(state, action);
    return updateGroup<TValue>(...updateFnsArr)(state);
  };
}
