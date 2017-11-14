import { Store } from '@ngrx/store';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroupState } from 'ngrx-forms';
import { Observable } from 'rxjs/Rx';

import { FormValue, State } from './async-validation.reducer';

@Component({
  selector: 'ngf-async-validation',
  templateUrl: './async-validation.component.html',
  styleUrls: ['./async-validation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsyncValidationPageComponent {
  formState$: Observable<FormGroupState<FormValue>>;

  reducerCode = `
  `;

  componentCode = `
  `;

  componentHtml = `
  `;

  constructor(store: Store<State>) {
    this.formState$ = store.select(s => s.asyncValidation.formState);
  }
}
