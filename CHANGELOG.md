## ngrx-forms Changelog

<a name="2.1.3"></a>
### 2.1.3

#### Bugfixes

* fix missing union case in typing of `updateArray` update function that causes a compile error if used inside an `updateGroup` ([fa7dccc](https://github.com/MrWolfZ/ngrx-forms/commit/fa7dccc))
* fix `updateGroup` throwing an error if an empty update object was provided in curried as well as uncurried version

<a name="2.1.2"></a>
### 2.1.2

#### Bugfixes

* fix issue that caused `select` elements to get assigned wrong initial value ([d62ec81](https://github.com/MrWolfZ/ngrx-forms/commit/d62ec81)), closes [#32](https://github.com/MrWolfZ/ngrx-forms/issues/32)

<a name="2.1.1"></a>
### 2.1.1

#### Bugfixes

* fix `select` controls not properly selecting `option` if `option` is added to the DOM after the value of the state was set to the value of the option ([0c2c0cc](https://github.com/MrWolfZ/ngrx-forms/commit/0c2c0cc)), closes [#23](https://github.com/MrWolfZ/ngrx-forms/issues/23)

<a name="2.1.0"></a>
### 2.1.0

#### Features

* improve performance by ignoring irrelevant actions in reducers

#### Bugfixes

* fix issue that causes user defined properties not being properly set for form controls in groups or arrays when setting them by dispatching actions ([ba0c34f](https://github.com/MrWolfZ/ngrx-forms/commit/ba0c34f)), closes [#24](https://github.com/MrWolfZ/ngrx-forms/issues/24)

<a name="2.0.1"></a>
### 2.0.1

#### Bugfixes

* properly handle case where the `addArrayControl` update function is called with only a value but neither an index nor a state

<a name="2.0.0"></a>
### 2.0.0

#### Features

* add support for arrays of form controls ([19d4e49](https://github.com/MrWolfZ/ngrx-forms/commit/19d4e49))
* add support for asynchronous validation (see the [documentation](docs/VALIDATION.md#asynchronous-validation) for more details) ([f208e61](https://github.com/MrWolfZ/ngrx-forms/commit/f208e61))
* add value converter for object to JSON conversion ([2ba37ee](https://github.com/MrWolfZ/ngrx-forms/commit/2ba37ee)) (thanks @tbroadley)
* add support for error composition by extending `validate` update function to take a single validation function or an array of validation functions ([ba976c5](https://github.com/MrWolfZ/ngrx-forms/commit/ba976c5))
* add `setErrors` update function ([ee25ca8](https://github.com/MrWolfZ/ngrx-forms/commit/ee25ca8))
* add `reset` update function ([d380e67](https://github.com/MrWolfZ/ngrx-forms/commit/d380e67))
* add `updateRecursive` update function (see the [documentation](docs/UPDATING_THE_STATE.md#updaterecursive) for a usage example) ([31f9d5d](https://github.com/MrWolfZ/ngrx-forms/commit/31f9d5d))
* add common set of validation functions ([40308d4](https://github.com/MrWolfZ/ngrx-forms/commit/40308d4))
* add support for user defined properties on form controls and groups ([d9778d2](https://github.com/MrWolfZ/ngrx-forms/commit/d9778d2))
* introduce concept of `FormViewAdapter` and rewrite all control value accessors from scratch as view adapters (see the [documentation](docs/CUSTOM_CONTROLS.md) for more details)
* extend [example application](https://ngrx-forms-example-app-v2.herokuapp.com/) to contain multiple examples
* added overloads for many update functions that make casting the state unnecessary in certain situations
* added lots of inline comments to the API making it easier to understand what certain functions do right in your IDE

#### Breaking Changes

* remove support for last keydown code tracking on form controls (this feature has been superseded by user defined properties which allow associating any kind of metadata with a control)
* rename `groupUpdateReducer` to `createFormGroupReducerWithUpdate` in order to make it clearer that the function itself is not a reducer
* remove erroneously exposed function `createChildState` from public API
* change `option` element `value` bindings to work correctly for all primitive data types thereby removing the need for `ngValue` bindings
* trying to set an error with a key prefixed with `$` will now throw an error since the `$` prefix is used to mark async errors
* applying the `ngrxFormControlState` directive to a form element will now set the element's `id` attribute to the ID of the state (thereby overriding any already present `id`)
* the `isDirty` property for form controls is now not set automatically the first time the state's value changes, but instead it is set manually from the `NgrxFormControlDirective` the first time the underlying `FormViewAdapter` or `ControlValueAccessor` reports a new value; this means if you were e.g. using the `setValue` update function in your reducer before this will now not mark the state as `dirty` anymore
* rename `addControl` update function to `addGroupControl`
* rename `AddControlAction` to `AddGroupControlAction` (also renaming its `type` from `ngrx/forms/ADD_CONTROL` to `ngrx/forms/ADD_GROUP_CONTROL`)
* rename `removeControl` update function to `removeGroupControl`
* rename `RemoveControlAction` to `RemoveGroupControlAction` (also renaming its `type` from `ngrx/forms/REMOVE_CONTROL` to `ngrx/forms/REMOVE_GROUP_CONTROL`)

#### Bugfixes

* fix issue that caused bundled library to be larger than required due to external dependencies being included in the bundle (drastically reducing its size)

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
