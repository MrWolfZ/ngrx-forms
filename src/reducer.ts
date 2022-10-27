import { Action, ActionReducer } from '@ngrx/store';

import { Actions, ALL_NGRX_FORMS_ACTION_TYPES } from './actions';
import { formArrayReducer } from './array/reducer';
import { formControlReducer } from './control/reducer';
import { formGroupReducer } from './group/reducer';
import { AbstractControlState, FormArrayState, FormControlState, FormState, isArrayState, isFormState, isGroupState, KeyValue } from './state';
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
    return formArrayReducer(state as FormArrayState<any>, action) as any;
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
```typescript
interface FormValue {
  name: string;
  email: string;
}

const updateFormState = updateGroup<FormValue>(
  {
    name: validate(required),
  },
  {
    email: (email, parentGroup) =>
      parentGroup.controls.name.isInvalid
        ? setValue('', email)
        : email,
  },
);

const reducer = createFormStateReducerWithUpdate<FormValue>(updateFormState);
```
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

function reduceNestedFormState<TState>(state: TState, key: keyof TState, action: Action): TState {
  const value = state[key];

  if (!isFormState(value)) {
    return state;
  }

  return {
    ...state,
    [key]: formStateReducer(value, action),
  };
}

function reduceNestedFormStates<TState extends KeyValue>(state: TState, action: Action): TState {
  return Object.keys(state).reduce((s, key) => reduceNestedFormState(s, key as keyof TState, action), state);
}

/**
 * This function returns an object that can be passed to ngrx's `createReducer`
 * function (available starting with ngrx version 8). By doing this all form
 * state properties on the state will be updated whenever necessary (i.e.
 * whenever an ngrx-forms action is dispatched).
 *
 * To manually update a form state (e.g. to validate it) use
 * `wrapReducerWithFormStateUpdate`.
 */
export function onNgrxForms<TState = any>(): { reducer: ActionReducer<TState>; types: string[] } {
  return {
    reducer: (state, action) => isFormState(state) ? formStateReducer(state!, action) as unknown as TState : reduceNestedFormStates(state!, action),
    types: ALL_NGRX_FORMS_ACTION_TYPES,
  };
}

export interface ActionConstructor {
  new(...args: any[]): Actions<any>;
  readonly TYPE: string;
}

export type CreatedAction<TActionCons> = TActionCons extends new (...args: any[]) => infer TAction ? TAction : never;

/**
 * Define a reducer for a ngrx-forms action. This functions works the same as
 * ngrx's `on` except that you provide the ngrx-forms action class instead of
 * your action creator as a parameter.
 */
export function onNgrxFormsAction<
  TActionCons extends ActionConstructor,
  TState
>(
  actionCons: TActionCons,
  reducer: (state: TState, action: CreatedAction<TActionCons>) => TState,
): { reducer: ActionReducer<TState>; types: string[] } {
  return {
    reducer: (state, action) => reducer(reduceNestedFormStates(state!, action), action as any),
    types: [actionCons.TYPE],
  };
}

/**
 * This function wraps a reducer and returns another reducer that first calls
 * the given reducer and then calls the given update function for the form state
 * that is specified by the form state locator function.
 *
 * The update function is passed the form state and the updated containing state
 * as parameters.
 */
export function wrapReducerWithFormStateUpdate<TState extends KeyValue, TFormState extends AbstractControlState<any>>(
  reducer: ActionReducer<TState>,
  formStateLocator: (state: TState) => TFormState,
  updateFn: (formState: TFormState, state: TState) => TFormState,
): ActionReducer<TState> {
  return (state, action) => {
    const updatedState = reducer(state, action);

    const formState = formStateLocator(updatedState);

    // if the state itself is the form state, update it directly
    if (formState === updatedState as unknown) {
      return updateFn(formState, updatedState) as unknown as TState;
    }

    const formStateKey = Object.keys(updatedState).find(key => updatedState[key as keyof TState] as any === formState)!;

    const updatedFormState = updateFn(formState, updatedState);

    if (updatedFormState === formState) {
      return updatedState;
    }

    return {
      ...updatedState,
      [formStateKey]: updatedFormState,
    };
  };
}
