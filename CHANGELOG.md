## Ngrx Forms Changelog

<a name="1.2.0"></a>
### 1.2.0

#### Features

* add value converter for object to JSON conversion ([2ba37ee](https://github.com/MrWolfZ/ngrx-forms/commit/2ba37ee)) (thanks @tbroadley)
* add support for error composition by extending `validate` update function to take a single validation function or an array of validation functions ([ba976c5](https://github.com/MrWolfZ/ngrx-forms/commit/ba976c5))

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
