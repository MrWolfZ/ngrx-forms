# ngrx-forms

[![npm version](https://badge.fury.io/js/ngrx-forms.svg)](https://www.npmjs.com/package/ngrx-forms)
[![Build Status](https://travis-ci.org/MrWolfZ/ngrx-forms.svg?branch=master)](https://travis-ci.org/MrWolfZ/ngrx-forms)
[![codecov](https://codecov.io/gh/MrWolfZ/ngrx-forms/branch/master/graph/badge.svg)](https://codecov.io/gh/MrWolfZ/ngrx-forms)
[![Docs](https://readthedocs.org/projects/ngrx-forms/badge/?version=master)](http://ngrx-forms.readthedocs.io/en/master/?badge=master)
[![license](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**ngrx-forms** brings the strengths of the redux state management model to the world of forms in applications that are using Angular and ngrx. The mechanisms that Angular provides for working with forms are inherently mutable, local, and hard to debug. This library offers a different model for working with forms. Instead of storing the state of form controls inside the components we put them in the ngrx store. We update the state with actions which allows easy debugging just like any other redux application. **ngrx-forms** also provides powerful mechanisms to update, validate and generally manage large complex forms. It contains APIs for synchronous and asynchronous validation, creating dynamic forms, integrating with custom form elements, and much more.

To get to know more you can either read the [official documentation](http://ngrx-forms.readthedocs.io/en/master) or visit the [example application](https://ngrx-forms-example-app-v2.herokuapp.com/).

#### Installation
```Shell
npm install ngrx-forms --save
```

This library has a peer dependency on versions `>=4.0.0` of `@angular/core`, `@angular/common`, `@angular/forms`, `@angular/platform-browser`, and `@ngrx/store`.

#### Contributing

Please see the [documentation](http://ngrx-forms.readthedocs.io/en/master/contributing/).

#### License
Everything in this repository is [licensed under the MIT License](LICENSE) unless otherwise specified.

Copyright (c) 2017-2018 Jonathan Ziller
