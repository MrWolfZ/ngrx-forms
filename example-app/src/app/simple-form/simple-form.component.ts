import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { FormValue, INITIAL_STATE, SetSubmittedValueAction, State } from './simple-form.reducer';
import {ResetAction, SetValueAction} from "../../../../src/actions";
import {FormGroupState} from "../../../../src/state";

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
    this.formState$ = store.pipe(select(s => s.simpleForm.formState));
    this.submittedValue$ = store.pipe(select(s => s.simpleForm.submittedValue));
  }

  reset() {
    this.store.dispatch(SetValueAction(INITIAL_STATE.id, INITIAL_STATE.value));
    this.store.dispatch(ResetAction(INITIAL_STATE.id));
  }

  submit() {
    this.formState$.pipe(
      take(1),
      map(fs => new SetSubmittedValueAction(fs.value)),
    ).subscribe(this.store);
  }
}
