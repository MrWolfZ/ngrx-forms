import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FormGroupState, unbox } from 'ngrx-forms';
import { Observable } from 'rxjs';

import { FormValue, State } from './value-boxing.reducer';

@Component({
  selector: 'ngf-value-boxing',
  templateUrl: './value-boxing.component.html',
  styleUrls: ['./value-boxing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValueBoxingPageComponent {
  formState$: Observable<FormGroupState<FormValue>>;

  constructor(store: Store<State>) {
    this.formState$ = store.pipe(select(s => s.valueBoxing.formState));
  }

  unbox = unbox;
}
