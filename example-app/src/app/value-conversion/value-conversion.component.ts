import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FormGroupState, NgrxValueConverters } from 'ngrx-forms';
import { Observable } from 'rxjs';

import { FormValue, State } from './value-conversion.reducer';

@Component({
  selector: 'ngf-value-conversion',
  templateUrl: './value-conversion.component.html',
  styleUrls: ['./value-conversion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValueConversionPageComponent {
  formState$: Observable<FormGroupState<FormValue>>;

  constructor(store: Store<State>) {
    this.formState$ = store.pipe(select(s => s.valueConversion.formState));
  }

  dateToISOString = NgrxValueConverters.dateToISOString;
}
