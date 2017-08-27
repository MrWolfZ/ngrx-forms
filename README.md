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
This library is written to be as functional and as pure as possible. Most of the heavy lifting is done in pure reducer functions while the directives are only a thin layer to connect the form states to the DOM.

This library also tries to be as independent as possible from other libraries/modules. While there is of course a dependency on ngrx the touching points are small and it should be possible to adapt this library to any other redux library without too much effort. There is also a peer dependency on `@angular/forms` from which we re-use the `ControlValueAccessor` concept to allow easier integration with other libraries that provide custom form controls.

Conceptually this library borrows heavily from `@angular/forms`, specifically the concepts of form controls and form groups. Groups are simply a collection of named form controls. The state of a group is determined almost fully by its child controls (with the exception of errors which a group can have by itself).

## <a name="3"></a>3 User Guide

### Getting Started

Import the module:

```typescript
import { NgrxFormsModule } from 'ngrx-forms';

@NgModule({
  declarations: [
    AppComponent,
    ...,
  ],
  imports: [
    ...,
    NgrxFormsModule,
    StoreModule.forRoot(reducers),
    ...,
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

- explain whole state concept
- mention that state is sync'ed immediately

### Form Groups

- explain exactly how each property of a group is computed
- form directive for submission status tracking (mention preventDefault())

### Updating the State

- explain all helper functions

### Custom Controls

- control value accessors

## <a name="4"></a>4 Open Points

* providing option to choose when the view is sync'ed to the state (e.g. `change`, `blur` etc.)
* proper value conversion
* async validation (although already achievable via effects)
* providing some global configuration options
* some tests for directives
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
