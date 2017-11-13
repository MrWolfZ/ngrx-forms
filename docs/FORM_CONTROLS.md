## Form Controls

Form controls in ngrx-forms are represented as plain state objects. Control states have the following shape:

```typescript
export type FormControlValueTypes = string | number | boolean | null | undefined;
export interface KeyValue { [key: string]: any; }
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
  userDefinedProperties: KeyValue;
}

export interface FormControlState<TValue extends FormControlValueTypes> extends AbstractControlState<TValue> {
  isFocused: boolean;
  isUnfocused: boolean;
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
|`isTouched`|`isUntouched`|The `isTouched` flag is set to `true` based on the rules of the underlying `FormViewAdapter` (usually on `blur` for most form elements).|
|`isSubmitted`|`isUnsubmitted`|The `isSubmitted` flag is set to `true` if the containing group is submitted.|
|`isFocused`|`isUnfocused`|The `isFocused` flag is set to `true` if the control currently has focus. Note that this feature is opt-in. To enable it you have to add ```[ngrxEnableFocusTracking]="true"``` to your form element.|
|`userDefinedProperties`||Sometimes it is useful to associate your own metadata with a form control (e.g. if you wanted to count the number of times a control's value has been changed, what keys were pressed on an input, or how often a form has been submitted). While it is possible to store this kind of information outside of `ngrx-forms` in your own state the `userDefinedProperties` allow you to store your own metadata directly in a control's state.|

Control states are associated with a form element via the `NgrxFormControlDirective` (applied with `[ngrxFormControlState]="controlState"`). This directive is reponsible for keeping the view and the state in sync. When the state is changed the update is always immediately sync'ed to the view.

#### `ngrxUpdateOn`

It is possible to control when view values changes are pushed to the state with the `ngrxUpdateOn` attribute. The supported values are `change` (pushed immediately when the view value changes; default) and `blur` (pushed when the form element loses focus). Note that by changing the time value changes are pushed to the state you are also changing the time at which validation and other state updates that depend on the value happen.

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

    this.actionsSubject.next(new SetUserDefinedPropertyAction(this.ngrxFormControlState.id, IS_ENTER_PRESSED_PROPERTY, true));
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.keyCode !== ENTER_KEY_CODE) {
      return;
    }

    this.actionsSubject.next(new SetUserDefinedPropertyAction(this.ngrxFormControlState.id, IS_ENTER_PRESSED_PROPERTY, false));
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

`ngrx-forms` ships with a number of pre-made value converters:

|Converter|Description|
|-|-|
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
<form novalidate [ngrxFormState]="(formState$ | async)">
  <input type="date"
         [ngrxFormControlState]="(formState$ | async).controls.date"
         [ngrxValueConverter]="dateValueConverter">
</form>
```
