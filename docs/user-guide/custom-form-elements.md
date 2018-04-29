**ngrx-forms** uses a mechanism called `FormViewAdapter` to connect form elements in the DOM to the state. These adapters are basically the same as the `ControlValueAccessor` concept of `@angular/forms`, however, they are optimized for **ngrx-forms** and allow for having fewer touching points in the library with `@angular/forms`.

However, since many third party libraries are using the `ControlValueAccessor` already, **ngrx-forms** integrates with these libraries by converting the value accessor internally into a view adapter. Therefore, all third party form components should work with **ngrx-forms** out of the box as long as they properly export the value accessor.

However, in case a library does not do this you can write a custom view adapter (if you want to integrate more directly with **ngrx-forms**) or a value accessor. Use the injection token `NGRX_FORM_VIEW_ADAPTER` to register a custom adapter. See the example app for such a custom view adapter (in this case for the `mat-select` from `@angular/material` which in version `5.0.0-rc0` does not export the `mat-select`'s value accessor).

A `FormViewAdapter` is defined as follows:

```typescript
export interface FormViewAdapter {
  /**
   * Sets a new value for the form element.
   */
  setViewValue(value: any): void;

  /**
   * Set the function to be called when the form element receives a change event.
   */
  setOnChangeCallback(fn: (value: any) => void): void;

  /**
   * Set the function to be called when the form element receives a touch event.
   */
  setOnTouchedCallback(fn: () => void): void;

  /**
   * Enable or disable the form element.
   */
  setIsDisabled?(isDisabled: boolean): void;
}
```
