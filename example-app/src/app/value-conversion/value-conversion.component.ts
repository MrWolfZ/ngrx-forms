import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import { Observable } from 'rxjs/Rx';

import { FormValue, State } from './value-conversion.reducer';

@Component({
  selector: 'ngf-value-conversion',
  templateUrl: './value-conversion.component.html',
  styleUrls: ['./value-conversion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValueConversionPageComponent {
  formState$: Observable<FormGroupState<FormValue>>;

  reducerCode = `
import { Action } from '@ngrx/store';
import {
  createFormGroupState,
  formGroupReducer,
  FormGroupState,
} from 'ngrx-forms';

export interface FormValue {
  selection: string;
}

export const FORM_ID = 'valueConversion';

export const INITIAL_STATE = createFormGroupState<FormValue>(FORM_ID, {
  selection: '[2, 4]',
});

export const reducers = {
  formState(s = INITIAL_STATE, a: Action) {
    return formGroupReducer(s, a);
  },
};
  `;

  componentCode = `
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroupState, NgrxValueConverters } from 'ngrx-forms';

import { FormValue } from '../value-conversion.reducer';

@Component({
  selector: 'ngf-value-conversion-example',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValueConversionFormComponent {
  @Input() formState: FormGroupState<FormValue>;

  jsonValueConverter = NgrxValueConverters.objectToJSON;
}
  `;

  componentHtml = `
<form>
  <div>
    <label>Options</label>
    <div>
      <select multiple
              size="5"
              [ngrxFormControlState]="formState.controls.selection"
              [ngrxValueConverter]="jsonValueConverter">
        <option *ngFor="let o of [1,2,3,4,5]"
                [value]="o">Option {{o}}</option>
      </select>
    </div>
  </div>
</form>
  `;

  constructor(store: Store<State>) {
    this.formState$ = store.select(s => s.valueConversion.formState);
  }
}
