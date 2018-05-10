Groups are a logical grouping of multiple named form states. These states can be of any kind, not only controls, and can therefore be nested arbitrarily. Many parts of a group are calculated based on the properties of its child states. Most of your forms will be groups.

In TypeScript they are represented by the following interface.

```typescript
export interface FormGroupState<TValue> {
  id: string;
  value: TValue;
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
  controls: { 
    [controlId in keyof TValue]: FormState<TValue[controlId]>;
  };
}
```

The `TValue` type parameter describes the shape of the form and is used for [inferring the type](type-inference.md) of child states.

The following table explains each property of a group.

|Property|Negated|Description|
|-|-|-|
|`id`||The unique ID of the group.|
|`value`||The aggregated value of the group. The value is computed by aggregating the values of all children.|
|`isValid`|`isInvalid`|The `isValid` property is `true` if the group does not have any errors itself and none of its children have any errors.|
|`errors`||The errors of the group. This property is computed by merging the errors of the group with the errors of all its children where the child errors are a property of the `errors` object prefixed with an underscore (e.g. `{ groupError: true, _child: { childError: true } }`). If neither the group nor any children have errors the property is set to `{}`.|
|`pendingValidations`||The names of all asynchronous validations currently running for the group.|
|`isValidationPending`||The `isValidationPending` property indicates whether the group or any of its children are currently being asynchronously validated.|
|`isEnabled`|`isDisabled`|The `isEnabled` property is `true` if at least one child state is enabled or the state itself is directly enabled.|
|`isDirty`|`isPristine`|The `isDirty` property is `true` if at least one child state is marked as dirty or the state itself is directly marked as dirty.|
|`isTouched`|`isUntouched`|The `isTouched` property is `true` if at least one child state is marked as touched or the state itself is directly marked as touched.|
|`isSubmitted`|`isUnsubmitted`|The `isSubmitted` property is set to `true` if the group is submitted.|
|`userDefinedProperties`||Sometimes it is useful to associate your own metadata with a form group (e.g. if you wanted to aggregate some additional state like the number of dirty child states). While it is possible to store this kind of information outside of **ngrx-forms** in your own state the `userDefinedProperties` allow you to store your own metadata directly in a group's state.|
|`controls`||This property contains all child states of the group.|

Group states are mostly updated by intercepting all actions that change their children (i.e. the group's reducer is the parent reducer of all its child reducers and forwards any actions to all children; if any children change it recomputes the state of the group). A group state can be created via `createFormGroupState`, which takes an initial value and automatically creates all child states recursively. Below is an example of creating a simple form group.

```typescript
export interface FormValue {
  firstName: string;
  lastName: string;
  email: string;
}

export const FORM_ID = 'exampleForm';

export const INITIAL_STATE = createFormGroupState<FormValue>(FORM_ID, {
  firstName: '',
  lastName: '',
  email: '',
});
```

#### Connecting to the DOM

Only the root group or [array](form-arrays.md) of your form state needs to be connected to the DOM. This is done by the `NgrxFormDirective` (which needs to be applied to a form via `[ngrxFormState]="formState"`). Note that applying this directive to a `form` element prevents normal form submission since that does not make much sense for ngrx forms.

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

#### Dynamic Form Groups

Sometimes you will have to render a variable number of fields in your form. In such a case you can provide a form value interface that has an index signature and then add and remove controls dynamically. Instead of an index signature you can also use optional fields if the potential members of the form value are statically known. At runtime you can add and remove controls in two ways:

1) explicitly call the [`addGroupControl`](updating-the-state.md#add-group-control) and [`removeGroupControl`](updating-the-state.md#remove-group-control) update functions
2) set the value of the form group via [`setValue`](updating-the-state.md#set-value) which will automatically update the form group based on the value you provide

Below you can find an example of how this would look. Assume that we have an action that provides a variable set of objects which each should be mapped to a group with two form controls.

```typescript
import { Action } from '@ngrx/store';
import { FormGroupState, setValue } from 'ngrx-forms';

interface DynamicObject {
  id: string;
  someNumber: number;
  someCheckbox: boolean;
}

interface DynamicObjectFormValue {
  someNumber: number;
  someCheckbox: boolean;
}

interface DynamicFormValue {
  [id: string]: DynamicObjectFormValue;
}

interface SetDynamicObjectsAction extends Action {
  type: 'SET_DYNAMIC_OBJECTS';
  objects: DynamicObject[];
}

interface AppState {
  someOtherState: string;
  someOtherNumber: number;
  dynamicForm: FormGroupState<DynamicFormValue>;
}

export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_DYNAMIC_OBJECTS': {
      const newFormValue = (action as SetDynamicObjectsAction).objects.reduce((v, obj) => {
        v[obj.id] = {
          someNumber: obj.someNumber,
          someCheckbox: obj.someCheckbox,
        };
        return v;
      }, {} as DynamicFormValue);

      // the `setValue` will add and remove controls as required; existing controls that are still
      // present get their value updated but are otherwise kept in the same state as before
      const dynamicForm = setValue(newFormValue, state.dynamicForm);
      return { ...state, dynamicForm };
    }

    default:
      return state;
  }
}
```
