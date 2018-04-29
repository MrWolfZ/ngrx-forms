All form states are internally updated by **ngrx-forms** through dispatching actions from the directives. While this is of course also possible for you there exist a set of update functions that can be used to update form states. This is mainly useful to change the state as a result of a different action in your reducer. Note that **ngrx-forms** is coded in such a way that no state references will change if nothing inside the state changes. It is therefore perfectly safe to repeatedly call any of the functions below and the state will be updated exactly once or not at all if nothing changed. Each function can be imported from `'ngrx-forms'` (e.g. `import { setValue } from 'ngrx-forms';`).

Below you will find a complete list of all update functions provided by **ngrx-forms**. Each section also shows how to use actions directly instead of the update functions (the examples directly call the `formStateReducer` but you can of course dispatch these actions from anywhere in your code).

###### Set Value

The `setValue` update function takes a value and returns a projection function that sets the value of a form state. Setting the value of a group or array will also update the values of all its child states including adding and removing child states on the fly for added/removed properties/items. `setValue` has an overload that takes a state directly as the first parameter.

```typescript
// control
const control = createFormControlState<string>('control ID', '');
const updatedControl = setValue('new Value')(control);
const updatedControlUncurried = setValue(control, 'newValue');
const updatedControlViaAction = formStateReducer(control, new SetValueAction(control.id, 'newValue'));

// group
const group = createFormGroupState<{ inner: string }>('group ID', { inner: '' });
const updatedGroup = setValue({ inner: 'newValue' })(group);
const updatedGroupUncurried = setValue(group, { inner: 'newValue' });
const updatedGroupViaAction = formStateReducer(group, new SetValueAction(group.id, { inner: 'newValue' }));

// array
const array = createFormArrayState<string>('array ID', ['']);
const updatedArray = setValue(['newValue'])(array);
const updatedArrayUncurried = setValue(array, ['newValue']);
const updatedArrayViaAction = formStateReducer(array, new SetValueAction(array.id, ['newValue']));
```

|Function|Description|
|-|-|
|`validate`|This update function takes a validation function or an array of validation functions and returns a projection function that sets the errors of a form state to the result of applying the given validation function(s) to the state's value. Has an overload that takes a state directly as the second parameter.|
|`setErrors`|This update function takes an error object or an array of error objects and returns a projection function that sets the errors of a form state. Has an overload that takes a state directly as the second parameter.|
|`enable`|This update function takes a form state and enables it. For groups and arrays also enables all children.|
|`disable`|This update function takes a form state and disables it. For groups and arrays also disables all children. Disabling a control will clear all of its errors (i.e. making it always valid) and will remove all pending validations (thereby effectively cancelling those validations).|
|`markAsDirty`|This update function takes a state and marks it as dirty. For groups and arrays this also marks all children as dirty.|
|`markAsPristine`|This update function takes a state and marks it as pristine. For groups and arrays this also marks all children as pristine.|
|`markAsTouched`|This update function takes a state and marks it as touched. For groups and arrays this also marks all children as touched.|
|`markAsUntouched`|This update function takes a state and marks it as untouched. For groups and arrays this also marks all children as untouched.|
|`markAsSubmitted`|This update function takes a state and marks it as submitted. For groups and arrays this also marks all children as submitted.|
|`markAsUnsubmitted`|This update function takes a state and marks it as unsubmitted. For groups and arrays this also marks all children as unsubmitted.|
|`reset`|This update function takes a state and marks it as pristine, untouched, and unsubmitted. For groups and arrays this also marks all children as pristine, untouched, and unsubmitted.|
|`focus`|This update function takes a form control state and marks it as focused (which will also `.focus()` the form element).|
|`unfocus`|This update function takes a form control state and marks it as not focused (which will also `.blur()` the form element).|
|`addArrayControl`|This update function takes a value and optionally an index and returns a projection function that adds a child control at the given index or at the end of a form array state. Has an overload that takes a form array state directly as the second parameter and optionally the index as the third parameter.|
|`removeArrayControl`|This update function takes an index and returns a projection function that removes the child control at the given index from a form array state. Has an overload that takes a form array state directly as the second parameter.|
|`addGroupControl`|This update function takes a name and a value and returns a projection function that adds a child control with the given name and value to a form group state. Has an overload that takes a form group state directly as the third parameter.|
|`removeGroupControl`|This update function takes a name and returns a projection function that removes the child control with the given name from a form group state. Has an overload that takes a form group state directly as the second parameter.|
|`setUserDefinedProperty`|This update function takes a name and a value and returns a projection function that sets a user-defined property on a form state. Has an overload that takes a state directly as the second parameter.|

