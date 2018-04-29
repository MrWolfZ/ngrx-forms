Welcome to **ngrx-forms**.

This documentation will help you understand how to include **ngrx-forms** in your project and how to use all of its features.

Use the navigation on the left to browse to the different topics. For newcomers it is recommended to read the quick introduction below and then move on to the [user guide](user-guide/index.md).

You can also visit the [example application](https://ngrx-forms-example-app-v2.herokuapp.com/) to see **ngrx-forms** live in action.

#### Motivation

**ngrx-forms** brings the strengths of the redux state management model to the world of forms in applications that are using Angular and ngrx. The mechanisms that Angular provides for working with forms are inherently mutable, local, and hard to debug. This library offers a different model for working with forms. Instead of storing the state of form controls inside the components we put them in the ngrx store. We update the state with actions which allows easy debugging just like any other redux application. **ngrx-forms** also provides powerful mechanisms to update, validate and generally manage large complex forms. It contains APIs for synchronous and asynchronous validation, creating dynamic forms, integrating with custom form elements, and much more.
