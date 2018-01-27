import { computeArrayState } from '../array/reducer/util';
import { AbstractControlState, FormArrayState } from '../state';
import { ProjectFn2 } from './util';

function updateArrayControlsState<TValue>(updateFn: ProjectFn2<AbstractControlState<TValue>, FormArrayState<TValue>>) {
  return (state: FormArrayState<TValue>) => {
    let hasChanged = false;
    const newControls = state.controls.map(control => {
      const newControl = updateFn(control, state);
      hasChanged = hasChanged || newControl !== control;
      return newControl;
    });
    return hasChanged ? newControls : state.controls;
  };
}

function updateArraySingle<TValue>(updateFn: ProjectFn2<AbstractControlState<TValue>, FormArrayState<TValue>>) {
  return (state: FormArrayState<TValue>): FormArrayState<TValue> => {
    const newControls = updateArrayControlsState<TValue>(updateFn)(state);
    return newControls !== state.controls
      ? computeArrayState<TValue>(state.id, newControls, state.value, state.errors, state.pendingValidations, state.userDefinedProperties)
      : state;
  };
}

/**
 * This update function takes a variable number of update functions and returns
 * a projection function that applies all update functions one after another to
 * a form array state.
 *
 * The following (contrived) example uses this function to validate all its
 * children to be required and mark them as dirty.
 *
 * ```typescript
 * const arrayUpdateFn = updateArray<string>(
 *   validate(required),
 *   markAsDirty,
 * );
 * const updatedState = arrayUpdateFn(state);
 * ```
 */
export function updateArray<TValue>(
  ...updateFnArr: Array<ProjectFn2<AbstractControlState<TValue>, FormArrayState<TValue>>>,
): (state: FormArrayState<TValue> | AbstractControlState<TValue[] | undefined>) => FormArrayState<TValue>;

/**
 * This update function takes a form array state and a variable number of update
 * functions applies all update functions one after another to the state.
 *
 * The following (contrived) example uses this function to validate all its
 * children to be required and mark them as dirty.
 *
 * ```typescript
 * const updatedState = updateArray<string>(
 *   state,
 *   validate(required),
 *   markAsDirty,
 * );
 * ```
 */
export function updateArray<TValue>(
  state: FormArrayState<TValue>,
  ...updateFnArr: Array<ProjectFn2<AbstractControlState<TValue>, FormArrayState<TValue>>>,
): FormArrayState<TValue>;

export function updateArray<TValue>(
  stateOrFunction: FormArrayState<TValue> | ProjectFn2<AbstractControlState<TValue>, FormArrayState<TValue>>,
  ...updateFnArr: Array<ProjectFn2<AbstractControlState<TValue>, FormArrayState<TValue>>>,
) {
  if (typeof stateOrFunction !== 'function') {
    const [first, ...rest] = updateFnArr;
    return updateArray(first, ...rest)(stateOrFunction);
  }

  return (state: FormArrayState<TValue>): FormArrayState<TValue> => {
    return [stateOrFunction as any, ...updateFnArr].reduce((s, updateFn) => updateArraySingle<TValue>(updateFn)(s), state);
  };
}
