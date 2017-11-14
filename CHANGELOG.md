## Ngrx Forms Changelog

<a name="2.0.0"></a>
### 2.0.0

#### Breaking Changes

* remove support for last keydown code tracking on form controls (this feature has been superseded by user defined properties which allow associating any kind of metadata with a control)
* rename `groupUpdateReducer` to `createFormGroupReducerWithUpdate` in order to make it clearer that the function itself is not a reducer
* remove erroneously exposed function `createChildState` from public API
* change `option` element `value` bindings to work correctly for all primitive data types thereby removing the need for `ngValue` bindings
* trying to set an error with a key prefixed with `$` will now throw an error since the `$` prefix is used to mark async errors
* applying the `ngrxFormControlState` directive to a form element will now set the element's `id` attribute to the ID of the state (thereby overriding any already present `id`)

#### Features

* add support for arrays of form controls ([19d4e49](https://github.com/MrWolfZ/ngrx-forms/commit/19d4e49))
* add value converter for object to JSON conversion ([2ba37ee](https://github.com/MrWolfZ/ngrx-forms/commit/2ba37ee)) (thanks @tbroadley)
* add support for error composition by extending `validate` update function to take a single validation function or an array of validation functions ([ba976c5](https://github.com/MrWolfZ/ngrx-forms/commit/ba976c5))
* add `setErrors` update function ([ee25ca8](https://github.com/MrWolfZ/ngrx-forms/commit/ee25ca8))
* add `reset` update function ([d380e67](https://github.com/MrWolfZ/ngrx-forms/commit/d380e67))
* add `updateRecursive` update function (see the [documentation](docs/UPDATING_THE_STATE.md#updaterecursive) for a usage example) ([31f9d5d](https://github.com/MrWolfZ/ngrx-forms/commit/31f9d5d))
* add common set of validation functions ([40308d4](https://github.com/MrWolfZ/ngrx-forms/commit/40308d4))
* add support for user defined properties on form controls and groups ([d9778d2](https://github.com/MrWolfZ/ngrx-forms/commit/d9778d2))
* introduce concept of `FormViewAdapter` and rewrite all control value accessors from scratch as view adapters (see the [documentation](docs/CUSTOM_CONTROLS.md) for more details)
* add support for asynchronous validation (see the [documentation](docs/VALIDATION.md#asynchronous-validation) for more details) ([f208e61](https://github.com/MrWolfZ/ngrx-forms/commit/f208e61))

#### Bugfixes

* fix issue that caused bundled library to be larger than required due to external dependencies being included in the bundle (reducing the size by factor 10)

<a name="1.1.1"></a>
### 1.1.1

#### Bugfixes

* change `updateGroups` function to properly accept multiple update function objects as written in the documentation

<a name="1.1.0"></a>
### 1.1.0

#### Features

* add support for controlling when the view value is pushed to the state via `ngrxUpdateOn`
* add support for value conversion via `ngrxValueConverter`

<a name="1.0.2"></a>
### 1.0.2

#### Bugfixes

* add support for `ngValue` on `option` elements, thereby fixing non-string option values not working for `select` elements (thanks @nathanmarks for finding this issue)
* fix issue that prevents setting a value via state change if the same value was previously set via the view (thanks @nathanmarks for finding this issue)

<a name="1.0.1"></a>
### 1.0.1

#### Bugfixes

* fix issue that caused control state value to not be properly set to form element if the ID of the control state changed but the state's value was the same as the last value the view reported for the previous state
* changed form control state directive to run its initialization code inside the `ngAfterViewInit` hook instead of `ngOnInit` to allow proper interaction with form elements that can have dynamically rendered children they depend on (e.g. dynamic `option`s for `select`s) (thanks @nathanmarks for finding this issue)

<a name="1.0.0"></a>
### 1.0.0
* Initial version of the library
