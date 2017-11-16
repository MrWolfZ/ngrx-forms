import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import { Observable } from 'rxjs/Rx';

import { FormValue, State } from './material.reducer';

@Component({
  selector: 'ngf-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicPageComponent {
  formState$: Observable<FormGroupState<FormValue>>;

  reducerCode = `
import { Action } from '@ngrx/store';
import {
  cast,
  createFormGroupReducerWithUpdate,
  createFormGroupState,
  disable,
  enable,
  FormGroupState,
  updateGroup,
  validate,
  setErrors,
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
  sex: string;
  favoriteColor: string;
  dateOfBirth: string;
  agreeToTermsOfUse: boolean;
}

export const FORM_ID = 'material';

export const INITIAL_STATE = createFormGroupState<FormValue>(FORM_ID, {
  userName: '',
  createAccount: true,
  password: {
    password: '',
    confirmPassword: '',
  },
  sex: '',
  favoriteColor: '',
  dateOfBirth: new Date(Date.UTC(1970, 0, 1)).toISOString(),
  agreeToTermsOfUse: false,
});

function validatePasswordsMatch(password: string, confirmPassword: string) {
  if (password === confirmPassword) {
    return {};
  }

  return {
    match: {
      password,
      confirmPassword,
    },
  };
}

const validationFormGroupReducer = createFormGroupReducerWithUpdate<FormValue>({
  userName: validate(required),
  password: (state, parentState) => {
    if (!parentState.value.createAccount) {
      return disable(state);
    }

    state = enable(state);
    return updateGroup<PasswordValue>({
      password: validate([required, minLength(8)]),
      confirmPassword: validate(value =>
        validatePasswordsMatch(state.value.password, value)
      ),
    })(cast(state));
  },
  agreeToTermsOfUse: validate<boolean>(requiredTrue),
});

export const reducers = {
  formState(s = INITIAL_STATE, a: Action) {
    return validationFormGroupReducer(s, a);
  },
};
  `;

  componentCode = `
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { FormGroupState, ResetAction, SetValueAction, NgrxValueConverters, NgrxValueConverter } from 'ngrx-forms';

import { FormValue, INITIAL_STATE } from '../material.reducer';

@Component({
  selector: 'ngf-material-example',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormComponent {
  @Input() formState: FormGroupState<FormValue>;
  submittedValue: FormValue;

  dateValueConverter: NgrxValueConverter<Date | null, string | null> = {
    convertViewToStateValue(value) {
      if (value === null) {
        return null;
      }

      // the value provided by the date picker is in local time but we want UTC so we recreate the date as UTC
      value = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
      return NgrxValueConverters.dateToISOString.convertViewToStateValue(value);
    },
    convertStateToViewValue: NgrxValueConverters.dateToISOString.convertStateToViewValue,
  };

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
    <mat-form-field>
      <input matInput
             placeholder="User Name"
             [ngrxFormControlState]="formState.controls.userName">
      <mat-error *ngIf="formState.errors._userName?.required">
        A user name is required
      </mat-error>
    </mat-form-field>
  </div>
  <div>
    <mat-checkbox [ngrxFormControlState]="formState.controls.createAccount">Create Account?</mat-checkbox>
  </div>
  <div>
    <mat-form-field>
      <input matInput
             type="password"
             placeholder="Password {{ formState.controls.password.isDisabled ? '(disabled)' : '' }}"
             [ngrxFormControlState]="formState.controls.password.controls.password">
      <mat-error *ngIf="formState.errors._password?._password?.required">
        A password is required
      </mat-error>
      <mat-error *ngIf="!formState.errors._password?._password?.required && formState.errors._password?._password?.minLength">
        The password must be at least {{ formState.errors._password._password.minLength.minLength }} characters long.
      </mat-error>
    </mat-form-field>
  </div>
  <div>
    <mat-form-field>
      <input matInput
             type="password"
             placeholder="Confirm Password {{ formState.controls.password.isDisabled ? '(disabled)' : '' }}"
             [ngrxFormControlState]="formState.controls.password.controls.confirmPassword">
      <mat-error *ngIf="formState.errors._password?._confirmPassword?.match">
        The passwords do not match
      </mat-error>
    </mat-form-field>
  </div>
  <div>
    <mat-radio-group [ngrxFormControlState]="formState.controls.sex">
      <mat-radio-button value="male">Male</mat-radio-button>
      <mat-radio-button value="female">Female</mat-radio-button>
    </mat-radio-group>
  </div>
  <div>
    <mat-form-field>
      <mat-select placeholder="Favorite Color"
                  [ngrxFormControlState]="formState.controls.favoriteColor">
        <mat-option value=""></mat-option>
        <mat-option value="ff0000">Red</mat-option>
        <mat-option value="00ff00">Green</mat-option>
        <mat-option value="0000ff">Blue</mat-option>
      </mat-select>
    </mat-form-field>
  </div>
  <div>
    <mat-form-field>
      <input matInput
             [matDatepicker]="picker"
             placeholder="Date of Birth"
             [ngrxFormControlState]="formState.controls.dateOfBirth"
             [ngrxValueConverter]="dateValueConverter">
      <mat-datepicker-toggle matSuffix
                             [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
  </div>
  <div>
    <mat-checkbox [ngrxFormControlState]="formState.controls.agreeToTermsOfUse">Agree to terms of use</mat-checkbox>
    <mat-error *ngIf="formState.errors._agreeToTermsOfUse?.required 
                      && (formState.controls.agreeToTermsOfUse.isTouched || formState.controls.agreeToTermsOfUse.isSubmitted)"

               class="terms-of-use-error">
      You must agree to the terms of use
    </mat-error>
  </div>
  <div class="buttons">
    <div>
      <button mat-raised-button
              color="primary"
              type="submit"
              [disabled]="formState.isInvalid && formState.isSubmitted">
        Register
      </button>
      <button mat-raised-button
              type="button"
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
    this.formState$ = store.select(s => s.material.formState);
  }
}
