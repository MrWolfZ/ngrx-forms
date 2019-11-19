import { computeGroupState, FormGroupControls, FormGroupState, FormState, isGroupState, KeyValue } from '../state';
import { ensureState, ProjectFn2 } from './util';

export type StateUpdateFns<TValue extends KeyValue> = {
  [controlId in keyof TValue]?: ProjectFn2<FormState<TValue[controlId]>, FormGroupState<TValue>>;
};

function updateGroupControlsState<TValue extends KeyValue>(updateFns: StateUpdateFns<TValue>) {
  return (state: FormGroupState<TValue>) => {
    let hasChanged = false;
    const newControls = Object.keys(state.controls).reduce((res, key) => {
      const control = state.controls[key];
      Object.assign(res, { [key]: control });
      if (updateFns.hasOwnProperty(key)) {
        const newControl = updateFns[key]!(control, state);
        hasChanged = hasChanged || newControl !== control;
        Object.assign(res, { [key]: newControl });
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
      ? computeGroupState<TValue>(
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
 * This update function takes one or more update function objects and returns
 * a projection function that applies all objects one after another to a form
 * group state.
 *
 * The following (contrived) example uses this function to validate the child
 * control `name` to be required and set the child control `email`'s value to
 * be `''` if the name is invalid.
 *
```typescript
interface FormValue {
  name: string;
  email: string;
}

const groupUpdateFn = updateGroup<FormValue>(
  {
    name: validate<string>(required),
  },
  {
    email: (email, parentGroup) =>
      parentGroup.controls.name.isInvalid
        ? setValue('', email)
        : email,
  },
);
const updatedState = groupUpdateFn(state);
```
 */
export function updateGroup<TValue>(
  updateFn: StateUpdateFns<TValue>,
  ...updateFnsArr: StateUpdateFns<TValue>[]
): (state: FormGroupState<TValue>) => FormGroupState<TValue>;

/**
 * This update function takes an array of update function objects and
 * returns a projection function that applies all objects one after another to
 * a form group state.
 *
 * The following (contrived) example uses this function to validate the child
 * control `name` to be required and set the child control `email`'s value to
 * be `''` if the name is invalid.
 *
```typescript
interface FormValue {
  name: string;
  email: string;
}

const groupUpdateFn = updateGroup<FormValue>(
  [
    {
      name: validate<string>(required),
    },
    {
      email: (email, parentGroup) =>
        parentGroup.controls.name.isInvalid
          ? setValue('', email)
          : email,
    },
  ],
);
const updatedState = groupUpdateFn(state);
```
 */
export function updateGroup<TValue>(
  updateFnsArr: StateUpdateFns<TValue>[],
): (state: FormGroupState<TValue>) => FormGroupState<TValue>;

/**
 * This update function takes a form group state and one or more update
 * function objects and applies all objects one after another to the state.
 * Providing multiple update function objects is mainly useful if the result
 * of a later object depends on the result of previous objects.
 *
 * The following (contrived) example uses this function to validate the child
 * control `name` to be required and set the child control `email`'s value to
 * be `''` if the name is invalid.
 *
```typescript
interface FormValue {
  name: string;
  email: string;
}

const updatedState = updateGroup<FormValue>(
  state,
  {
    name: validate<string>(required),
  },
  {
    email: (email, parentGroup) =>
      parentGroup.controls.name.isInvalid
        ? setValue('', email)
        : email,
  },
);
```
 */
export function updateGroup<TValue>(
  state: FormGroupState<TValue>,
  updateFn: StateUpdateFns<TValue>,
  ...updateFnsArr: StateUpdateFns<TValue>[]
): FormGroupState<TValue>;

/**
 * This update function takes a form group state and an array of update
 * function objects and applies all objects one after another to the state.
 * Providing multiple update function objects is mainly useful if the result
 * of a later object depends on the result of previous objects.
 *
 * The following (contrived) example uses this function to validate the child
 * control `name` to be required and set the child control `email`'s value to
 * be `''` if the name is invalid.
 *
```typescript
interface FormValue {
  name: string;
  email: string;
}

const updatedState = updateGroup<FormValue>(
  state,
  [
    {
      name: validate<string>(required),
    },
    {
      email: (email, parentGroup) =>
        parentGroup.controls.name.isInvalid
          ? setValue('', email)
          : email,
    },
  ],
);
```
 */
export function updateGroup<TValue>(
  state: FormGroupState<TValue>,
  updateFnsArr: StateUpdateFns<TValue>[],
): FormGroupState<TValue>;

export function updateGroup<TValue extends KeyValue>(
  stateOrUpdateFnOrUpdateFnArray: FormGroupState<TValue> | StateUpdateFns<TValue> | StateUpdateFns<TValue>[],
  updateFnOrUpdateFnArr?: StateUpdateFns<TValue> | StateUpdateFns<TValue>[],
  ...rest: StateUpdateFns<TValue>[]
) {
  if (isGroupState<TValue>(stateOrUpdateFnOrUpdateFnArray)) {
    const updateFnArr = Array.isArray(updateFnOrUpdateFnArr) ? updateFnOrUpdateFnArr : [updateFnOrUpdateFnArr!];
    return updateFnArr.concat(...rest).reduce((s, updateFn) => updateGroupSingle<TValue>(updateFn)(s), stateOrUpdateFnOrUpdateFnArray);
  }

  let updateFnArr = Array.isArray(stateOrUpdateFnOrUpdateFnArray) ? stateOrUpdateFnOrUpdateFnArray : [stateOrUpdateFnOrUpdateFnArray];
  updateFnArr = updateFnOrUpdateFnArr === undefined ? updateFnArr : updateFnArr.concat(updateFnOrUpdateFnArr);
  return (s: FormGroupState<TValue>) => updateGroup<TValue>(ensureState(s), updateFnArr.concat(rest));
}
