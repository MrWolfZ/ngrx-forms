import {
  AbstractControlState,
  FormState,
  isArrayState,
  isFormState,
  isGroupState,
} from '../state';
import { updateArray } from './update-array';
import { StateUpdateFns, updateGroup } from './update-group';
import { ensureState, ProjectFn2 } from './util';

function updateRecursiveSingle(parent: AbstractControlState<any>, updateFn: ProjectFn2<AbstractControlState<any>, AbstractControlState<any>>) {
  return (state: AbstractControlState<any>): AbstractControlState<any> => {
    if (isGroupState(state)) {
      const updateFunctions = Object.keys(state.controls).reduce((agg, key) => Object.assign(agg, {
        [key]: (s: AbstractControlState<any>, p: AbstractControlState<any>) => updateRecursiveSingle(p, updateFn)(s),
      }), {} as StateUpdateFns<any>);
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
 * This update function takes a form array state and one or more update
 * functions applies all update functions one after another to the state
 * recursively, i.e. the function is applied to the state's children,
 * their children etc.
 *
 * The following example uses this function to validate all controls in a
 * group or array as required.
 *
 ```typescript
 const updatedState = updateRecursive(
   state,
   validate<any>(required),
 );
 ```
 */
export function updateRecursive<TValue>(
  state: AbstractControlState<TValue>,
  updateFn: ProjectFn2<AbstractControlState<any>, AbstractControlState<any>>,
  ...updateFnArr: ProjectFn2<AbstractControlState<any>, AbstractControlState<any>>[]
): FormState<TValue>;

/**
 * This update function takes a form array state and an array of
 * update functions applies all update functions one after another to the
 * state recursively, i.e. the function is applied to the state's children,
 * their children etc.
 *
 * The following example uses this function to validate all controls in a
 * group or array as required.
 *
```typescript
const updatedState = updateRecursive(
  state,
  [validate<any>(required)],
);
```
 */
export function updateRecursive<TValue>(
  state: AbstractControlState<TValue>,
  updateFnArr: ProjectFn2<AbstractControlState<any>, AbstractControlState<any>>[],
): FormState<TValue>;

/**
 * This update function takes one or more update functions and returns a
 * projection function that applies all update functions one after another to
 * a form state.
 *
 * The following example uses this function to validate all controls in a
 * group as required.
 *
```typescript
const updateFn = updateRecursive(validate<any>(required));
const updatedState = updateFn(state);
```
 */
export function updateRecursive(
  updateFn: ProjectFn2<AbstractControlState<any>, AbstractControlState<any>>,
  ...updateFnArr: ProjectFn2<AbstractControlState<any>, AbstractControlState<any>>[]
): <TValue>(state: AbstractControlState<TValue>) => FormState<TValue>;

/**
 * This update function takes an array of update functions and returns
 * a projection function that applies all update functions one after another to
 * a form state.
 *
 * The following example uses this function to validate all controls in a
 * group as required.
 *
```typescript
const updateFn = updateRecursive([validate<any>(required)]);
const updatedState = updateFn(state);
```
 */
export function updateRecursive(
  updateFnArr: ProjectFn2<AbstractControlState<any>, AbstractControlState<any>>[],
): <TValue>(state: AbstractControlState<TValue>) => FormState<TValue>;

export function updateRecursive<TValue>(
  stateOrFunctionOrFunctionArray:
    | AbstractControlState<TValue>
    | ProjectFn2<AbstractControlState<any>, AbstractControlState<any>>
    | ProjectFn2<AbstractControlState<any>, AbstractControlState<any>>[],
  updateFnOrUpdateFnArr?: ProjectFn2<AbstractControlState<any>, AbstractControlState<any>> | ProjectFn2<AbstractControlState<any>, AbstractControlState<any>>[],
  ...rest: ProjectFn2<AbstractControlState<any>, AbstractControlState<any>>[]
) {
  if (isFormState(stateOrFunctionOrFunctionArray)) {
    const updateFnArr = Array.isArray(updateFnOrUpdateFnArr) ? updateFnOrUpdateFnArr : [updateFnOrUpdateFnArr!];
    return updateFnArr.concat(...rest)
      .reduce((s, updateFn) => updateRecursiveSingle(stateOrFunctionOrFunctionArray, updateFn)(s), stateOrFunctionOrFunctionArray);
  }

  let updateFnArr = Array.isArray(stateOrFunctionOrFunctionArray) ? stateOrFunctionOrFunctionArray : [stateOrFunctionOrFunctionArray];
  updateFnArr = updateFnOrUpdateFnArr === undefined ? updateFnArr : updateFnArr.concat(updateFnOrUpdateFnArr);
  return (s: AbstractControlState<TValue>) => updateRecursive<TValue>(ensureState(s), updateFnArr.concat(rest));
}
