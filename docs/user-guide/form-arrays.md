Arrays are similar to [groups](form-groups.md) in that they are a logical grouping of multiple form states. However, instead of each state having an explicit name, form arrays just contain a plain array of form states (with all states usually having the same value type, e.g. `string` etc.).

In TypeScript they are represented by the following interface.

```typescript
export class FormArrayState<TValue> {
  id: string;
  value: TValue[];
  isValid: boolean;
  isInvalid: boolean;
  errors: { [key: string]: any; };
  pendingValidations: string[];
  isValidationPending: boolean;
  isEnabled: boolean;
  isDisabled: boolean;
  isDirty: boolean;
  isPristine: boolean;
  isTouched: boolean;
  isUntouched: boolean;
  isSubmitted: boolean;
  isUnsubmitted: boolean;
  userDefinedProperties: { [key: string]: any; };
  controls: FormState<TValue>[];
}
```

The `TValue` type parameter describes the value type of all child states and is used for [inferring the type](type-inference.md) of child states.

The following table explains each property of an array.

|Property|Negated|Description|
|-|-|-|
|`id`||The unique ID of the array.|
|`value`||The aggregated value of the array. The value is computed by aggregating the values of all children into an array.|
|`isValid`|`isInvalid`|The `isValid` property is `true` if the array does not have any errors itself and none of its children have any errors.|
|`errors`||The errors of the array. This property is computed by merging the errors of the control with the errors of all its children where the child errors are a property of the `errors` object prefixed with an underscore (e.g. `{ arrayError: true, _0: { childError: true } }`). If neither the array nor any children have errors the property is set to `{}`.|
|`pendingValidations`||The names of all asynchronous validations currently running for the array.|
|`isValidationPending`||The `isValidationPending` property indicates whether the array or any of its children are currently being asynchronously validated.|
|`isEnabled`|`isDisabled`|The `isEnabled` property is `true` if at least one child state is enabled or the state itself is directly enabled.|
|`isDirty`|`isPristine`|The `isDirty` property is `true` if at least one child state is marked as dirty or the state itself is directly marked as dirty.|
|`isTouched`|`isUntouched`|The `isTouched` property is `true` if at least one child state is marked as touched or the state itself is directly marked as touched.|
|`isSubmitted`|`isUnsubmitted`|The `isSubmitted` property is set to `true` if the array is submitted.|
|`controls`||This property contains all child states of the array.|
|`userDefinedProperties`||`userDefinedProperties` work the same for arrays as they do for controls.|

Array states are mostly updated by intercepting all actions that change their children (i.e. the array's reducer is the parent reducer of all its child reducers and forwards any actions to all children; if any children change it recomputes the state of the array). An array state can be created via `createFormArrayState`, which takes an initial value and automatically creates all child states recursively. Below is an example of creating a simple form array.

```typescript
export const FORM_ID = 'exampleForm';

export const INITIAL_STATE = createFormArrayState<string>(FORM_ID, ['A', 'B']);
```

#### Connecting to the DOM

Only the root [group](form-groups.md) or array of your form state needs to be connected to the DOM. This is done by the `NgrxFormDirective` (which needs to be applied to a form via `[ngrxFormState]="formState"`). Note that applying this directive to a `form` element prevents normal form submission since that does not make much sense for ngrx forms.

#### Status CSS Classes

**ngrx-forms** adds CSS classes to `form` elements depending on the associated form state. The available classes are:

* `ngrx-forms-valid`
* `ngrx-forms-invalid`
* `ngrx-forms-dirty`
* `ngrx-forms-pristine`
* `ngrx-forms-touched`
* `ngrx-forms-untouched`
* `ngrx-forms-submitted`
* `ngrx-forms-unsubmitted`
* `ngrx-forms-validation-pending`

A constant `NGRX_STATUS_CLASS_NAMES` is exported to allow accessing these class names in user code without needing to hard-code them.

#### Dynamic Form Arrays

Sometimes you will have to render a variable number of fields in your form. Form arrays support adding and removing controls dynamically. This can be done in two ways:

1) explicitly call the [`addArrayControl`](updating-the-state.md#add-array-control) and [`removeArrayControl`](updating-the-state.md#remove-array-control) update functions
2) set the value of the form array via [`setValue`](updating-the-state.md#set-value) which will automatically update the form array based on the value you provide

Below you can find an example of how this would look. Assume that we have an action that provides a variable set of objects which each should be mapped to an array with two form controls.

```typescript
import { Action } from '@ngrx/store';
import { FormArrayState, setValue } from 'ngrx-forms';

interface DynamicObject {
  someNumber: number;
  someCheckbox: boolean;
}

interface DynamicObjectFormValue {
  someNumber: number;
  someCheckbox: boolean;
}

interface SetDynamicObjectsAction extends Action {
  type: 'SET_DYNAMIC_OBJECTS';
  objects: DynamicObject[];
}

interface AppState {
  someOtherState: string;
  someOtherNumber: number;
  dynamicFormArray: FormArrayState<DynamicObjectFormValue>;
}

export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_DYNAMIC_OBJECTS': {
      const newFormValue: DynamicObjectFormValue[] = (action as SetDynamicObjectsAction).objects;

      // the `setValue` will add and remove controls as required; existing controls that are still
      // present get their value updated but are otherwise kept in the same state as before
      const dynamicFormArray = setValue(newFormValue, state.dynamicFormArray);
      return { ...state, dynamicFormArray };
    }

    default:
      return state;
  }
}
```
