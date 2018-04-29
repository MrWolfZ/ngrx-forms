Here you will find the answers to the most frequently asked questions regarding **ngrx-forms**.

#### My `input` element keeps losing focus after each keystroke. What is causing this?

This most commonly happens when rendering the `input` inside an `*ngFor` loop. In this case you must make sure that you use a `trackBy` function. The reason for this is that the form state for the `input` is updated on every keystroke and therefore a change detection is triggered for the component the form state is bound to. Without a proper `trackBy` this in turn may lead to each element in the loop to be re-rendered and therefore any `input`s or other form elements will lose focus.

#### I am using `@angular/material` and my validation errors are not showing. In your example application it works. Why?

Sadly the `@angular/material` error handling only properly integrates with `@angular/forms` out of the box. To make it work with **ngrx-forms** you will need to write a custom error state matcher. The easiest way is to simply copy the one [used by the example application](https://github.com/MrWolfZ/ngrx-forms/blob/master/example-app/src/app/material/error-state-matcher.ts) (or simply copy the whole [material folder](https://github.com/MrWolfZ/ngrx-forms/tree/master/example-app/src/app/material) for other fixes). By including this directive globally in your application (e.g. by exporting it from a shared module) the error state matching will properly be applied to all `@angular/material` form elements. If it still does not work you may have to extend the error state matcher with more logic to handle other types of form elements.

#### I am using `@angular/material` and `mat-select` is not working. In your example application it works. Why?

Sadly `@angular/material` does not properly export the `ControlValueAccessor` for `mat-select`. Therefore you will need to write a custom form view adapter. The easiest way is to simply copy the one [used by the example application](https://github.com/MrWolfZ/ngrx-forms/blob/master/example-app/src/app/material/mat-select-view-adapter.ts) (or simply copy the whole [material folder](https://github.com/MrWolfZ/ngrx-forms/tree/master/example-app/src/app/material) for other fixes). By including this directive globally in your application (e.g. by exporting it from a shared module) `mat-select`s should start working with **ngrx-forms**. There may be other form elements that do not export the `ControlValueAccessor` properly in which case you will have to do the same for those.

#### How can I validate or set user defined properties immediately after my form state is created?

You can simply run an update of the form state when creating the initial state. The following example shows how to set some user defined properties when creating the form state.

```typescript
const INITIAL_FORM_STATE = updateGroup<MyFormValue>(
  createFormGroupState<MyFormValue>(FORM_ID, {
    someTextInput: '',
    someCheckbox: false,
    nested: {
      someNumber: 0,
    },
  }),
  {
    someTextInput: setUserDefinedProperty('allowedValues', ['foo', 'bar']),
    nested: updateGroup<MyFormValue['nested']>({
      someNumber: setUserDefinedProperty('maxValue', 10),
    }),
  },
);
```

#### Is it safe to use ngrx-forms together with `@angular/forms`?

Yes, both form mechanisms can be used in the same application. I recommend using **ngrx-forms** for everything though for obvious reasons ;) If you still need to use both please ensure that the `NgrxFormsModule` is imported _after_ the `FormsModule`/`ReactiveFormsModule` since there is an issue with the way `@angular/forms` registers some of their directives (see [this](https://github.com/MrWolfZ/ngrx-forms/issues/32) issue for more details).

#### What is the meaning of life?

Sorry, can't help you with that.