These are the basic functions that perform simple updates on states. The functions below contain the real magic that allows easily updating deeply nested form states.

#### `updateArray`
This update function takes an update function and returns a projection function that takes an array state, applies the provided update function to each element and recomputes the state of the array afterwards. As with all the functions above this function does not change the reference of the array if the update function does not change any children. See the section below for an example of how this function can be used.

#### `updateArrayWithFilter`
This update function is the same as `updateArray` except that it also takes a filter function that is applied to each array element to determine whether the update function should be applied.

#### `updateGroup`
This update function takes a partial object in the shape of the group's value where each key contains an update function for that child and returns a projection function that takes a group state, applies all the provided update functions recursively and recomputes the state of the group afterwards. As with all the functions above this function does not change the reference of the group if none of the child update functions change any children. The best example of how this can be used is simple validation:

```typescript
import { updateArray, updateGroup, validate } from 'ngrx-forms';

export interface NestedValue {
  someNumber: number;
}

export interface MyFormValue {
  someTextInput: string;
  someCheckbox: boolean;
  nested: NestedValue;
  someNumbers: number[];
}

function required(value: any) {
  return !!value ? {} : { required: true };
}

function min(minValue: number) {
  return (value: number) => {
    return value >= minValue ? {} : { min: [value, minValue] };
  };
}

const updateMyFormGroup = updateGroup<MyFormValue>({
  someTextInput: validate(required),
  nested: updateGroup({
    someNumber: validate([required, min(2)]),
  }),
  someNumbers: updateArray(validate(min(3))),
});
```

The `updateMyFormGroup` function has a signature of `FormGroupState<MyFormValue> -> FormGroupState<MyFormValue>`. It takes a state, runs all validations, updates the errors, and returns the resulting state.

In addition, the `updateGroup` function allows specifying as many update function objects as you want and applies all of them after another. This is useful if you have dependencies between your update functions where one function's result may affect the result of another function. The following (contrived) example shows how to set the value of `someNumber` based on the `errors` of `someTextInput`.

```typescript
const updateMyFormGroup = updateGroup<MyFormValue>({
  someTextInput: validate(required),
  nested: updateGroup({
    someNumber: validate([required, min(2)]),
  }),
  someNumbers: updateArray(validate(min(3))),
}, {
  // note that the parent form state is provided as the second argument to update functions;
  // type annotations added for clarity but are inferred correctly otherwise
  nested: (nested: AbstractControlState<NestedValue>, myForm: FormGroupState<MyFormValue>) =>
    updateGroup<NestedValue>({
      someNumber: (someNumber: AbstractControlState<number>) => {
        if (myForm.controls.someTextInput.errors.required) {
          // sets the control's value to 1 and clears all errors
          return setErrors({}, setValue(1, someNumber));
        }

        return someNumber;
      };
    })(nested)
});
```

If you need to update the form state based on data not contained in the form state itself you can simply parameterize the form update function. In the following example we validate that `someNumber` is greater than some other number from the state.

```typescript
const createMyFormUpdateFunction = (otherNumber: number) => updateGroup<MyFormValue>({
  nested: updateGroup({
    otherNumber: validate(v => v > otherNumber ? {} : { tooSmall: otherNumber }),
  }),
});

export function appReducer(state = initialState, action: Action): AppState {
  let myForm = formGroupReducer(state.myForm, action);
  myForm = createMyFormUpdateFunction(state.someOtherNumber)(myForm);
  if (myForm !== state.myForm) {
    state = { ...state, myForm };
  }

  switch (action.type) {
    case 'some action type':
      // modify state
      return state;

    case 'some action type of an action that changes `someOtherNumber`':
      // we need to update the form state as well since the parameters changed
      myForm = createMyFormUpdateFunction(action.someOtherNumber)(state.myForm);
      return {
        ...state,
        someOtherNumber: action.someOtherNumber,
        myForm,
      };

    default: {
      return state;
    }
  }
}
```

