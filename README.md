# ngrx-forms

[![Build Status](https://travis-ci.org/MrWolfZ/ngrx-forms.svg?branch=master)](https://travis-ci.org/MrWolfZ/ngrx-forms)

Proper integration of forms in Angular 4 applications using ngrx.

Disclaimer: This library is not affiliated with the official ngrx library. I have created it mainly for my own use in one of my projects, but I thought others could profit as well.

There is an [example app](https://ngrx-forms-example-app.herokuapp.com/) that showcases most of the functionality of this library.

### Content
[1 Installation](#1)  
[2 Design Principles](#2)  
[3 User Guide](#3)  
[4 Open Points](#4)  
[5 Contributing](#5)  

## <a name="1"></a>1 Installation
```Shell
npm install ngrx-forms --save
```

This library depends on versions `^4.0.0` of `@angular/core`, `@angular/forms`, and `@ngrx/store`, and version `^5.0.0` of `rxjs`.

## <a name="2"></a>2 Design Principles
This library is written to be as functional and as pure as possible. Most of the heavy lifting is done in pure reducer functions with the directives being only a thin layer to connect the form states to the DOM.

This library also tries to be as independent as possible from other libraries/modules. While there is of course a dependency on ngrx the touching points are small and it should be possible to adapt this library to any other redux library without too much effort. There is also a peer dependency on `@angular/forms` from which we re-use the `ControlValueAccessor` concept to allow easier integration with other libraries that provide custom form controls.

Conceptually this library borrows heavily from `@angular/forms`, specifically the concepts of form controls and form groups (see the [User Guide](#3) below for a more detailed description of these concepts).

## <a name="3"></a>3 User Guide

### Getting Started

Import the module:

```typescript
import { StoreModule } from '@ngrx/store';
import { NgrxFormsModule } from 'ngrx-forms';

import { reducers } from './reducer';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    NgrxFormsModule,
    StoreModule.forRoot(reducers),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Add a group state somewhere in your state tree via `createFormGroupState` and call the `formGroupReducer` inside your reducer:

```typescript
import { Action } from '@ngrx/store';
import { FormGroupState, createFormGroupState, formGroupReducer } from 'ngrx-forms';

export interface MyFormValue {
  someTextInput: string;
  someCheckbox: boolean;
  nested: {
    someNumber: number;
  };
}

const FORM_ID = 'some globally unique string';

const initialFormState = createFormGroupState<MyFormValue>(FORM_ID, {
  someTextInput: '',
  someCheckbox: false,
  nested: {
    someNumber: 0,
  },
});

export interface AppState {
  someOtherField: string;
  myForm: FormGroupState<MyFormValue>;
}

const initialState: AppState = {
  someOtherField: '',
  myForm: initialFormState,
};

export function appReducer(state = initialState, action: Action): AppState {
  const myForm = formGroupReducer(state.myForm, action);
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

Expose the form state inside your component:

```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import { Observable } from 'rxjs/Observable';

import { MyFormValue } from './reducer';

@Component({
  selector: 'my-component',
  templateUrl: './my-component.html',
})
export class MyComponent {
  formState$: Observable<FormGroupState<MyFormValue>>;

  constructor(private store: Store<AppState>) {
    this.formState$ = store.select(s => s.myForm);
  }
}
```

Set the control states in your template:
```html
<form novalidate [ngrxFormState]="(formState$ | async)">
  <input type="text"
         [ngrxFormControlState]="(formState$ | async).controls.someTextInput">

  <input type="checkbox"
         [ngrxFormControlState]="(formState$ | async).controls.someCheckbox">

  <input type="number"
         [ngrxFormControlState]="(formState$ | async).controls.nested.controls.someNumber">
</form>
```

### Form Controls

Form controls in ngrx-forms are represented as plain state objects. Control states have the following shape:

```typescript
export type FormControlValueTypes = string | number | boolean | null | undefined;
export interface ValidationErrors { [key: string]: any; }

export interface AbstractControlState<TValue> {
  id: string;
  value: TValue;
  isValid: boolean;
  isInvalid: boolean;
  errors: ValidationErrors;
  isEnabled: boolean;
  isDisabled: boolean;
  isDirty: boolean;
  isPristine: boolean;
  isTouched: boolean;
  isUntouched: boolean;
  isSubmitted: boolean;
  isUnsubmitted: boolean;
}

export interface FormControlState<TValue extends FormControlValueTypes> extends AbstractControlState<TValue> {
  isFocused: boolean;
  isUnfocused: boolean;
  lastKeyDownCode: number;
}
```

The following table explains each property.

|Property|Negated|Description|
|-|-|-|
|`id`||The unique ID of the form control. Usually this is the name of the field in the form value prefixed by the ID of the containing group, e.g. `MY_FORM.someTextInput`.|
|`value`||The value of the form control. Controls only support values of type `string`, `number`, `boolean`, `null`, and `undefined` to keep the state string serializable.|
|`isValid`|`isInvalid`|The `isValid` flag is `true` if the control does not have any errors.|
|`errors`||The errors of the control. This property always has a value. If the control has no errors the property is set to `{}`.|
|`isEnabled`|`isDisabled`|The `isEnabled` flag indicates whether the control is enabled. When `isEnabled` is `false` the `errors` are always `{}` (i.e. the control is always valid if disabled).|
|`isDirty`|`isPristine`|The `isDirty` flag is set to `true` as soon as the value of the control changes for the first time.|
|`isTouched`|`isUntouched`|The `isTouched` flag is set to `true` based on the rules of the underlying `ControlValueAccessor` (usually on `blur` for most form elements).|
|`isSubmitted`|`isUnsubmitted`|The `isSubmitted` flag is set to `true` if the containing group is submitted.|
|`isFocused`|`isUnfocused`|The `isFocused` flag is set to `true` if the control currently has focus. Note that this feature is opt-in. To enable it you have to add ```[ngrxEnableFocusTracking]="true"``` to your form element.|
|`lastKeyDownCode`||The `lastKeyDownCode` is set to the key code of the last key that was pressed on the control. Note that this feature is opt-in. To enable it you have to add ```[ngrxEnableLastKeydownCodeTracking]="true"``` to your form element. This feature can be used for example to react to `Enter` key events. Note that this feature is likely to be changed in the near future.|

Control states are associated with a form element via the `NgrxFormControlDirective` (applied with `[ngrxFormControlState]="controlState"`). This directive is reponsible for keeping the view and the state in sync. When the state is changed the update is always immediately sync'ed to the view.

#### `ngrxUpdateOn`

It is possible to control when view values changes are pushed to the state with the `ngrxUpdateOn` attribute. The supported values are `change` (pushed immediately when the view value changes; default) and `blur` (pushed when the form element loses focus). Note that by changing the time value changes are pushed to the state you are also changing the time at which validation and other state updates that depend on the value happen.

#### Value Conversion

If you need to use a form element that only supports objects as values (e.g. most custom date picker and tag input components) you can provide a value converter via the `ngrxValueConverter` attribute to perform a conversion between view and state values. Value converters are simple objects with two functions:

```typescript
export interface NgrxValueConverter<TView, TState> {
  convertViewToStateValue(value: TView): TState;
  convertStateToViewValue(value: TState): TView;
}
```

ngrx-forms ships with a number of pre-made value converters. Currently these are defined as follows:

```typescript
export const NgrxValueConverters = {
  identity<T>() {
    return {
      convertViewToStateValue: value => value,
      convertStateToViewValue: value => value,
    } as NgrxValueConverter<T, T>;
  },
  dateToISOString: {
    convertViewToStateValue: date => date === null ? null : date.toISOString(),
    convertStateToViewValue: s => s === null ? null : new Date(Date.parse(s)),
  } as NgrxValueConverter<Date | null, string | null>,
  objectToJSON: {
    convertViewToStateValue: value => value === null ? null : JSON.stringify(value),
    convertStateToViewValue: s => s === null ? null : JSON.parse(s),
  } as NgrxValueConverter<{} | null, string | null>,
};
```

Below you can find a full example on how to use a value converter to work with dates as view values:

```typescript
import { Action } from '@ngrx/store';
import { FormGroupState, createFormGroupState, formGroupReducer } from 'ngrx-forms';

export interface MyFormValue {
  date: string;
}

const FORM_ID = 'some globally unique string';

const initialFormState = createFormGroupState<MyFormValue>(FORM_ID, {
  date: new Date(0).toISOString(),
});

export interface AppState {
  myForm: FormGroupState<MyFormValue>;
}

const initialState: AppState = {
  myForm: initialFormState,
};

export function appReducer(state = initialState, action: Action): AppState {
  const myForm = formGroupReducer(state.myForm, action);
  if (myForm !== state.myForm) {
    return { ...state, myForm };
  }

  return state;
}
```

```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroupState, NgrxValueConverters } from 'ngrx-forms';
import { Observable } from 'rxjs/Observable';

import { MyFormValue } from './reducer';

@Component({
  selector: 'my-component',
  templateUrl: './my-component.html',
})
export class MyComponent {
  formState$: Observable<FormGroupState<MyFormValue>>;

  constructor(private store: Store<AppState>) {
    this.formState$ = store.select(s => s.myForm);
  }

  dateValueConverter = NgrxValueConverters.dateToISOString;
}
```

```html
<form novalidate [ngrxFormState]="(formState$ | async)">
  <input type="date"
         [ngrxFormControlState]="(formState$ | async).controls.date"
         [ngrxValueConverter]="dateValueConverter">
</form>
```

### Form Groups

Groups are collections of controls. Just like controls groups are represented as plain state objects. The state of a group is determined almost fully by its child controls (with the exception of `errors` which a group can have by itself). Group states have the following shape:

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
|`isValid`|`isInvalid`|The `isValid` flag is `true` if the group does not have any errors itself and none of its children have any errors.|
|`errors`||The errors of the group. This property is computed by merging the errors of the control with the errors of all children where the child errors are a property of the `errors` object prefixed with an underscore (e.g. `{ groupError: true, _child: { childError: true } }`). If neither the group nor any children have errors the property is set to `{}`.|
|`isEnabled`|`isDisabled`|The `isEnabled` flag is `true` if and only if at least one child control is enabled.|
|`isDirty`|`isPristine`|The `isDirty` flag is `true` if and only if at least one child control is marked as dirty.|
|`isTouched`|`isUntouched`|The `isTouched` flag is `true` if and only if at least one child control is marked as touched.|
|`isSubmitted`|`isUnsubmitted`|The `isSubmitted` flag is set to `true` if the group is submitted. This is tracked by the `NgrxFormDirective` (which needs to be applied to a form via `[ngrxFormState]="groupState"`). Note that applying this directive to a form prevents normal form submission since that does not make much sense for ngrx forms.|
|`controls`||This property contains all child controls of the group. As you may have noticed the type of each child control is `AbstractControlState` which sometimes forces you to cast the state explicitly. It is not possible to improve this typing until [conditional mapped types](https://github.com/Microsoft/TypeScript/issues/12424) are added to TypeScript.|

Group states are usually completely independent of the DOM (with the exception of root groups that are associated with a `form` via `NgrxFormDirective`). They are updated by intercepting all actions that change their children (i.e. the group's reducer is the parent reducer of all its child reducers and forwards any actions to all children; if any children change it recomputes the state of the group). A group state can be created via `createFormGroupState`. This function takes an initial value and automatically creates all child controls recursively.

#### Dynamic Form Groups

Sometimes you will have to render a variable number of fields in your form. In such a case you can provide a form value interface that has an index signature and then add and remove controls dynamically. Instead of an index signature you can also use optional fields if the potential members of the form value are statically known. At runtime you can add and remove controls in two ways:

1) explicitly call the `addControl` and `removeControl` update functions (see the section below)
2) set the value of the form group via `setValue` which will automatically update the form group based on the value you provide

Below you can find an example of how this would look. Assume that we have an action that provides a variable set of objects which each should be mapped to a group with two form controls.

```typescript
import { Action } from '@ngrx/store';
import { FormGroupState, setValue, cast } from 'ngrx-forms';

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
      const dynamicForm = cast(setValue(newFormValue, state.dynamicForm));
      return { ...state, dynamicForm };
    }

    default:
      return state;
  }
}
```

### Updating the State

All states are internally updated by ngrx-forms through dispatching actions. While this is of course also possible for you there exist a set of utility functions that can be used to update states. This is mainly useful to change the state as a result of a different action in your reducer. Note that ngrx-forms is coded in such a way that no state references will change if nothing inside the state changes. It is therefore perfectly safe to repeatedly call any of the functions below and the state will be updated exactly once or not at all if nothing changed. Each function can be imported from `ngrx-forms`. The following table explains each function:

|Function|Description|
|-|-|
|`setValue`|This curried function takes a value and returns a function that takes a state and updates the value of the state. Note that setting the value of the group will also update all children including adding and removing children on the fly for added/removed properties. Has an uncurried overload that takes a state directly as the second parameter.|
|`validate`|This curried function takes a validation function as a parameter and returns a function that takes a state and updates the errors of the state with the result of the provided validation function applied to the state's value. Has an uncurried overload that takes a state directly as the second parameter.|
|`enable`|This function takes a state and enables it. For groups this also recursively enables all children.|
|`disable`|This function takes a state and disables it. For groups this also recursively disables all children.|
|`markAsDirty`|This function takes a state and marks it as dirty. For groups this also recursively marks all children as dirty.|
|`markAsPristine`|This function takes a state and marks it as pristine. For groups this also recursively marks all children as pristine.|
|`markAsTouched`|This function takes a state and marks it as touched. For groups this also recursively marks all children as touched.|
|`markAsUntouched`|This function takes a state and marks it as untouched. For groups this also recursively marks all children as untouched.|
|`markAsSubmitted`|This function takes a state and marks it as submitted. For groups this also recursively marks all children as submitted.|
|`markAsUnsubmitted`|This function takes a state and marks it as unsubmitted. For groups this also recursively marks all children as unsubmitted.|
|`focus`|This function takes a control state and makes it focused (which will also `.focus()` the form element).|
|`unfocus`|This function takes a control state and makes it unfocused (which will also `.blur()` the form element).|
|`setLastKeyDownCode`|This function takes a control state and sets the last keydown code.|
|`addControl`|This curried function takes a name and a value and returns a function that takes a group state and adds a child control with the given name and value to the state.|
|`removeControl`|This curried function takes a name and returns a function that takes a group state and removes a child control with the given name from the state.|

These are very basic functions that perform simple updates on states. The last two functions below contain the real magic that allows easily updating deeply nested form states.

`updateGroup`:  
This curried function takes a partial object in the shape of the group's value where each key contains an update function for that child and returns a function that takes a group state, applies all the provided update functions recursively and recomputes the state of the group afterwards. As with all the functions above this function does not change the reference of the group if none of the child update functions change any children. The best example of how this can be used is simple validation:

```typescript
import { updateGroup, validate } from 'ngrx-forms';

export interface NestedValue {
  someNumber: number;
}

export interface MyFormValue {
  someTextInput: string;
  someCheckbox: boolean;
  nested: NestedValue;
}

function required(value: any) {
  return !!value ? {} : { required: true };
}

const updateMyFormGroup = updateGroup<MyFormValue>({
  someTextInput: validate(required),
  nested: updateGroup({
    someNumber: validate(required),
  }),
});
```

The `updateMyFormGroup` function has a signature of `FormGroupState<MyFormValue> -> FormGroupState<MyFormValue>`. It takes a state, runs all validations, updates the errors, and returns the resulting state.

In addition, the `updateGroup` function allows specifying as many update function objects as you want and applies all of them after another. This is useful if you have dependencies between your update functions where one function's result may affect the result of another function. The following (contrived) example shows how to set the value of `someNumber` based on the `errors` of `someTextInput`.

```typescript
const updateMyFormGroup = updateGroup<MyFormValue>({
  someTextInput: validate(required),
  nested: updateGroup({
    someNumber: validate(required),
  }),
}, {
  // note that the parent form state is provided as the second argument to update functions;
  // type annotations added for clarity but are inferred correctly otherwise
  nested: (nested: AbstractControlState<NestedValue>, myForm: FormGroupState<MyFormValue>) =>
    updateGroup<NestedValue>({
      someNumber: (someNumber: AbstractControlState<number>) => {
        if (myForm.controls.someTextInput.errors.required) {
          // sets the control's value to 1 and clears all errors
          return validate(() => ({}), setValue(1, someNumber));
        }

        return someNumber;
      };
    })(cast(nested))
    // the `cast` (utility function exported by `ngrx-forms`) helps the type checker to recognize the
    // `nested` state as a group state
});
```

`groupUpdateReducer`:  
This curried function combines a `formGroupReducer` and the `updateGroup` function by taking update objects of the same shape as `updateGroup` and returns a reducer which first calls the `formGroupReducer` and afterwards applies all update functions by calling `updateGroup`. Combining all we have seen so far our final reducer would therefore look something like this:

```typescript
const myFormReducer = groupUpdateReducer<MyFormValue>({
  someTextInput: validate(required),
  nested: updateGroup({
    someNumber: validate(required),
  }),
}, {
  nested: (nested, myForm) =>
    updateGroup<NestedValue>({
      someNumber: someNumber => {
        if (myForm.controls.someTextInput.errors.required) {
          return validate(() => ({}), setValue(1, someNumber));
        }

        return someNumber;
      }
    })(cast(nested))
});

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

If you need to update the form state based on data not contained in the form state itself you can simply parameterize the form update function. In the following example we validate that `someNumber` is greater than some other number from the state.

```typescript
const createMyFormUpdateFunction = (otherNumber: number) => updateGroup<MyFormValue>({
  nested: updateGroup({
    otherNumber: validate(v => v > otherNumber ? {} : { tooSmall: otherNumber }),
  }),
});

export function appReducer(state = initialState, action: Action): AppState {
  let myForm = formGroupeReducer(state.myForm, action);
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

### Custom Controls

As mentioned above ngrx-forms re-uses the `ControlValueAccessor` concept of `@angular/forms`. ngrx-forms ships its own variants of all default value accessors (most of which simply inherit the implementation from `@angular/forms`. Most libraries providing custom value accessors should also work with ngrx-forms out of the box as long as they properly export the value accessor. However, in case a library does not do this you may have to write your own value accessor. See the example app for such a custom value accessor (in this case for the `md-select` from `@angular/material` which in version `2.0.0-beta.8` does not properly export the `md-select`'s value accessor).

## <a name="4"></a>4 Open Points

* providing a simple set of common validation functions (e.g. required, min, max, pattern, etc.) and error composition
* async validation (although already achievable via effects)
* providing some global configuration options (e.g. enabling focus tracking globally)
* add `isFocused` to groups to track whether any child is focused
* some more tests for directives
* tests for example application

## <a name="5"></a>5 Contributing

### Testing
The following command runs all unit tests:
```Shell
npm test
```

### Building and Packaging
The following command:
```Shell
npm run build
```
- starts _TSLint_ with _Codelyzer_
- starts _AoT compilation_ using _ngc_ compiler
- creates `dist` folder with all the files of distribution

To test the npm package locally run:
```Shell
npm run pack-lib
```
and install it in an app to test it with:
```Shell
npm install [path]ngrx-forms-[version].tgz
```

<!--
### Documentation
To generate the documentation, this library uses [compodoc](https://github.com/compodoc/compodoc):
```Shell
npm run compodoc
npm run compodoc-serve
```
-->

## License
MIT

Copyright &copy; 2017 Jonathan Ziller
