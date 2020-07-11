## ngrx-forms Changelog

<a name="6.3.3"></a>
### 6.3.3

#### Bugfixes

* make `wrapReducerWithFormStateUpdate` work properly if used on states that are form states themselves ([9907718](https://github.com/MrWolfZ/ngrx-forms/commit/9907718)), closes [#196](https://github.com/MrWolfZ/ngrx-forms/issues/196)

<a name="6.3.2"></a>
### 6.3.2

#### Bugfixes

* export missing update functions `moveArrayControl` and `swapArrayControl` ([#193](https://github.com/MrWolfZ/ngrx-forms/pull/193)), thanks @jamie94bc for this fix

<a name="6.3.1"></a>
### 6.3.1

#### Bugfixes

* allow `undefined` property values in boxed objects, thanks @alex-vg for reporting this bug ([22b2667](https://github.com/MrWolfZ/ngrx-forms/commit/22b2667)), closes [#186](https://github.com/MrWolfZ/ngrx-forms/issues/186)

<a name="6.3.0"></a>
### 6.3.0

#### Features

* allow `onNgrxForms` to work on form states directly instead of requiring form states to be direct children of reduced states ([b81abb4](https://github.com/MrWolfZ/ngrx-forms/commit/b81abb4))

<a name="6.2.0"></a>
### 6.2.0

#### Features

* add new validation function `number` to validate a value is a number (useful in cases where the concrete type of a value is unknown) ([#182](https://github.com/MrWolfZ/ngrx-forms/pull/182)), thanks @dzonatan for implementing this feature
* ignore non-numeric values in `lessThan`, `lessThanOrEqualTo`, `greaterThan`, and `greaterThanOrEqualTo` validation functions ([#182](https://github.com/MrWolfZ/ngrx-forms/pull/182)), thanks @dzonatan for this change
* export the `NGRX_UPDATE_ON_TYPE` enum ([#184](https://github.com/MrWolfZ/ngrx-forms/pull/184)), thanks @dzonatan for this change

<a name="6.1.0"></a>
### 6.1.0

#### Features

* add support for local form states outside of the ngrx store ([#166](https://github.com/MrWolfZ/ngrx-forms/pull/166)), closes [#165](https://github.com/MrWolfZ/ngrx-forms/issues/165), see the [user guide](http://ngrx-forms.readthedocs.io/en/master/user-guide/local-form-state/) for more details, thanks @mucaho for implementing this great feature

<a name="6.0.0"></a>
### 6.0.0

This major release contains only a bugfix which is a breaking change.

#### Breaking Changes

* do not treat empty strings or arrays as an error in `minLength` validation function ([#164](https://github.com/MrWolfZ/ngrx-forms/pull/164)), thanks @Sloff for reporting and fixing this bug

  If you require these values to be treated as errors use `minLength` together with `required` (e.g. `validate(required, minLength(2))`)

<a name="5.2.3"></a>
### 5.2.3

#### Bugfixes

* use project tsconfig.json with ng-packagr during build; this bug lead to incorrect type definitions ([#163](https://github.com/MrWolfZ/ngrx-forms/pull/163)), thanks @tomvandezande for reporting and fixing this bug

<a name="5.2.2"></a>
### 5.2.2

This version is skipped due to an invalid package having been published.

<a name="5.2.1"></a>
### 5.2.1

#### Bugfixes

* ensure form states are correctly updated from actions when using `onNgrxFormsAction` with `onNgrxForms` ([ee5dccf](https://github.com/MrWolfZ/ngrx-forms/commit/ee5dccf))

<a name="5.2.0"></a>
### 5.2.0

#### Features

* add function `onNgrxFormsAction` that allows specifying a reducer for **ngrx-forms** actions with `createReducer` from ngrx 8 ([5cdf9c6](https://github.com/MrWolfZ/ngrx-forms/commit/5cdf9c6))

  It can be used as follows:

  ```ts
  import { createReducer } from '@ngrx/store';
  import {
    onNgrxForms,
    onNgrxFormsAction,
    SetValueAction,
    updateGroup,
    validate,
    wrapReducerWithFormStateUpdate,
  } from 'ngrx-forms';
  import { required } from 'ngrx-forms/validation';

  export interface LoginFormValue {
    username: string;
    password: string;
    stayLoggedIn: boolean;
  }

  export const initialLoginFormValue: LoginFormValue = {
    username: '',
    password: '',
    stayLoggedIn: false,
  };

  export const validateLoginForm = updateGroup<LoginFormValue>({
    username: validate(required),
    password: validate(required),
  });

  const reducer = createReducer(
    {
      loginForm: createFormGroupState('loginForm', initialLoginFormValue),
      // your other properties...
    },
    onNgrxForms(),

    // use this to call a reducer for a specific ngrx-forms action;
    // note that this must be placed after onNgrxForms
    onNgrxFormsAction(SetValueAction, (state, action) => {
      if (action.controlId === 'loginForm.username') {
        // react to username changing...
        // action is of type SetValueAction
      }

      return state;
    }),
    // your other reducers...
  );
  ```

<a name="5.1.0"></a>
### 5.1.0

#### Features

* add functions `onNgrxForms` and `wrapReducerWithFormStateUpdate` to allow better integration with `createReducer` from ngrx 8 ([ac95be2](https://github.com/MrWolfZ/ngrx-forms/commit/ac95be2)), closes [#147](https://github.com/MrWolfZ/ngrx-forms/issues/147)

  They can be used as follows:

  ```ts
  import { createReducer } from '@ngrx/store';
  import { onNgrxForms, updateGroup, validate, wrapReducerWithFormStateUpdate } from 'ngrx-forms';
  import { required } from 'ngrx-forms/validation';

  export interface LoginFormValue {
    username: string;
    password: string;
    stayLoggedIn: boolean;
  }

  export const initialLoginFormValue: LoginFormValue = {
    username: '',
    password: '',
    stayLoggedIn: false,
  };

  export const validateLoginForm = updateGroup<LoginFormValue>({
    username: validate(required),
    password: validate(required),
  });

  const rawReducer = createReducer(
    {
      loginForm: createFormGroupState('loginForm', initialLoginFormValue),
      // your other properties...
    },
    onNgrxForms(),
    // your other reducers...
  );

  // wrapReducerWithFormStateUpdate calls the update function
  // after the given reducer; you can wrap this reducer again
  // if you have multiple forms in your state
  export const reducer = wrapReducerWithFormStateUpdate(
    rawReducer,
    // point to the form state to update
    s => s.loginForm,
    // this function is always called after the reducer
    validateLoginForm,
  );
  ```
* add update functions for async validations ([8985e99](https://github.com/MrWolfZ/ngrx-forms/commit/8985e99))
* export constant `ALL_NGRX_FORMS_ACTION_TYPES` that is an array of all action types ngrx-forms provides ([09aad36](https://github.com/MrWolfZ/ngrx-forms/commit/09aad36))

#### Bugfixes

* allow setting async errors if the validation is not pending ([3f5c6d0](https://github.com/MrWolfZ/ngrx-forms/commit/3f5c6d0))
* allow clearing async errors on groups and arrays if the validation is not pending ([ff13472](https://github.com/MrWolfZ/ngrx-forms/commit/ff13472))

<a name="5.0.3"></a>
### 5.0.3

#### Bugfixes

* remove readonly modifier from array control state value ([28e781c](https://github.com/MrWolfZ/ngrx-forms/commit/28e781c)), thanks @dzonatan for reporting this bug, closes [#155](https://github.com/MrWolfZ/ngrx-forms/issues/155)

<a name="5.0.2"></a>
### 5.0.2

#### Bugfixes

* remove direct reference to `Event` since that causes errors in NativeScript applications ([1ac565a](https://github.com/MrWolfZ/ngrx-forms/commit/1ac565a)), thanks @bufke for reporting this bug, closes [#153](https://github.com/MrWolfZ/ngrx-forms/issues/153)

<a name="5.0.1"></a>
### 5.0.1

#### Bugfixes

* remove any references to `UIEvent` since that causes errors in NativeScript applications ([70cdbc2](https://github.com/MrWolfZ/ngrx-forms/commit/70cdbc2)), thanks @bufke for reporting this bug, closes [#153](https://github.com/MrWolfZ/ngrx-forms/issues/153)

<a name="5.0.0"></a>
### 5.0.0

This is a compatibility release for Angular 8 and TypeScript 3.4.

#### Breaking Changes

* update peer dependencies to require Angular `>=8.0.0`
* update peer dependencies to require TypeScript `>=3.4.0`

#### Features

* refactor `FormState` and `Unboxed` conditional type definitions to be simpler, which can improve build times and IDE performance ([e9f504b](https://github.com/MrWolfZ/ngrx-forms/commit/e9f504b)),  ([24b25db](https://github.com/MrWolfZ/ngrx-forms/commit/24b25db))

#### Build Improvements

* switch to ng-packagr for building the library ([2d126c5](https://github.com/MrWolfZ/ngrx-forms/commit/2d126c5))
* add dtslint tests to ensure stability of `FormState` and `Unboxed` types ([255c648](https://github.com/MrWolfZ/ngrx-forms/commit/255c648))

#### Bugfixes

* allow enabling empty disabled array states ([8a33d12](https://github.com/MrWolfZ/ngrx-forms/commit/8a33d12)), thanks @nihique for reporting this bug, closes [#149](https://github.com/MrWolfZ/ngrx-forms/issues/149)

<a name="5.0.0-beta.2"></a>
### 5.0.0-beta.2

This is a beta release in preparation for the release of Angular 8.

#### Bugfixes

* allow enabling empty disabled array states ([8a33d12](https://github.com/MrWolfZ/ngrx-forms/commit/8a33d12)), thanks @nihique for reporting this bug, closes [#149](https://github.com/MrWolfZ/ngrx-forms/issues/149)

<a name="5.0.0-beta.1"></a>
### 5.0.0-beta.1

This is a beta release in preparation for the release of Angular 8.

#### Breaking Changes

* update peer dependencies to require Angular `>=8.0.0`
* update peer dependencies to require TypeScript `>=3.4.0`

#### Features

* refactor `FormState` and `Unboxed` conditional type definitions to be simpler, which can improve build times and IDE performance ([e9f504b](https://github.com/MrWolfZ/ngrx-forms/commit/e9f504b)),  ([24b25db](https://github.com/MrWolfZ/ngrx-forms/commit/24b25db))

#### Build Improvements

* switch to ng-packagr for building the library ([2d126c5](https://github.com/MrWolfZ/ngrx-forms/commit/2d126c5))
* add dtslint tests to ensure stability of `FormState` and `Unboxed` types ([255c648](https://github.com/MrWolfZ/ngrx-forms/commit/255c648))

<a name="4.1.0"></a>
### 4.1.0

#### Features

* add actions and update functions to swap or move array controls ([42c2518](https://github.com/MrWolfZ/ngrx-forms/commit/42c2518)), thanks @solnat and @tashoecraft for their contributions in [#133](https://github.com/MrWolfZ/ngrx-forms/pull/133))

<a name="4.0.2"></a>
### 4.0.2

#### Bugfixes

* allow clearing async error without pending validation ([6116081](https://github.com/MrWolfZ/ngrx-forms/commit/6116081)), thanks @magnattic for reporting this bug, closes [#143](https://github.com/MrWolfZ/ngrx-forms/issues/143)

<a name="4.0.1"></a>
### 4.0.1

#### Bugfixes

* allow boxed `undefined` values as form control values ([ab5ff58](https://github.com/MrWolfZ/ngrx-forms/commit/ab5ff58)), thanks @dzonatan for reporting this bug, closes [#131](https://github.com/MrWolfZ/ngrx-forms/issues/131)

<a name="4.0.0"></a>
### 4.0.0

#### Features

* add support for Angular 7, ngrx v7, and TypeScript 3.1.X ([aad53c4](https://github.com/MrWolfZ/ngrx-forms/commit/aad53c4)), thanks @wbhob for his contribution in [#130](https://github.com/MrWolfZ/ngrx-forms/pull/130))

<a name="3.2.2"></a>
### 3.2.2

#### Bugfixes

* allow boxed `undefined` values as form control values ([4d6cc03](https://github.com/MrWolfZ/ngrx-forms/commit/4d6cc03)), thanks @dzonatan for reporting this bug, closes [#131](https://github.com/MrWolfZ/ngrx-forms/issues/131)

<a name="3.2.1"></a>
### 3.2.1

#### Bugfixes

* fix wrong inferred value type for `equalTo` and `notEqualTo` validation functions when used with `validate` update function ([0cc6ca3](https://github.com/MrWolfZ/ngrx-forms/commit/0cc6ca3))

<a name="3.2.0"></a>
### 3.2.0

#### Features

* add support for boxed values in all validation functions ([bed56f5](https://github.com/MrWolfZ/ngrx-forms/commit/bed56f5)), closes [#96](https://github.com/MrWolfZ/ngrx-forms/issues/96)

<a name="3.1.0"></a>
### 3.1.0

#### Features

* add new option `never` for `ngrxUpdateOn` ([ea0b284](https://github.com/MrWolfZ/ngrx-forms/commit/ea0b284)), see [documentation](https://ngrx-forms.readthedocs.io/en/master/user-guide/form-controls/#choosing-when-to-sync-the-view-to-the-state) for more details, thanks @Mr-Eluzive for their contribution in [#119](https://github.com/MrWolfZ/ngrx-forms/pull/119)), closes [#118](https://github.com/MrWolfZ/ngrx-forms/issues/118)

<a name="3.0.4"></a>
### 3.0.4

#### Bugfixes

* allow setting `null` and `undefined` values with curried version of `setValue` ([fe92a23](https://github.com/MrWolfZ/ngrx-forms/commit/fe92a23)), thanks @chrissena for reporting this bug, closes [#116](https://github.com/MrWolfZ/ngrx-forms/issues/116)

<a name="3.0.3"></a>
### 3.0.3

#### Bugfixes

* check if platform is browser in default view adapter to prevent error during server-side rendering ([0646fb7](https://github.com/MrWolfZ/ngrx-forms/commit/0646fb7)), thanks @scott-wyatt for his contribution in [#111](https://github.com/MrWolfZ/ngrx-forms/pull/111)), closes [#110](https://github.com/MrWolfZ/ngrx-forms/issues/110)

<a name="3.0.2"></a>
### 3.0.2

#### Bugfixes

* do not treat `null` control values as boxed values ([ae6a618](https://github.com/MrWolfZ/ngrx-forms/commit/ae6a618)), closes [#94](https://github.com/MrWolfZ/ngrx-forms/issues/94)

<a name="3.0.1"></a>
### 3.0.1

#### Bugfixes

* remove module augmentations for `requiredTrue` and `requiredFalse` validation errors since they conflict with the `required` module augmentation and are already covered by it ([1ab557f](https://github.com/MrWolfZ/ngrx-forms/commit/1ab557f)), closes [#92](https://github.com/MrWolfZ/ngrx-forms/issues/92)

<a name="3.0.0"></a>
### 3.0.0

This release requires TypeScript >=2.8.0 for the conditional type support. It also requires Angular >= 6.1.0 for compatibility with that TypeScript version.

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
* replace `createFormGroupReducerWithUpdate` with `createFormStateReducerWithUpdate` (which takes any kind of form state, it also behaves differently in that it only applies the update if the form state changes as part of reducing the action, see the [user guide](http://ngrx-forms.readthedocs.io/en/master/user-guide/updating-the-state/#createformstatereducerwithupdate) for more details) ([1b6114c](https://github.com/MrWolfZ/ngrx-forms/commit/1b6114c))
* mark all state properties as `readonly` to make it more clear the state is not meant to be modified directly ([291e0da](https://github.com/MrWolfZ/ngrx-forms/commit/291e0da))
* change form arrays and groups to preserve the values of `isDirty`, `isEnabled`, `isTouched`, and `isSubmitted` when the state is changed instead of always recomputing the values of these properties based on the state's child states (e.g. the state is not automatically disabled when all its child states are disabled, it is not automatically marked as pristine if it was dirty and all its child states are marked as pristine or all children are removed, etc.) ([9202d1e](https://github.com/MrWolfZ/ngrx-forms/commit/9202d1e)), closes [#68](https://github.com/MrWolfZ/ngrx-forms/issues/68)
* mark arrays and groups as dirty when adding or removing controls ([9202d1e](https://github.com/MrWolfZ/ngrx-forms/commit/9202d1e))

#### Features

* use conditional types to infer the type of child controls (see the [documentation](http://ngrx-forms.readthedocs.io/en/master/user-guide/type-inference/) for more details)
* add support for using arrays and objects as control values via boxing (see the [documentation](http://ngrx-forms.readthedocs.io/en/master/user-guide/value-boxing/) for more details) ([315ae4c](https://github.com/MrWolfZ/ngrx-forms/commit/315ae4c))
* add `formStateReducer` function, a reducer which can reduce any kind of form state and is correctly typed due to conditional type inference ([48eaaeb](https://github.com/MrWolfZ/ngrx-forms/commit/48eaaeb))
* rework `updateArray` to support different parameter combinations for update functions (i.e. single function, array of functions, and rest parameters) ([f82abf8](https://github.com/MrWolfZ/ngrx-forms/commit/f82abf8))
* rework `updateGroup` to support different parameter combinations for update function objects (i.e. single object, array of objects, and rest parameters) which reduces the probability of false type inference results ([0bb1ca7](https://github.com/MrWolfZ/ngrx-forms/commit/0bb1ca7))
* rework `updateRecursive` to support different parameter combinations for update function objects (i.e. single object, array of objects, and rest parameters) ([96121c3](https://github.com/MrWolfZ/ngrx-forms/commit/96121c3))
* add `updateArrayWithFilter` update function which works the same as `updateArray` except that it also takes a filter function that is applied to each array element to determine whether the update function should be applied ([0b66a6f](https://github.com/MrWolfZ/ngrx-forms/commit/0b66a6f))
* add `notEqualTo` validation function ([851a1ed](https://github.com/MrWolfZ/ngrx-forms/commit/851a1ed))
* enhance all form state reducers to match type signature for `ActionReducer` (they will still throw an error if the state is `undefined`) ([f3b5fea](https://github.com/MrWolfZ/ngrx-forms/commit/f3b5fea))
* add support for `undefined` values for all validation functions ([6cce8d0](https://github.com/MrWolfZ/ngrx-forms/commit/6cce8d0), thanks @romankhrystynych for his contribution in [#65](https://github.com/MrWolfZ/ngrx-forms/pull/65)), closes [#64](https://github.com/MrWolfZ/ngrx-forms/issues/64)
* improve typing of `errors` property on form states by using module augmentation inside of validation module to add well defined error properties to `ValidationErrors` interface ([e202e65](https://github.com/MrWolfZ/ngrx-forms/commit/e202e65))
* move documentation to [Read the Docs](http://ngrx-forms.readthedocs.io/en/master)
* add [FAQ](http://ngrx-forms.readthedocs.io/en/master/faq)
* add some reducer tests for example application to showcase how **ngrx-forms** can be tested ([5098f02](https://github.com/MrWolfZ/ngrx-forms/commit/5098f02)), closes [#58](https://github.com/MrWolfZ/ngrx-forms/issues/58)

#### Bugfixes

* do not set the `id` attribute for `input[type=radio]` form elements ([cbfd654](https://github.com/MrWolfZ/ngrx-forms/commit/cbfd654)), closes [#63](https://github.com/MrWolfZ/ngrx-forms/issues/63)

<a name="2.3.6"></a>
### 2.3.6

#### Bugfixes

* do not automatically set `id` of form elements to state's ID for elements that already have an `id` set ([3c8eabc](https://github.com/MrWolfZ/ngrx-forms/commit/3c8eabc)), closes [#86](https://github.com/MrWolfZ/ngrx-forms/issues/86)

<a name="2.3.5"></a>
### 2.3.5

#### Bugfixes

* fix typing of action `type` and `TYPE` properties to properly use literal string type ([0cd07b6](https://github.com/MrWolfZ/ngrx-forms/commit/0cd07b6)), closes [#75](https://github.com/MrWolfZ/ngrx-forms/issues/75), thanks @bufke for helping me find this

<a name="2.3.4"></a>
### 2.3.4

#### Bugfixes

* recursively update nested controls IDs when adding controls to arrays ([7b1de7c](https://github.com/MrWolfZ/ngrx-forms/commit/7b1de7c)), closes [#72](https://github.com/MrWolfZ/ngrx-forms/pull/72) (thanks @solnat for this fix)

<a name="2.3.3"></a>
### 2.3.3

#### Bugfixes

* ensure the `value` attribute of `option` elements is properly set via `[value]` bindings when there is no associated form view adapter ([bfaa388](https://github.com/MrWolfZ/ngrx-forms/commit/bfaa388)) (closes [#67](https://github.com/MrWolfZ/ngrx-forms/issues/67), thanks @kmiskiewicz for helping me find this)

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
