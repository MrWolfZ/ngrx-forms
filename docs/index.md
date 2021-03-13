Welcome to **ngrx-forms**.

This documentation will help you understand how to include **ngrx-forms** in your project and how to use all of its features.

Use the navigation on the left to browse to the different topics. For newcomers it is recommended to read the quick introduction below and then move on to the [user guide](user-guide/index.md).

You can also visit the [example application](https://mrwolfz.github.io/ngrx-forms/) to see **ngrx-forms** live in action.

#### Motivation

**ngrx-forms** brings the strengths of the redux state management model to the world of forms in applications that are using Angular and ngrx. The mechanisms that Angular provides for working with forms are inherently mutable, local, and hard to debug. This library offers a different model for working with forms. Instead of storing the state of form controls inside the components we put them in the ngrx store. We update the state with actions which allows easy debugging just like any other redux application. **ngrx-forms** also provides powerful mechanisms to update, validate and generally manage large complex forms. It contains APIs for synchronous and asynchronous validation, creating dynamic forms, integrating with custom form elements, and much more.

#### Design Principles

This library is written to be as functional and as pure as possible. Most of the heavy lifting is done in pure reducer functions with the directives being only a thin layer to connect the form states to the DOM.

This library also tries to be as independent as possible from other libraries/modules. While there is of course a dependency on ngrx the touching points are small and it should be possible to adapt this library to any other redux library without too much effort. There is also a peer dependency on `@angular/forms` from which we re-use the `ControlValueAccessor` concept to allow easier integration with other libraries that provide custom form controls.

Conceptually this library borrows heavily from `@angular/forms`, specifically the concepts of form controls and form groups (see the [User Guide](/user-guide) for a more detailed description of these concepts).
