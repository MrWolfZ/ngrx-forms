import {
  AbstractControlState,
  FormArrayState,
  FormControlState,
  FormControlValueTypes,
  FormGroupState,
  isArrayState,
  isGroupState,
  InferredControlState,
} from '../state';
import { updateArray } from './update-array';
import { updateGroup } from './update-group';
import { ProjectFn2 } from './util';

function updateRecursiveSingle(parent: AbstractControlState<any>, updateFn: ProjectFn2<AbstractControlState<any>, AbstractControlState<any>>) {
  return (state: AbstractControlState<any>): AbstractControlState<any> => {
    if (isGroupState(state)) {
      const updateFunctions = Object.keys(state.controls).reduce((agg, key) => Object.assign(agg, {
        [key]: (s: AbstractControlState<any>, p: AbstractControlState<any>) => updateRecursiveSingle(p, updateFn)(s),
      }), {});
      state = updateGroup<any>(updateFunctions)(state);
      return updateFn(state, parent);
    }

    if (isArrayState(state)) {
      state = updateArray<any>((s, p) => updateRecursiveSingle(p, updateFn)(s))(state);
      return updateFn(state, parent);
    }

    return updateFn(state, parent);
  };
}

/**
 * This update function takes a variable number of update functions and returns
 * a projection function that applies all update functions one after another to
 * a form state.
 *
 * The following example uses this function to validate all controls in a
 * group as required.
 *
 * ```typescript
 * const updateFn = updateRecursive(validate(required));
 * const updatedState = updateFn(state);
 * ```
 */
export function updateRecursive<TValue>(
  ...updateFnArr: Array<ProjectFn2<AbstractControlState<any>, AbstractControlState<any>>>,
): (state: InferredControlState<TValue>) => InferredControlState<TValue>;

/**
 * This update function takes a form control state and a variable number of
 * update functions applies all update functions one after another to the
 * state.
 */
export function updateRecursive<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  ...updateFnArr: Array<ProjectFn2<AbstractControlState<any>, AbstractControlState<any>>>,
): FormControlState<TValue>;

/**
 * This update function takes a form array state and a variable number of
 * update functions applies all update functions one after another to the
 * state recursively, i.e. the function is applied to the state's children,
 * their children etc.
 *
 * The following example uses this function to validate all controls in an
 * array as required.
 *
 * ```typescript
 * const updatedState = updateRecursive(
 *   state,
 *   validate(required),
 * );
 * ```
 */
export function updateRecursive<TValue>(
  state: FormArrayState<TValue>,
  ...updateFnArr: Array<ProjectFn2<AbstractControlState<any>, AbstractControlState<any>>>,
): FormArrayState<TValue>;

/**
 * This update function takes a form group state and a variable number of
 * update functions applies all update functions one after another to the
 * state recursively, i.e. the function is applied to the state's children,
 * their children etc.
 *
 * The following example uses this function to validate all controls in a
 * group as required.
 *
 * ```typescript
 * const updatedState = updateRecursive(
 *   state,
 *   validate(required),
 * );
 * ```
 */
export function updateRecursive<TValue>(
  state: FormGroupState<TValue>,
  ...updateFnArr: Array<ProjectFn2<AbstractControlState<any>, AbstractControlState<any>>>,
): FormGroupState<TValue>;

/**
 * This update function takes a form state and a variable number of update
 * functions applies all update functions one after another to the state
 * recursively, i.e. the function is applied to the state's children, their
 * children etc.
 *
 * The following example uses this function to validate all controls in a
 * group as required.
 *
 * ```typescript
 * const updatedState = updateRecursive(
 *   state,
 *   validate(required),
 * );
 * ```
 */
export function updateRecursive<TValue>(
  state: InferredControlState<TValue>,
  ...updateFnArr: Array<ProjectFn2<AbstractControlState<any>, AbstractControlState<any>>>,
): InferredControlState<TValue>;

export function updateRecursive<TValue>(
  stateOrFunction: InferredControlState<TValue> | ProjectFn2<AbstractControlState<any>, AbstractControlState<any>>,
  ...updateFnArr: Array<ProjectFn2<AbstractControlState<any>, AbstractControlState<any>>>,
) {
  if (typeof stateOrFunction !== 'function') {
    const [first, ...rest] = updateFnArr;
    return updateRecursive<TValue>(first, ...rest)(stateOrFunction);
  }

  return (state: InferredControlState<TValue>): InferredControlState<TValue> => {
    return [stateOrFunction as any, ...updateFnArr].reduce((s, updateFn) => updateRecursiveSingle(state, updateFn)(s), state);
  };
}
