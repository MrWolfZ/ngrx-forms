# ngrx-forms

[![Build Status](https://travis-ci.org/MrWolfZ/ngrx-forms.svg?branch=master)](https://travis-ci.org/MrWolfZ/ngrx-forms)

Proper integration of forms in Angular 4 applications using ngrx.

Disclaimer: This library is not affiliated with the official ngrx library. I have created it mainly for my own use in one of my projects, but I thought others could profit as well.

There is an [example app](https://ngrx-forms-example-app-v2.herokuapp.com/) that showcases most of the functionality of this library.

### Content
[1 Installation](#1-installation)  
[2 Design Principles](#2-design-principles)  
[3 User Guide](#3-user-guide)  
[4 Open Points](#4-open-points)  
[5 Contributing](#5-contributing)  

## 1 Installation
```Shell
npm install ngrx-forms --save
```

This library has a peer dependency on versions `>=4.0.0` of `@angular/core`, `@angular/common`, `@angular/forms`, `@angular/platform-browser`, and `@ngrx/store`.

## 2 Design Principles
This library is written to be as functional and as pure as possible. Most of the heavy lifting is done in pure reducer functions with the directives being only a thin layer to connect the form states to the DOM.

This library also tries to be as independent as possible from other libraries/modules. While there is of course a dependency on ngrx the touching points are small and it should be possible to adapt this library to any other redux library without too much effort. There is also a peer dependency on `@angular/forms` from which we re-use the `ControlValueAccessor` concept to allow easier integration with other libraries that provide custom form controls.

Conceptually this library borrows heavily from `@angular/forms`, specifically the concepts of form controls and form groups (see the [User Guide](docs/USER_GUIDE.md) for a more detailed description of these concepts).

## 3 User Guide

You can find a detailed user guide [here](docs/USER_GUIDE.md).

## 4 Open Points

* providing some global configuration options (e.g. enabling focus tracking globally)
* add `isSomeChildFocused` to groups to track whether any child is focused
* some more tests for directives
* tests for example application
* multiple example apps to showcase more scenarios

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
