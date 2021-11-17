As mentioned in the section about [updating the state](updating-the-state.md) the `validate` update function takes one or more validation functions as a parameter and uses them to validate the value of a form state. **ngrx-forms** provides a set of validation functions out of the box (imported via `ngrx-forms/validation`) that can be used as arguments to `validate`. Most of these functions treat `null` and `undefined` (and for `email` and `pattern` empty strings and for `minLength` empty strings and arrays) as valid to allow for optional form controls. If the control is not optional simply combine the corresponding validation function with the `required` validation function.

The following table lists all validation functions provided by **ngrx-forms**.

|Function|Description|
|-|-|
|`required`|Requires the value to be non-empty (i.e. non-`null`, non-empty `string`, non-empty `array` etc.)|
|`requiredTrue`|Requires the `boolean` value to be `true`|
|`requiredFalse`|Requires the `boolean` value to be `false`|
|`equalTo`|Requires the value to be equal to another value|
|`notEqualTo`|Requires the value to be not equal to another value|
|`lessThan`|Requires the `number` value to be less than another number|
|`lessThanOrEqualTo`|Requires the `number` value to be less than or equal to another number|
|`greaterThan`|Requires the `number` value to be greater than another number|
|`greaterThanOrEqualTo`|Requires the `number` value to be greater than or equal to another number|
|`minLength`|Requires a `string` or `array` value to have a minimum length. Empty strings and arrays are always valid to allow for optional form controls. Use this function together with `required` if those values should not be valid|
|`maxLength`|Requires a `string` or `array` value to have a maximum length|
|`email`|Requires a `string` value to be a valid e-mail address. Empty strings are always valid to allow for optional form controls. Use this function together with `required` if empty strings should not be valid|
|`number`|Requires the value to be a `number`|
|`pattern`|Requires a `string` value to match a regular expression. Empty strings are always valid to allow for optional form controls. Use this function together with `required` if empty strings should not be valid|

Below you can see an example of how these functions can be used:

```typescript
import { updateGroup, validate } from 'ngrx-forms';
import { required, greaterThanOrEqualTo, lessThan } from 'ngrx-forms/validation';

export interface NestedValue {
  someNumber: number;
}

export interface MyFormValue {
  someTextInput: string;
  someCheckbox: boolean;
  nested: NestedValue;
}

const validateMyForm = updateGroup<MyFormValue>({
  someTextInput: validate(required),
  nested: updateGroup<NestedValue>({
    someNumber: validate(required, greaterThanOrEqualTo(2), lessThan(10)),
  }),
});
```

Each of the provided validation functions augments the `ValidationErrors` interface used for the `errors` property of form states with the error object the function produces which provides some type safety when accessing the `errors` property. You are encouraged to do the same for your own custom validation functions. Below is an example of how this can be achieved.

```typescript
export interface MyCustomValidationError {
  someProperty: string;
}

// @ts-ignore
declare module 'ngrx-forms' {
  export interface ValidationErrors {
    myCustomError?: MyCustomValidationError;
  }
}
```

#### Asynchronous Validation

In addition to the synchronous validation via update functions explained above **ngrx-forms** supports asynchronous validation for form states. However, since asynchronous validations are by nature not side-effect free they need to be handled differently.

**ngrx-forms** provides a set of three actions that can be used to perform asynchronous validation. These actions can be dispatched however you like, be that from a service or from within effects. The first of these actions is the `StartAsyncValidationAction` which takes the name of the validation to be performed. This name is added to the `pendingValidations` of the control state and the `isValidationPending` flag is set to true (if it was not already) for the control and all its parents. However, the validity of the control is not affected by this action. This means, if you e.g. want to disable the submit button of your form while the form is invalid or currently validating you need to check two properties, e.g. `[disabled]="formState.isInvalid || formState.isValidationPending"`. You can have as many asynchronous validations running at the same time as you like. The `isValidationPending` flag will be true as long as at least one validation has not yet completed.

The last two actions are used to complete the validation. The `SetAsyncErrorAction` takes the name of the validation and an arbitrary value and adds an error with the given name (prefixed with a `$`) and value to the state's errors. It also removes the validation from the control's `pendingValidations`. The `$` prefix marks all asynchronous errors which allows the synchronous validation via update functions to preserve these errors. That means you can safely combine synchronous validation and asynchronous validation. By adding the error the control will be marked as invalid if it was not already. The other action is the `ClearAsyncErrorAction` which takes only the name of the validation and removes the error if it was present. This action also removes the validation from the control's `pendingValidations`.

If you prefer to use your own custom actions for coordinating the asynchronous validation you can use the update functions `startAsyncValidation`, `setAsyncError` and `clearAsyncError` in your reducer instead of dispatching the actions.

Below you can find an example of the steps that occur during such an asynchronous validation. Each step shows a slice of the control's state at the time. The scenario is a book search in a book store.

The user types a search:

```json
{
  "value": "some book I am looking for",
  "isValid": true,
  "isInvalid": false,
  "errors": {},
  "pendingValidations": [],
  "isValidationPending": false
}
```

Your code dispatches a `StartAsyncValidationAction` for the name _exists_:

```json
{
  "value": "some book I am looking for",
  "isValid": true,
  "isInvalid": false,
  "errors": {},
  "pendingValidations": ["exists"],
  "isValidationPending": true
}
```

The search returns that the book does not exist, i.e. your code dispatches a `SetAsyncErrorAction` for _exists_ with value `true` (this value can be freely chosen and only exists so that you may use it to store metadata that you want to attach to the error):

```json
{
  "value": "some book I am looking for",
  "isValid": false,
  "isInvalid": true,
  "errors": {
    "$exists": true,
  },
  "pendingValidations": [],
  "isValidationPending": false
}
```

The user types another search and your code dispatches another `StartAsyncValidationAction` for the name _exists_:

```json
{
  "value": "lord of the rings",
  "isValid": false,
  "isInvalid": true,
  "errors": {
    "$exists": true,
  },
  "pendingValidations": ["exists"],
  "isValidationPending": true
}
```

The search returns that the book does exist, so your code dispatches a `ClearAsyncErrorAction` for _exists_:

```json
{
  "value": "lord of the rings",
  "isValid": true,
  "isInvalid": false,
  "errors": {},
  "pendingValidations": [],
  "isValidationPending": false
}
```

If you are using `@ngrx/effects` your validation might look like this:

```typescript
@Effect()
validateBookExists$: Observable<Action> = this.actions$
  .ofType(StartBookSearchAction.TYPE)
  .switchMap(a =>
    this.http.get(`api/books/search/${a.searchTerm}`)
      .map(resp =>
        resp.status === 404
          ? new SetAsyncErrorAction(a.controlId, "exists", true)
          : new ClearAsyncErrorAction(a.controlId, "exists")
      )
      // controlId may either be sent with the action or obtained from the store via withLatestFrom
      .startWith(new StartAsyncValidationAction(a.controlId, "exists"))
  );
```
