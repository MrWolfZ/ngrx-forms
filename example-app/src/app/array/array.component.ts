import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import { Observable } from 'rxjs/Rx';

import { FormValue, State } from './array.reducer';

@Component({
  selector: 'ngf-array',
  templateUrl: './array.component.html',
  styleUrls: ['./array.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrayPageComponent {
  formState$: Observable<FormGroupState<FormValue>>;

  reducerCode = `
import { Action } from '@ngrx/store';
import {
  createFormGroupState,
  formGroupReducer,
  FormGroupState,
} from 'ngrx-forms';

export interface FormValue {
  options: boolean[];
}

export const FORM_ID = 'array';

export const INITIAL_STATE = createFormGroupState<FormValue>(FORM_ID, {
  options: [
    false,
    false,
    false,
    false,
  ],
});

export const reducers = {
  formState(s = INITIAL_STATE, a: Action) {
    return formGroupReducer(s, a);
  },
};
  `;

  componentCode = `
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';

import { FormValue } from '../array.reducer';

@Component({
  selector: 'ngf-array-example',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArrayFormComponent {
  @Input() formState: FormGroupState<FormValue>;

  constructor(private actionsSubject: ActionsSubject) { }

  trackByIndex(index: number) {
    return index;
  }
}
  `;

  componentHtml = `
<form>
  <div *ngFor="let control of formState.controls.options.controls;
               trackBy: trackByIndex;
               let i = index">
    <label>Option {{ i }}</label>
    <div>
      <input type="checkbox"
             [ngrxFormControlState]="control" />
    </div>
  </div>
</form>
  `;

  constructor(store: Store<State>) {
    this.formState$ = store.select(s => s.array.formState);
  }
}
