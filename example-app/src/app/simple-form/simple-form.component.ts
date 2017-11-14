import { Store } from '@ngrx/store';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroupState } from 'ngrx-forms';
import { Observable } from 'rxjs/Rx';

import { SimpleFormValue, State } from './simple-form.reducer';

@Component({
  selector: 'ngf-simple-form',
  templateUrl: './simple-form.component.html',
  styleUrls: ['./simple-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleFormPageComponent {
  formState$: Observable<FormGroupState<SimpleFormValue>>;

  reducerCode = `
export interface SimpleFormValue {
  firstName: string;
  lastName: string;
  email: string;
  sex: string;
  favoriteColor: string;
  employed: boolean;
  notes: string;
}

export const FORM_ID = 'simpleForm';

export const INITIAL_STATE = createFormGroupState<SimpleFormValue>(FORM_ID, {
  firstName: '',
  lastName: '',
  email: '',
  sex: '',
  favoriteColor: '',
  employed: false,
  notes: '',
});

export function simpleFormReducer(s = INITIAL_STATE, a: Action) {
  return formGroupReducer(s, a);
}
  `;

  componentCode = `
@Component({
  selector: 'ngf-simple-form-example',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleFormComponent {
  @Input() formState: FormGroupState<SimpleFormValue>;

  constructor(private actionsSubject: ActionsSubject) { }

  reset() {
    this.actionsSubject.next(new SetValueAction(INITIAL_STATE.id, INITIAL_STATE.value));
    this.actionsSubject.next(new ResetAction(INITIAL_STATE.id));
  }
}
  `;

  componentHtml = `
<form [ngrxFormState]="formState">
  <div>
    <label>First Name</label>
    <div>
      <input name="firstName"
             type="text"
             placeholder="First Name"
             [ngrxFormControlState]="formState.controls.firstName" />
    </div>
  </div>
  <div>
    <label>Last Name</label>
    <div>
      <input name="lastName"
             type="text"
             placeholder="Last Name"
             [ngrxFormControlState]="formState.controls.lastName" />
    </div>
  </div>
  <div>
    <label>Email</label>
    <div>
      <input name="email"
             type="email"
             placeholder="Email"
             [ngrxFormControlState]="formState.controls.email" />
    </div>
  </div>
  <div>
    <label>Sex</label>
    <div>
      <label>
        <input name="sex"
               type="radio"
               value="male"
               [ngrxFormControlState]="formState.controls.sex" /> Male
      </label>
      <label>
        <input name="sex"
               type="radio"
               value="female"
               [ngrxFormControlState]="formState.controls.sex" /> Female
      </label>
    </div>
  </div>
  <div>
    <label>Favorite Color</label>
    <div>
      <select name="favoriteColor"
              [ngrxFormControlState]="formState.controls.favoriteColor">
        <option value=""></option>
        <option value="ff0000">Red</option>
        <option value="00ff00">Green</option>
        <option value="0000ff">Blue</option>
      </select>
    </div>
  </div>
  <div>
    <label htmlFor="employed">Employed</label>
    <div>
      <input name="employed"
             id="employed"
             type="checkbox"
             [ngrxFormControlState]="formState.controls.employed" />
    </div>
  </div>
  <div>
    <label>Notes</label>
    <div>
      <textarea name="notes"
                [ngrxFormControlState]="formState.controls.notes">
      </textarea>
    </div>
  </div>
  <div class="buttons">
    <div></div>
    <div>
      <button type="submit"
              [disabled]="formState.isInvalid && formState.isSubmitted">
        Submit
      </button>
      <button type="button"
              [disabled]="formState.isPristine
                          && formState.isUntouched
                          && formState.isUnsubmitted"
              (click)="reset()">
        Reset
      </button>
    </div>
  </div>
</form>
  `;

  constructor(store: Store<State>) {
    this.formState$ = store.select(s => s.simpleForm.formState);
  }
}
