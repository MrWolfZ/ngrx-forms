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

  constructor(store: Store<State>) {
    this.formState$ = store.select(s => s.valueConversion.formState);
  }
}
