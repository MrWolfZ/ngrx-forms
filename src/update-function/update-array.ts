import { computeArrayState, FormArrayState, FormState, isArrayState } from '../state';
import { ensureState, ProjectFn2 } from './util';

export type FilterFn<TValue> = (s: FormState<TValue>, idx: number) => boolean;

function updateArrayControlsState<TValue>(filterFn: FilterFn<TValue>, updateFn: ProjectFn2<FormState<TValue>, FormArrayState<TValue>>) {
  return (state: FormArrayState<TValue>) => {
    let hasChanged = false;
    const newControls = state.controls.map((control, idx) => {
      if (!filterFn(control, idx)) {
        return control;
      }

      const newControl = updateFn(control, state);
      hasChanged = hasChanged || newControl !== control;
      return newControl;
    });
    return hasChanged ? newControls : state.controls;
  };
}

function updateArraySingle<TValue>(filterFn: FilterFn<TValue>, updateFn: ProjectFn2<FormState<TValue>, FormArrayState<TValue>>) {
  return (state: FormArrayState<TValue>): FormArrayState<TValue> => {
    const newControls = updateArrayControlsState<TValue>(filterFn, updateFn)(state);
    return newControls !== state.controls
      ? computeArrayState<TValue>(
        state.id,
        newControls,
        state.value,
        state.errors,
        state.pendingValidations,
        state.userDefinedProperties,
        {
          wasOrShouldBeDirty: state.isDirty,
          wasOrShouldBeEnabled: state.isEnabled,
          wasOrShouldBeTouched: state.isTouched,
          wasOrShouldBeSubmitted: state.isSubmitted,
        },
      )
      : state;
  };
}

/**
 * This update function takes a filter function and one or more update functions
 * and returns a projection function that applies all update functions one after
 * another to each element of the form array state for which the filter function
 * returns `true`.
 *
 * The following (contrived) example uses this function to validate all its
 * children to be required and mark them as dirty.
 *
```typescript
const arrayUpdateFn = updateArray<string>(
  (_, idx) => idx > 0,
  validate(required),
  markAsDirty,
);
const updatedState = arrayUpdateFn(state);
```
 */
export function updateArrayWithFilter<TValue>(
  filterFn: FilterFn<TValue>,
  updateFn: ProjectFn2<FormState<TValue>, FormArrayState<TValue>>,
  ...updateFnArr: ProjectFn2<FormState<TValue>, FormArrayState<TValue>>[]
): (state: FormArrayState<TValue>) => FormArrayState<TValue>;

/**
 * This update function takes a filter function and an array of update functions
 * and returns a projection function that applies all update functions one after
 * another to each element of the form array state for which the filter function
 * returns `true`.
 *
 * The following (contrived) example uses this function to validate all its
 * children to be required and mark them as dirty.
 *
```typescript
const arrayUpdateFn = updateArray<string>(
  (_, idx) => idx > 0,
  [
    validate(required),
    markAsDirty,
  ],
);
const updatedState = arrayUpdateFn(state);
```
 */
export function updateArrayWithFilter<TValue>(
  filterFn: FilterFn<TValue>,
  updateFnArr: ProjectFn2<FormState<TValue>, FormArrayState<TValue>>[],
): (state: FormArrayState<TValue>) => FormArrayState<TValue>;

/**
 * This update function takes a form array state, a filter function, and a variable
 * number of update functions and applies all update functions one after another to
 * each element of the form array state for which the filter function returns `true`.
 *
 * The following (contrived) example uses this function to validate all its
 * children to be required and mark them as dirty.
 *
```typescript
const updatedState = updateArray<string>(
  state,
  (_, idx) => idx > 0,
  validate(required),
  markAsDirty,
);
```
 */
export function updateArrayWithFilter<TValue>(
  state: FormArrayState<TValue>,
  filterFn: FilterFn<TValue>,
  updateFn: ProjectFn2<FormState<TValue>, FormArrayState<TValue>>,
  ...updateFnArr: ProjectFn2<FormState<TValue>, FormArrayState<TValue>>[]
): FormArrayState<TValue>;

/**
 * This update function takes a form array state, a filter function, and an array of
 * update functions and applies all update functions one after another to each
 * element of the form array state for which the filter function returns `true`.
 *
 * The following (contrived) example uses this function to validate all its
 * children to be required and mark them as dirty.
 *
```typescript
const updatedState = updateArray<string>(
  state,
  (_, idx) => idx > 0,
  [
    validate(required),
    markAsDirty,
  ],
);
```
 */
export function updateArrayWithFilter<TValue>(
  state: FormArrayState<TValue>,
  filterFn: FilterFn<TValue>,
  updateFnArr: ProjectFn2<FormState<TValue>, FormArrayState<TValue>>[],
): FormArrayState<TValue>;

