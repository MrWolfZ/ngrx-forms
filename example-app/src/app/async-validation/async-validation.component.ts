import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import { Observable } from 'rxjs';

import { FormValue, State } from './async-validation.reducer';

@Component({
  selector: 'ngf-async-validation',
  templateUrl: './async-validation.component.html',
  styleUrls: ['./async-validation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsyncValidationPageComponent {
  formState$: Observable<FormGroupState<FormValue>>;
  searchResults$: Observable<string[]>;

  constructor(store: Store<State>) {
    this.formState$ = store.pipe(select(s => s.asyncValidation.formState));
    this.searchResults$ = store.pipe(select(s => s.asyncValidation.searchResults));
  }
}
