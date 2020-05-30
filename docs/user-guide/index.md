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

If you are using ngrx version 8 or above you can alternatively use `onNgrxForms` with `createReducer` for top level store slices:

```ts
import { createReducer } from '@ngrx/store';
import { onNgrxForms } from 'ngrx-forms';

export const appReducer = createReducer(
  initialState,
  onNgrxForms(),
  // your other reducers...
);
```

If you would like to nest forms below the top level of the store use `onNgrxForm` with `createReducer` instead on your specific reducer:

```ts
import { createReducer } from '@ngrx/store';
import { onNgrxForm } from 'ngrx-forms';

export interface AppState {
  featureX: FeatureX;
  featureY: {
    someOtherNestedSlice: SomeOtherNestedSlice,
    myForm: FormGroupState<MyFormValue>;
  }
}

export const myFormReducer = createReducer(
  initialFeatureState,
  onNgrxForm(),
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
<form novalidate [ngrxFormState]="(formState$ | async)">
  <input type="text"
         [ngrxFormControlState]="(formState$ | async).controls.someTextInput">

  <input type="checkbox"
         [ngrxFormControlState]="(formState$ | async).controls.someCheckbox">

  <input type="number"
         [ngrxFormControlState]="(formState$ | async).controls.nested.controls.someNumber">
</form>
```
