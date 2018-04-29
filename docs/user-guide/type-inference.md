TypeScript 2.8 introduced a feature called [conditional types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html). Since **ngrx-forms** uses the value type of a form state to determine the kind of the state this allows us to properly type states depending on the value type parameter instead of having to explicitly specify the kind of state. This is especially useful for nested form states (i.e. groups and arrays). Conceptually it works like this pseudo code:

```typescript
export type FormState<TValue> =
  (TValue is primitive type) ? FormControlState<TValue>
  : (TValue is array type) ? FormArrayState<TValue>
  : (TValue is object type) ? FormGroupState<TValue>
  : never;
```

There is also a corresponding `formStateReducer` function that can reduce any kind of form state.

It is therefore possible to only use `FormState` in your code without ever specifying the concrete type of the state. However, it may be better for readability of your code to specify the concrete type where it is known and only use `FormState` where it is unknown.
