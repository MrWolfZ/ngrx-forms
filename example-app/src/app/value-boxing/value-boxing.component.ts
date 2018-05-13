import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import { Observable } from 'rxjs/Rx';

import { FormValue, State } from './value-boxing.reducer';

@Component({
  selector: 'ngf-value-boxing',
  templateUrl: './value-boxing.component.html',
  styleUrls: ['./value-boxing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValueBoxingPageComponent {
  formState$: Observable<FormGroupState<FormValue>>;

  reducerCode = `
import { Action } from '@ngrx/store';
import {
  box,
  Boxed,
  createFormGroupState,
  formGroupReducer,
  FormGroupState,
} from 'ngrx-forms';

export interface FormValue {
  selection: Boxed<number[]>;
}

export const FORM_ID = 'valueBoxing';

export const INITIAL_STATE = createFormGroupState<FormValue>(FORM_ID, {
  selection: box([2, 4]),
});

export const reducers = {
  formState(s = INITIAL_STATE, a: Action) {
    return formGroupReducer(s, a);
  },
};
  `;

  componentCode = `
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroupState, unbox } from 'ngrx-forms';

import { FormValue } from '../value-boxing.reducer';

@Component({
  selector: 'ngf-value-boxing-example',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValueBoxingFormComponent {
  @Input() formState: FormGroupState<FormValue>;

  unbox = unbox;
}
  `;

  componentHtml = `
<form>
  <div>
    <label>Options</label>
    <div>
      <select multiple
              size="5"
              [ngrxFormControlState]="formState.controls.selection">
        <option *ngFor="let o of [1,2,3,4,5]"
                [value]="o">Option {{ o }}</option>
      </select>
    </div>
  </div>
</form>
<br />
<div>
  Unboxed form value:
  <br />
  <pre>{{ unbox(formState.value) | json }}</pre>
</div>
  `;

  constructor(store: Store<State>) {
    this.formState$ = store.select(s => s.valueBoxing.formState);
  }
}
