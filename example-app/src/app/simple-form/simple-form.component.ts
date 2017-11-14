import { Store } from '@ngrx/store';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroupState } from 'ngrx-forms';
import { Observable } from 'rxjs/Rx';

import { FormValue, State } from './simple-form.reducer';

@Component({
  selector: 'ngf-simple-form',
  templateUrl: './simple-form.component.html',
  styleUrls: ['./simple-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleFormPageComponent {
  formState$: Observable<FormGroupState<FormValue>>;

  reducerCode = `
import { Action } from '@ngrx/store';
import { createFormGroupState, formGroupReducer } from 'ngrx-forms';

export interface FormValue {
  firstName: string;
  lastName: string;
  email: string;
  sex: string;
  favoriteColor: string;
  employed: boolean;
  notes: string;
}

export const FORM_ID = 'simpleForm';

export const INITIAL_STATE = createFormGroupState<FormValue>(FORM_ID, {
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
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { FormGroupState, ResetAction, SetValueAction } from 'ngrx-forms';

import { INITIAL_STATE, FormValue } from '../simple-form.reducer';

@Component({
  selector: 'ngf-simple-form-example',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleFormComponent {
  @Input() formState: FormGroupState<FormValue>;
  submittedValue: FormValue;

  constructor(private actionsSubject: ActionsSubject) { }

  reset() {
    this.actionsSubject.next(new SetValueAction(INITIAL_STATE.id, INITIAL_STATE.value));
    this.actionsSubject.next(new ResetAction(INITIAL_STATE.id));
  }

  submit() {
    this.submittedValue = this.formState.value;
  }
}
  `;

  componentHtml = `
<form [ngrxFormState]="formState"
      (submit)="submit()">
  <div>
    <label>First Name</label>
    <div>
      <input type="text"
             placeholder="First Name"
             [ngrxFormControlState]="formState.controls.firstName" />
    </div>
  </div>
  <div>
    <label>Last Name</label>
    <div>
      <input type="text"
             placeholder="Last Name"
             [ngrxFormControlState]="formState.controls.lastName" />
    </div>
  </div>
  <div>
    <label>Email</label>
    <div>
      <input type="email"
             placeholder="Email"
             [ngrxFormControlState]="formState.controls.email" />
    </div>
  </div>
  <div>
    <label>Sex</label>
    <div>
      <label>
        <input type="radio"
               value="male"
               [ngrxFormControlState]="formState.controls.sex" /> Male
      </label>
      <label>
        <input type="radio"
               value="female"
               [ngrxFormControlState]="formState.controls.sex" /> Female
      </label>
    </div>
  </div>
  <div>
    <label>Favorite Color</label>
    <div>
      <select [ngrxFormControlState]="formState.controls.favoriteColor">
        <option value=""></option>
        <option value="ff0000">Red</option>
        <option value="00ff00">Green</option>
        <option value="0000ff">Blue</option>
      </select>
    </div>
  </div>
  <div>
    <label>Employed</label>
    <div>
      <input type="checkbox"
             [ngrxFormControlState]="formState.controls.employed" />
    </div>
  </div>
  <div>
    <label>Notes</label>
    <div>
      <textarea [ngrxFormControlState]="formState.controls.notes">
      </textarea>
    </div>
  </div>
  <div class="buttons">
    <div></div>
    <div>
      <button type="submit">
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
<br />
<div *ngIf="formState.isSubmitted">
  The form was submitted with the following value:
  <br />
  <pre>{{ submittedValue | json }}</pre>
</div>
  `;

  constructor(store: Store<State>) {
    this.formState$ = store.select(s => s.simpleForm.formState);
  }
}
