import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FormGroupState, NgrxValueConverter, NgrxValueConverters, ResetAction, SetValueAction } from 'ngrx-forms';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { FormValue, INITIAL_STATE, SetSubmittedValueAction, State } from './material.reducer';

@Component({
  selector: 'ngf-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicPageComponent {
  formState$: Observable<FormGroupState<FormValue>>;
  submittedValue$: Observable<FormValue | undefined>;

  constructor(private store: Store<State>) {
    this.formState$ = store.pipe(select(s => s.material.formState));
    this.submittedValue$ = store.pipe(select(s => s.material.submittedValue));
  }

  hobbyOptions = ['Sports', 'Video Games'];

  dateValueConverter: NgrxValueConverter<Date | null, string | null> = {
    convertViewToStateValue(value) {
      if (value === null) {
        return null;
      }

      // the value provided by the date picker is in local time but we want UTC so we recreate the date as UTC
      value = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
      return NgrxValueConverters.dateToISOString.convertViewToStateValue(value);
    },
    // tslint:disable-next-line: no-unbound-method
    convertStateToViewValue: NgrxValueConverters.dateToISOString.convertStateToViewValue,
  };

  reset() {
    this.store.dispatch(new SetValueAction(INITIAL_STATE.id, INITIAL_STATE.value));
    this.store.dispatch(new ResetAction(INITIAL_STATE.id));
  }

  submit() {
    this.formState$.pipe(
      take(1),
      filter(s => s.isValid),
      map(fs => new SetSubmittedValueAction(fs.value)),
    ).subscribe(this.store);
  }
}
