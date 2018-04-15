import { computeArrayState, FormArrayState, InferredControlState, isArrayState } from '../state';
import { ensureState, ProjectFn2 } from './util';

function updateArrayControlsState<TValue>(updateFn: ProjectFn2<InferredControlState<TValue>, FormArrayState<TValue>>) {
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

function updateArraySingle<TValue>(updateFn: ProjectFn2<InferredControlState<TValue>, FormArrayState<TValue>>) {
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
  updateFn: ProjectFn2<InferredControlState<TValue>, FormArrayState<TValue>>,
  ...updateFnArr: ProjectFn2<InferredControlState<TValue>, FormArrayState<TValue>>[]
): (state: FormArrayState<TValue>) => FormArrayState<TValue>;

/**
 * This update function takes an array of update functions and returns
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
  updateFnArr: ProjectFn2<InferredControlState<TValue>, FormArrayState<TValue>>[],
): (state: FormArrayState<TValue>) => FormArrayState<TValue>;

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
  updateFn: ProjectFn2<InferredControlState<TValue>, FormArrayState<TValue>>,
  ...updateFnArr: ProjectFn2<InferredControlState<TValue>, FormArrayState<TValue>>[]
): FormArrayState<TValue>;

/**
 * This update function takes a form array state and an array of update
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
  updateFnArr: ProjectFn2<InferredControlState<TValue>, FormArrayState<TValue>>[],
): FormArrayState<TValue>;

export function updateArray<TValue>(
  stateOrFunctionOrFunctionArray:
    | FormArrayState<TValue>
    | ProjectFn2<InferredControlState<TValue>, FormArrayState<TValue>>
    | ProjectFn2<InferredControlState<TValue>, FormArrayState<TValue>>[],
  updateFnOrUpdateFnArr?: ProjectFn2<InferredControlState<TValue>, FormArrayState<TValue>> | ProjectFn2<InferredControlState<TValue>, FormArrayState<TValue>>[],
  ...rest: ProjectFn2<InferredControlState<TValue>, FormArrayState<TValue>>[]
) {
  if (isArrayState<TValue>(stateOrFunctionOrFunctionArray)) {
    const updateFnArr = Array.isArray(updateFnOrUpdateFnArr) ? updateFnOrUpdateFnArr : [updateFnOrUpdateFnArr!];
    return updateFnArr.concat(...rest).reduce((s, updateFn) => updateArraySingle<TValue>(updateFn)(s), stateOrFunctionOrFunctionArray);
  }

  let updateFnArr = Array.isArray(stateOrFunctionOrFunctionArray) ? stateOrFunctionOrFunctionArray : [stateOrFunctionOrFunctionArray];
  updateFnArr = updateFnOrUpdateFnArr === undefined ? updateFnArr : updateFnArr.concat(updateFnOrUpdateFnArr);
  return (s: FormArrayState<TValue>) => updateArray<TValue>(ensureState(s), updateFnArr.concat(rest));
}
