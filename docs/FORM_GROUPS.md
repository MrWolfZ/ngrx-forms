## Form Groups

Form groups are collections of named controls. Just like controls groups are represented as plain state objects. The state of a group is determined almost fully by its child states. Form group states have the following shape:

```typescript
export interface KeyValue { [key: string]: any; }
export type FormGroupControls<TValue> = {[controlId in keyof TValue]: AbstractControlState<TValue[controlId]> };
export interface FormGroupState<TValue extends KeyValue> extends AbstractControlState<TValue> {
  controls: FormGroupControls<TValue>;
}
```

As you can see most properties are shared with controls via the common base interface `AbstractControlState`. The following table explains each property in the context of a group.

|Property|Negated|Description|
|-|-|-|
|`id`||The unique ID of the group.|
|`value`||The aggregated value of the group. The value is computed by aggregating the values of all children.|
|`isValid`|`isInvalid`|The `isValid` property is `true` if the group does not have any errors itself and none of its children have any errors.|
|`errors`||The errors of the group. This property is computed by merging the errors of the group with the errors of all its children where the child errors are a property of the `errors` object prefixed with an underscore (e.g. `{ groupError: true, _child: { childError: true } }`). If neither the group nor any children have errors the property is set to `{}`.|
|`pendingValidations`||The names of all asynchronous validations currently running for the group.|
|`isValidationPending`||The `isValidationPending` property indicates whether the group or any of its children are currently being asynchronously validated.|
|`isEnabled`|`isDisabled`|The `isEnabled` property is `true` if and only if at least one child state is enabled.|
|`isDirty`|`isPristine`|The `isDirty` property is `true` if and only if at least one child state is marked as dirty.|
|`isTouched`|`isUntouched`|The `isTouched` property is `true` if and only if at least one child state is marked as touched.|
|`isSubmitted`|`isUnsubmitted`|The `isSubmitted` property is set to `true` if the group is submitted. This is tracked by the `NgrxFormDirective` (which needs to be applied to a form via `[ngrxFormState]="groupState"`). Note that applying this directive to a form prevents normal form submission since that does not make much sense for ngrx forms.|
|`controls`||This property contains all child states of the group. As you may have noticed the type of each child state is `AbstractControlState` which sometimes forces you to cast the state explicitly. It is not possible to improve this typing until [conditional mapped types](https://github.com/Microsoft/TypeScript/issues/12424) are added to TypeScript.|
|`userDefinedProperties`||`userDefinedProperties` work the same for groups as they do for controls.|

Group states are usually completely independent of the DOM (with the exception of root groups that are associated with a `form` via `NgrxFormDirective`). They are updated by intercepting all actions that change their children (i.e. the group's reducer is the parent reducer of all its child reducers and forwards any actions to all children; if any children change it recomputes the state of the group). A group state can be created via `createFormGroupState`. This function takes an initial value and automatically creates all child states recursively.

#### Status CSS Classes

ngrx-forms adds CSS classes to `form` elements depending on the state of the form. The available classes are:

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

1) explicitly call the `addGroupControl` and `removeGroupControl` update functions (see the section section on [updating the state](UPDATING_THE_STATE.md) for more details on these functions)
2) set the value of the form group via `setValue` which will automatically update the form group based on the value you provide

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