export function updateArrayWithFilter<TValue>(
  stateOrFilterFunction: FormArrayState<TValue> | FilterFn<TValue>,
  filterFunctionOrFunctionOrFunctionArray:
    | FilterFn<TValue>
    | ProjectFn2<FormState<TValue>, FormArrayState<TValue>>
    | ProjectFn2<FormState<TValue>, FormArrayState<TValue>>[],
  updateFnOrUpdateFnArr?: ProjectFn2<FormState<TValue>, FormArrayState<TValue>> | ProjectFn2<FormState<TValue>, FormArrayState<TValue>>[],
  ...rest: ProjectFn2<FormState<TValue>, FormArrayState<TValue>>[]
) {
  if (isArrayState<TValue>(stateOrFilterFunction)) {
    const filterFn = filterFunctionOrFunctionOrFunctionArray as FilterFn<TValue>;
    const updateFnArr = Array.isArray(updateFnOrUpdateFnArr) ? updateFnOrUpdateFnArr : [updateFnOrUpdateFnArr!];
    return updateFnArr.concat(...rest).reduce((s, updateFn) => updateArraySingle<TValue>(filterFn, updateFn)(s), stateOrFilterFunction);
  }

  let updateFnArr = Array.isArray(filterFunctionOrFunctionOrFunctionArray)
    ? filterFunctionOrFunctionOrFunctionArray
    : [filterFunctionOrFunctionOrFunctionArray as ProjectFn2<FormState<TValue>, FormArrayState<TValue>>];
  updateFnArr = updateFnOrUpdateFnArr === undefined ? updateFnArr : updateFnArr.concat(updateFnOrUpdateFnArr);
  return (s: FormArrayState<TValue>) => updateArrayWithFilter<TValue>(ensureState(s), stateOrFilterFunction, updateFnArr.concat(rest));
}

/**
 * This update function takes one or more update functions and returns a
 * projection function that applies all update functions one after another to
 * each element of the form array state.
 *
 * The following (contrived) example uses this function to validate all its
 * children to be required and mark them as dirty.
 *
```typescript
const arrayUpdateFn = updateArray<string>(
  validate<string>(required),
  markAsDirty,
);
const updatedState = arrayUpdateFn(state);
```
 */
export function updateArray<TValue>(
  updateFn: ProjectFn2<FormState<TValue>, FormArrayState<TValue>>,
  ...updateFnArr: ProjectFn2<FormState<TValue>, FormArrayState<TValue>>[]
): (state: FormArrayState<TValue>) => FormArrayState<TValue>;

/**
 * This update function takes an array of update functions and returns
 * a projection function that applies all update functions one after another to
 * each element of the form array state.
 *
 * The following (contrived) example uses this function to validate all its
 * children to be required and mark them as dirty.
 *
```typescript
const arrayUpdateFn = updateArray<string>([
  validate<string>(required),
  markAsDirty,
]);
const updatedState = arrayUpdateFn(state);
```
 */
export function updateArray<TValue>(
  updateFnArr: ProjectFn2<FormState<TValue>, FormArrayState<TValue>>[],
): (state: FormArrayState<TValue>) => FormArrayState<TValue>;

/**
 * This update function takes a form array state and one or more update functions
 * and applies all update functions one after another to each element of the form
 * array state.
 *
 * The following (contrived) example uses this function to validate all its
 * children to be required and mark them as dirty.
 *
```typescript
const updatedState = updateArray<string>(
  state,
  validate<string>(required),
  markAsDirty,
);
```
 */
export function updateArray<TValue>(
  state: FormArrayState<TValue>,
  updateFn: ProjectFn2<FormState<TValue>, FormArrayState<TValue>>,
  ...updateFnArr: ProjectFn2<FormState<TValue>, FormArrayState<TValue>>[]
): FormArrayState<TValue>;

/**
 * This update function takes a form array state and an array of update
 * functions and applies all update functions one after another to each element
 * of the form array state.
 *
 * The following (contrived) example uses this function to validate all its
 * children to be required and mark them as dirty.
 *
```typescript
const updatedState = updateArray<string>(
  state,
  [
    validate<string>(required),
    markAsDirty,
  ],
);
```
 */
export function updateArray<TValue>(
  state: FormArrayState<TValue>,
  updateFnArr: ProjectFn2<FormState<TValue>, FormArrayState<TValue>>[],
): FormArrayState<TValue>;

export function updateArray<TValue>(
  stateOrFunctionOrFunctionArray:
    | FormArrayState<TValue>
    | ProjectFn2<FormState<TValue>, FormArrayState<TValue>>
    | ProjectFn2<FormState<TValue>, FormArrayState<TValue>>[],
  updateFnOrUpdateFnArr?: ProjectFn2<FormState<TValue>, FormArrayState<TValue>> | ProjectFn2<FormState<TValue>, FormArrayState<TValue>>[],
  ...rest: ProjectFn2<FormState<TValue>, FormArrayState<TValue>>[]
) {
  if (isArrayState<TValue>(stateOrFunctionOrFunctionArray)) {
    const updateFnArr = Array.isArray(updateFnOrUpdateFnArr) ? updateFnOrUpdateFnArr : [updateFnOrUpdateFnArr!];
    return updateFnArr.concat(...rest).reduce((s, updateFn) => updateArraySingle<TValue>(() => true, updateFn)(s), stateOrFunctionOrFunctionArray);
  }

  let updateFnArr = Array.isArray(stateOrFunctionOrFunctionArray) ? stateOrFunctionOrFunctionArray : [stateOrFunctionOrFunctionArray];
  updateFnArr = updateFnOrUpdateFnArr === undefined ? updateFnArr : updateFnArr.concat(updateFnOrUpdateFnArr);
  return (s: FormArrayState<TValue>) => updateArray<TValue>(ensureState(s), updateFnArr.concat(rest));
}
