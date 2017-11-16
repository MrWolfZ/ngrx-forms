import { Store } from '@ngrx/store';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroupState } from 'ngrx-forms';
import { Observable } from 'rxjs/Rx';

import { FormValue, State } from './sync-validation.reducer';

@Component({
  selector: 'ngf-sync-validation',
  templateUrl: './sync-validation.component.html',
  styleUrls: ['./sync-validation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SyncValidationPageComponent {
  formState$: Observable<FormGroupState<FormValue>>;

  reducerCode = `
import { Action } from '@ngrx/store';
import {
  cast,
  createFormGroupReducerWithUpdate,
  createFormGroupState,
  disable,
  enable,
  updateGroup,
  validate,
} from 'ngrx-forms';
import { minLength, required, requiredTrue } from 'ngrx-forms/validation';

export interface PasswordValue {
  password: string;
  confirmPassword: string;
}

export interface FormValue {
  userName: string;
  createAccount: boolean;
  password: PasswordValue;
  dayOfBirth: number;
  monthOfBirth: string;
  yearOfBirth: number;
  agreeToTermsOfUse: boolean;
}

export const FORM_ID = 'syncValidation';

export const INITIAL_STATE = createFormGroupState<FormValue>(FORM_ID, {
  userName: '',
  createAccount: true,
  password: {
    password: '',
    confirmPassword: '',
  },
  dayOfBirth: 1,
  monthOfBirth: 'January',
  yearOfBirth: 1970,
  agreeToTermsOfUse: false,
});

function validatePasswordsMatch(value: PasswordValue) {
  if (value.password === value.confirmPassword) {
    return {};
  }

  return {
    match: value,
  };
}

const validationFormGroupReducer = createFormGroupReducerWithUpdate<FormValue>({
  userName: validate(required),
  password: (state, parentState) => {
    if (!parentState.value.createAccount) {
      return disable(state);
    }

    state = enable(state);
    state = validate(validatePasswordsMatch, state);
    return updateGroup<PasswordValue>({
      password: validate([required, minLength(8)]),
    })(cast(state));
  },
  agreeToTermsOfUse: validate<boolean>(requiredTrue),
});

export function syncValidationFormReducer(s = INITIAL_STATE, a: Action) {
  return validationFormGroupReducer(s, a);
}
  `;

  componentCode = `
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { FormGroupState, ResetAction, SetValueAction, cast } from 'ngrx-forms';

import { FormValue, INITIAL_STATE } from '../sync-validation.reducer';

@Component({
  selector: 'ngf-sync-validation-example',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SyncValidationComponent {
  @Input() formState: FormGroupState<FormValue>;
  submittedValue: FormValue;

  get passwordState() {
    return cast(this.formState.controls.password);
  }

  days = Array.from(Array(31).keys());
  months = [
    'January',
    'Febuary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  years = Array.from(Array(115).keys()).map(i => i + 1910);

  constructor(private actionsSubject: ActionsSubject) { }

  reset() {
    this.actionsSubject.next(new SetValueAction(INITIAL_STATE.id, INITIAL_STATE.value));
    this.actionsSubject.next(new ResetAction(INITIAL_STATE.id));
  }

  submit() {
    if (this.formState.isInvalid) {
      return;
    }

    this.submittedValue = this.formState.value;
  }
}
  `;

  componentHtml = `
<form [ngrxFormState]="formState"
      (submit)="submit()">
  <div>
    <label>User Name</label>
    <div>
      <input type="text"
             [ngrxFormControlState]="formState.controls.userName" />
    </div>
  </div>
  <div>
    <label>Create Account?</label>
    <div>
      <input type="checkbox"
             [ngrxFormControlState]="formState.controls.createAccount" />
    </div>
  </div>
  <div>
    <label>Password</label>
    <div>
      <input type="password"
             [ngrxFormControlState]="passwordState.controls.password" />
    </div>
  </div>
  <div>
    <label>Confirm Password</label>
    <div>
      <input type="password"
             [ngrxFormControlState]="passwordState.controls.confirmPassword" />
    </div>
  </div>
  <div>
    <label>Date of Birth</label>
    <div>
      <select [ngrxFormControlState]="formState.controls.dayOfBirth">
        <option *ngFor="let day of days"
                [value]="day">{{day}}</option>
      </select>
      <select [ngrxFormControlState]="formState.controls.monthOfBirth">
        <option *ngFor="let month of months"
                [value]="month">{{month}}</option>
      </select>
      <select [ngrxFormControlState]="formState.controls.yearOfBirth">
        <option *ngFor="let year of years"
                [value]="year">{{year}}</option>
      </select>
    </div>
  </div>
  <div>
    <label>Agree to terms of use</label>
    <div>
      <input type="checkbox"
             [ngrxFormControlState]="formState.controls.agreeToTermsOfUse" />
    </div>
  </div>
  <div class="buttons">
    <div></div>
    <div>
      <button type="submit"
              [disabled]="formState.isInvalid">
        Register
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

<ul *ngIf="formState.isInvalid"
     class="error-messages">
  <li *ngIf="formState.errors._userName?.required">
    A user name is required
  </li>
  <li *ngIf="formState.errors._password?._password?.required">
    A password is required
  </li>
  <li *ngIf="formState.errors._password?._password?.minLength">
    The password must be at least
    {{ formState.errors._password._password.minLength.minLength }}
    characters long.
  </li>
  <li *ngIf="formState.errors._password?.match">
    The passwords do not match
  </li>
  <li *ngIf="formState.errors._agreeToTermsOfUse?.required">
    You must agree to the terms of use
  </li>
</ul>
<br />
<div *ngIf="formState.isSubmitted">
  The form was submitted with the following value:
  <br />
  <pre>{{ submittedValue | json }}</pre>
</div>
  `;

  constructor(store: Store<State>) {
    this.formState$ = store.select(s => s.syncValidation.formState);
  }
}
