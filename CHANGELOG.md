## ngrx-forms Changelog

<a name="3.0.0"></a>
### 3.0.0

This release requires TypeScript >=2.8.0 for the conditional type support.

#### Breaking Changes

* remove `cast` utility function since it is obsolete due to proper control type inference
* change order of parameters for many update functions to more be consistent
  * `addArrayControl`: move `state` parameter to first position for uncurried overload ([ab094b8](https://github.com/MrWolfZ/ngrx-forms/commit/ab094b8))
  * `removeArrayControl`: move `state` parameter to first position for uncurried overload ([5a5aa17](https://github.com/MrWolfZ/ngrx-forms/commit/5a5aa17))
  * `addGroupControl`: move `state` parameter to first position for uncurried overload ([b6da5ee](https://github.com/MrWolfZ/ngrx-forms/commit/b6da5ee))
  * `removeGroupControl`: move `state` parameter to first position for uncurried overload ([a9035ce](https://github.com/MrWolfZ/ngrx-forms/commit/a9035ce))
  * `setErrors`: rework to support different parameter combinations for errors (i.e. single error object, array of error objects, and rest parameters) and move `state` parameter to first position for uncurried overload ([15ea555](https://github.com/MrWolfZ/ngrx-forms/commit/15ea555))
  * `setUserDefinedProperty`: move `state` parameter to first position for uncurried overload ([520c384](https://github.com/MrWolfZ/ngrx-forms/commit/520c384))
  * `setValue`: move `state` parameter to first position for uncurried overload ([1a69795](https://github.com/MrWolfZ/ngrx-forms/commit/1a69795))
  * `validate`: move `state` parameter to first position for uncurried overload and add rest param overloads
* due to rework of `updateArray`, `updateGroup`, and `updateRecursive` update functions it is now invalid to call any of these functions without parameters (which made no sense anyway) but it is still possible to call the functions with an empty array as parameter (which is useful in dynamic situations)
* remove `payload` property from all actions and move corresponding properties into action itself ([6f955e9](https://github.com/MrWolfZ/ngrx-forms/commit/6f955e9))

#### Features

* use conditional types to infer the type of child controls
* rework `updateArray` to support different parameter combinations for update functions (i.e. single function, array of functions, and rest parameters) ([f82abf8](https://github.com/MrWolfZ/ngrx-forms/commit/f82abf8))
* rework `updateGroup` to support different parameter combinations for update function objects (i.e. single object, array of objects, and rest parameters) which reduces the probability of false type inference results ([0bb1ca7](https://github.com/MrWolfZ/ngrx-forms/commit/0bb1ca7))
* rework `updateRecursive` to support different parameter combinations for update function objects (i.e. single object, array of objects, and rest parameters) ([96121c3](https://github.com/MrWolfZ/ngrx-forms/commit/96121c3))
* add `updateArrayWithFilter` update function which works the same as `updateArray` except that it also takes a filter function that is applied to each array element to determine whether the update function should be applied ([0b66a6f](https://github.com/MrWolfZ/ngrx-forms/commit/0b66a6f))
* add `notEqualTo` validation function ([851a1ed](https://github.com/MrWolfZ/ngrx-forms/commit/851a1ed))

<a name="2.3.2"></a>
### 2.3.2

#### Bugfixes

* do not focus or blur form elements initially or on state changes when focus tracking is not enabled ([f6a10d5](https://github.com/MrWolfZ/ngrx-forms/commit/f6a10d5)) (thanks @bufke for helping me find this)
* make implicit browser platform dependency optional and disallow focus tracking on non-browser platforms ([e7760bc](https://github.com/MrWolfZ/ngrx-forms/commit/e7760bc)) (thanks @bufke for helping me find this)

<a name="2.3.1"></a>
### 2.3.1

#### Bugfixes

* allow action `type` to be undefined inside form state reducers ([0a61def](https://github.com/MrWolfZ/ngrx-forms/commit/0a61def)), closes [#44](https://github.com/MrWolfZ/ngrx-forms/pull/44) (thanks @lucax88x)

<a name="2.3.0"></a>
### 2.3.0

#### Features

* add support for array values in `minLength`, `maxLength`, and `required` validation functions ([c88353a](https://github.com/MrWolfZ/ngrx-forms/commit/c88353a)), closes [#40](https://github.com/MrWolfZ/ngrx-forms/issues/40) (thanks @icepeng)
* set CSS classes on form elements based on the status of the control (see the [documentation](docs/FORM_CONTROLS.md#status-css-classes) for more details) ([eddcbf4](https://github.com/MrWolfZ/ngrx-forms/commit/eddcbf4)), closes [#34](https://github.com/MrWolfZ/ngrx-forms/issues/34)

#### Bugfixes

* when removing controls from arrays update child control state IDs recursively ([be3cd49](https://github.com/MrWolfZ/ngrx-forms/commit/be3cd49)), closes [#41](https://github.com/MrWolfZ/ngrx-forms/issues/41)

<a name="2.2.0"></a>
### 2.2.0

#### Breaking Changes

* empty groups and arrays are now always enabled instead of disabled and therefore errors can now be set on empty groups and arrays (note that this is only a minor breaking change and only applies in edge cases and therefore this fix is included in a new minor instead of a new major version) ([749c1b5](https://github.com/MrWolfZ/ngrx-forms/commit/749c1b5)), closes [#37](https://github.com/MrWolfZ/ngrx-forms/issues/37)

#### Bugfixes

* fix missing union case in typing of `updateArray` update function that causes a compile error if used inside an `updateGroup` ([fa7dccc](https://github.com/MrWolfZ/ngrx-forms/commit/fa7dccc))
* fix `updateGroup` throwing an error if an empty update object was provided in curried as well as uncurried version ([bee4d54](https://github.com/MrWolfZ/ngrx-forms/commit/bee4d54))
* fix `createFormGroupState` producing results inconsistent with how group states are recomputed from their children after an update ([1c62d8c](https://github.com/MrWolfZ/ngrx-forms/commit/1c62d8c))
* fix `createFormArrayState` producing results inconsistent with how array states are recomputed from their children after an update ([70fdc10](https://github.com/MrWolfZ/ngrx-forms/commit/70fdc10))

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
