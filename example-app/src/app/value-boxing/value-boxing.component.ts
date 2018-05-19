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

  constructor(store: Store<State>) {
    this.formState$ = store.select(s => s.valueBoxing.formState);
  }
}
