import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroupState, ResetAction, SetValueAction } from 'ngrx-forms';
import { Observable } from 'rxjs/Rx';

import { FormValue, INITIAL_STATE, SetSubmittedValueAction, State } from './simple-form.reducer';

@Component({
  selector: 'ngf-simple-form',
  templateUrl: './simple-form.component.html',
  styleUrls: ['./simple-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleFormPageComponent {
  formState$: Observable<FormGroupState<FormValue>>;
  submittedValue$: Observable<FormValue | undefined>;

  constructor(private store: Store<State>) {
    this.formState$ = store.select(s => s.simpleForm.formState);
    this.submittedValue$ = store.select(s => s.simpleForm.submittedValue);
  }

  reset() {
    this.store.next(new SetValueAction(INITIAL_STATE.id, INITIAL_STATE.value));
    this.store.next(new ResetAction(INITIAL_STATE.id));
  }

  submit() {
    this.formState$
      .take(1)
      .map(fs => new SetSubmittedValueAction(fs.value))
      .subscribe(this.store);
  }
}