#### `createFormStateReducerWithUpdate`
This function combines the `formStateReducer` with a variable number of update functions and returns a reducer function that applies the provided update functions in order after reducing the form state with the action. However, the update functions are only applied if the form state changed as result of applying the action (this provides a performance improvement for large form states). If you need the update functions to be applied regardless of whether the state changed (e.g. because the update function closes over variables that may change independently of the form state) you can simply apply the update manually (e.g. `updateFunction(formStateReducer(state, action))`).

Combining all we have seen so far we could have a reducer that looks something like this:

```typescript
export interface AppState {
  myForm: FormGroupState<MyFormValue>;
}

const FORM_ID = 'some globally unique string';

const initialFormState = createFormGroupState<MyFormValue>(FORM_ID, {
  someTextInput: '',
  someCheckbox: false,
  nested: {
    someNumber: 0,
  },
  someNumbers: [],
});

const initialState: AppState = {
  myForm: initialFormState,
};

const validateAndUpdateFormState = updateGroup<MyFormValue>({
  someTextInput: validate(required),
  nested: updateGroup({
    someNumber: validate([required, min(2)]),
  }),
  someNumbers: updateArray(validate(min(3))),
}, {
  nested: (nested, myForm) =>
    updateGroup<NestedValue>({
      someNumber: someNumber => {
        if (myForm.controls.someTextInput.errors.required) {
          return setErrors({}, setValue(1, someNumber));
        }

        return someNumber;
      }
    })(nested)
});

const myFormReducer = createFormStateReducerWithUpdate<MyFormValue>(validateAndUpdateFormState);

export function appReducer(state = initialState, action: Action): AppState {
  const myForm = myFormReducer(state.myForm, action);
  if (myForm !== state.myForm) {
    state = { ...state, myForm };
  }

  switch (action.type) {
    case 'some action type':
      // modify state
      return state;

    default: {
      return state;
    }
  }
}
```

#### `updateRecursive`
Sometimes it is useful to apply an update function to all controls in a group or array recursively. This update function takes an update function and returns a projection function that takes any state and applies the provided update function to all its children, its children's children etc. and finally to the state itself. This means when the update function is called for a certain state all of its children will have already been updated. The provided update function takes 2 parameters, the state to update and its parent state. For the top-level state the state itself is passed as the second parameter.

Below you can find an example of how this function can be used. In this example we want to block all form inputs temporarily (e.g. while submitting the form). This can be done by disabling the form state at the root. However, when we unblock all inputs we want their enabled/disabled state to be reset to what it was before blocking the inputs. This could be done by simply storing a complete copy of the state (which might take a lot of space depending on the size of the form state). However, the example below uses a different method. We use the `setUserDefinedProperty` update function to store the enabled/disabled state before blocking the inputs and later restore them to the state they were in.

```typescript
import { updateRecursive, setUserDefinedProperty, enable, disable, cast } from 'ngrx-forms';

export function appReducer(state = initialState, action: Action): AppState {
  switch (action.type) {
    case 'BLOCK_INPUTS': {
      let myForm = updateRecursive<MyFormValue>(s => setUserDefinedProperty('wasDisabled', s.isDisabled)(s))(state.myForm);
      myForm = disable(myForm);

      return {
        ...state,
        myForm,
      };
    }

    case 'UNBLOCK_INPUTS': {
      let myForm = enable(state.myForm);
      myForm = updateRecursive<MyFormValue>(s => s.userDefinedProperties.wasDisabled ? disable(s) : s)(myForm);

      return {
        ...state,
        myForm,
      };
    }

    default: {
      return state;
    }
  }
}
```
