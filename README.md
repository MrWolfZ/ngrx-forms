# ngrx-forms

[![Build Status](https://travis-ci.org/MrWolfZ/ngrx-forms.svg?branch=master)](https://travis-ci.org/MrWolfZ/ngrx-forms)

Proper integration of forms in Angular applications using ngrx.

Disclaimer: This library is not affiliated with the official ngrx library. I have created it mainly for my own use in one of my projects, but I thought others could profit as well.

### Content
[1 Overview](#1-overview)
[2 Installation](#2-installation)
[3 Design Principles](#3-design-principles)
[4 Open Points](#4-open-points)
[5 Contributing](#5-contributing)

## 1 Overview
ngrx-forms brings the strengths of the redux state management model to the world of forms in applications that are using Angular and ngrx. The mechanisms that Angular provides for working with forms are inherently mutable, local, and hard to debug. This library offers a different model for working with forms. Instead of storing the state of form controls inside the components we put them in the ngrx store. We update the state with actions which allows easy debugging just like any other redux application. ngrx-forms also provides powerful mechanisms to update, validate and generally manage large complex forms. It contains APIs for synchronous and asynchronous validation, creating dynamic forms, integrating with custom form elements, and much more.

To get to know more you can either read the detailed [user guide](docs/USER_GUIDE.md) or visit the [example application](https://ngrx-forms-example-app-v2.herokuapp.com/).

## 2 Installation
```Shell
npm install ngrx-forms --save
```

This library has a peer dependency on versions `>=4.0.0` of `@angular/core`, `@angular/common`, `@angular/forms`, `@angular/platform-browser`, and `@ngrx/store`.

## 3 Design Principles
This library is written to be as functional and as pure as possible. Most of the heavy lifting is done in pure reducer functions with the directives being only a thin layer to connect the form states to the DOM.

This library also tries to be as independent as possible from other libraries/modules. While there is of course a dependency on ngrx the touching points are small and it should be possible to adapt this library to any other redux library without too much effort. There is also a peer dependency on `@angular/forms` from which we re-use the `ControlValueAccessor` concept to allow easier integration with other libraries that provide custom form controls.

Conceptually this library borrows heavily from `@angular/forms`, specifically the concepts of form controls and form groups (see the [User Guide](docs/USER_GUIDE.md) for a more detailed description of these concepts).

## 4 Open Points

* add README section about Actions
* providing some global configuration options (e.g. enabling focus tracking globally)
* add `isSomeChildFocused` to groups to track whether any child is focused
* some more tests for directives
* tests for example application

## 5 Contributing

Any pull requests are welcome. If you want to work on this library locally you can use the commands shown below.

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

Copyright &copy; 2017 Jonathan Ziller
