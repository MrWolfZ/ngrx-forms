The core kind of form state. Each form control represents a single value in your form. Usually form controls are directly associated with an HTML form element, e.g. `input`, `select`, etc. The simplest possible form consists of exactly one form control.

In TypeScript they are represented by the following interface.

```typescript
export interface FormControlState<TValue> {
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
  isFocused: boolean;
  isUnfocused: boolean;
  userDefinedProperties: { [key: string]: any; };
}
```

The following table explains each property.

|Property|Negated|Description|
|-|-|-|
|`id`||The unique ID of the form control. Usually this is the name of the field in the form value prefixed by the ID of the containing group or array, e.g. `MY_FORM.someTextInput`.|
|`value`||The value of the form control. Controls directly support values of type `string`, `number`, `boolean`, `null`, and `undefined`. For object and array values you have to use [value boxing](value-boxing.md).|
|`isValid`|`isInvalid`|The `isValid` property is `true` if the control does not have any errors.|
|`errors`||The errors of the control. This property always has a value. If the control has no errors the property is set to `{}`.|
|`pendingValidations`||The names of all asynchronous validations currently running for the control.|
|`isValidationPending`||The `isValidationPending` property indicates whether the control is currently being asynchronously validated (i.e. this is `true` if and only if `pendingValidations` is not empty).|
|`isEnabled`|`isDisabled`|The `isEnabled` property indicates whether the control is enabled. When `isEnabled` is `false` the `errors` are always `{}` (i.e. the control is always valid if disabled) and `pendingValidations` is always `[]` (i.e. all pending validations are cancelled).|
|`isDirty`|`isPristine`|The `isDirty` property is set to `true` as soon as the the underlying [`FormViewAdapter`](custom-form-elements.md) or `ControlValueAccessor` reports a new value for the first time.|
|`isTouched`|`isUntouched`|The `isTouched` property is set to `true` based on the rules of the underlying [`FormViewAdapter`](custom-form-elements.md) or `ControlValueAccessor` (usually on `blur` for most form elements).|
|`isSubmitted`|`isUnsubmitted`|The `isSubmitted` property is set to `true` if the containing group or array is submitted.|
|`isFocused`|`isUnfocused`|The `isFocused` property is set to `true` if the control currently has focus. Note that this feature is opt-in. To enable it you have to add ```[ngrxEnableFocusTracking]="true"``` to your form element.|
|`userDefinedProperties`||Sometimes it is useful to associate your own metadata with a form control (e.g. if you wanted to count the number of times a control's value has been changed, what keys were pressed on an input, or how often a form has been submitted). While it is possible to store this kind of information outside of **ngrx-forms** in your own state the `userDefinedProperties` allow you to store your own metadata directly in a control's state.|

#### Connecting to the DOM

Control states are associated with a form element via the `NgrxFormControlDirective` (applied with `[ngrxFormControlState]="controlState"`). This directive is reponsible for keeping the view and the state in sync. When the state is changed the update is always immediately sync'ed to the view. Additionally the `id` of the HTML element is set to the ID of the form control (except for `input[type=radio]` since there would be multiple elements with the same `id`, therefore for these elements the `name` property is set to the `id` of the form state).

#### Status CSS Classes

**ngrx-forms** adds CSS classes to form control elements depending on the state of the control. The available classes are:

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

#### Choosing when to sync the view to the state

It is possible to control when view values changes are pushed to the state with the `ngrxUpdateOn` attribute. The supported values are `change` (pushed immediately when the view value changes; default), `blur` (pushed when the form element loses focus), and `never` (the value is never pushed to the state; this is an advanced feature that is useful if you want full control over when and how the state is updated but it also requires greater understanding of how **ngrx-forms** performs state updates). Note that by changing this value to something different than `change` (and thereby changing the time at which value changes are pushed to the state) you are also changing the time at which validation and other state updates that depend on the value happen. If you change this value to never you will need to perform all state updates yourself (e.g. setting the value, marking as dirty etc.).

#### User Defined Properties

As mentioned in the section about properties of form controls it is possible to store additional metadata on a control. The following is an example of a directive that is applied to all text inputs and tracks whether the `ENTER` key is currently being pressed on the input. This data can then be used for example in an effect to trigger a validation or server call (e.g. for an autocomplete) if the user presses enter by reacting to the custom property changing from `false` to `true`.

```typescript
import { Directive, HostListener, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { FormControlState, SetUserDefinedPropertyAction } from 'ngrx-forms';

export const IS_ENTER_PRESSED_PROPERTY = 'isEnterPressed';
export const ENTER_KEY_CODE = 13;

@Directive({
  selector: 'input[type=text][ngrxFormControlState]',
})
export class TrackIsEnterPressedDirective {
  @Input() ngrxFormControlState: FormControlState<string>;

  constructor(private actionsSubject: ActionsSubject) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode !== ENTER_KEY_CODE) {
      return;
    }

    this.actionsSubject.next(new SetUserDefinedPropertyAction(
      this.ngrxFormControlState.id,
      IS_ENTER_PRESSED_PROPERTY,
      true,
    ));
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.keyCode !== ENTER_KEY_CODE) {
      return;
    }

    this.actionsSubject.next(new SetUserDefinedPropertyAction(
      this.ngrxFormControlState.id,
      IS_ENTER_PRESSED_PROPERTY,
      false,
    ));
  }
}
```

#### Value Conversion

If you need to use a form element that only supports objects as values (e.g. most custom date picker and tag input components) you can provide a value converter via the `ngrxValueConverter` attribute to perform a conversion between view and state values. Value converters are simple objects with two functions:

```typescript
export interface NgrxValueConverter<TView, TState> {
  convertViewToStateValue(value: TView): TState;
  convertStateToViewValue(value: TState): TView;
}
```

**ngrx-forms** ships with a number of pre-made value converters:

|Converter|Description|
|-|-|
|`default`|This is the default value converter. It automatically boxes and unboxes values as required (see [value boxing](value-boxing.md) for more details).|
|`dateToISOString`|Converts `Date` values to ISO date strings (and vice versa)|
|`objectToJSON`|Converts any object to a JSON string via `JSON.stringify` (and vice versa via `JSON.parse`)|

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
<ng-container *ngIf="formState$ | async as formState">
  <form novalidate [ngrxFormState]="formState">
    <custom-date-picker [ngrxFormControlState]="formState.controls.date"
                        [ngrxValueConverter]="dateValueConverter"></custom-date-picker>
  </form>
</ng-container>
```
