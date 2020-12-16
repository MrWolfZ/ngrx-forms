This user guide explains and showcases all of the different features of **ngrx-forms** in detail. Use the navigation menu on the left to browse to the different topics. For newcomers it is recommended to read them in the order they are listed in the navigation menu, starting with the [concepts](concepts.md). Alteratively you can simply follow the steps below to get started right away.

#### Getting Started

Here you can see the minimal code you will need to get started using **ngrx-forms**.

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

If you are using ngrx version 8 or above you can alternatively use `onNgrxForms` with `createReducer`:

```ts
import { createReducer } from '@ngrx/store';
import { onNgrxForms } from 'ngrx-forms';

export const appReducer = createReducer(
  initialState,
  onNgrxForms(),
  // your other reducers...
);
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
<ng-container *ngIf="formState$ | async as formState">
  <form novalidate [ngrxFormState]="formState">
    <input type="text"
           [ngrxFormControlState]="formState.controls.someTextInput">

    <input type="checkbox"
           [ngrxFormControlState]="formState.controls.someCheckbox">

    <input type="number"
           [ngrxFormControlState]="formState.controls.nested.controls.someNumber">
  </form>
</ng-container>
```
