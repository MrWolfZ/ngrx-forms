All form states are internally updated by **ngrx-forms** through dispatching actions from the directives via the `ActionsSubject` to ngrx's root or feature `Store`, by default.
This is done in the background, so the user does not need to deal with forwarding these form actions from the directive to the store.

However, if you prefer to listen for these actions explicitly and deal with updating the state manually, you can bind to `(ngrxFormsAction)`, the directive's output `EventEmitter`, directly.

```typescript
@Component({
  selector: 'my-local-form-component',
  template: `
    <form>
      <input type="text"
        [ngrxFormControlState]="formState.controls.myLocalFormField"
        (ngrxFormsAction)="handleFormAction($event)">
    </form>
  `,
})
export class MyLocalFormComponent {

  public formState = createFormGroupState("myLocalForm", {
    myLocalFormField: ''
  });

  handleFormAction(action: Actions<any>) {
    this.formState = formGroupReducer(this.formState, action);
  }
}
```

That is all you need, except importing the `NgrxFormsModule` somewhere in your app's module.

```typescript
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    NgrxFormsModule,
    // No need to import a StoreModule here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Maintaining a local form state has its merits:

* The root or feature store is not populated with **temporary form data** which perishes after the component is destroyed.
Form data is often used for creating and/or updating an entity and becomes obsolete after an update request is sent to the server. After the server responds, you can update your list or table of entities with the new or updated, proper entity data.
* You still want to have **easy-to-reason** and **easy-to-test** form logic for handling how values propagate between controls, how each control is affected by validation, etc. by leveraging the various update functions.
