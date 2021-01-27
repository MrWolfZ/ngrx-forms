import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { FormValue, INITIAL_STATE, setSubmittedValue, State } from './simple-form-ngrx8.reducer';
import {ResetAction, SetValueAction} from "../../../../src/actions";
import {FormGroupState} from "../../../../src/state";

@Component({
  selector: 'ngf-simple-form-ngrx8',
  templateUrl: './simple-form-ngrx8.component.html',
  styleUrls: ['./simple-form-ngrx8.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleFormNgrx8PageComponent {
  formState$: Observable<FormGroupState<FormValue>>;
  submittedValue$: Observable<FormValue | undefined>;

  constructor(private store: Store<State>) {
    this.formState$ = store.pipe(select(s => s.simpleFormNgrx8.formState));
    this.submittedValue$ = store.pipe(select(s => s.simpleFormNgrx8.submittedValue));
  }

  reset() {
    this.store.dispatch(SetValueAction(INITIAL_STATE.id, INITIAL_STATE.value));
    this.store.dispatch(ResetAction(INITIAL_STATE.id));
  }

  submit() {
    this.formState$.pipe(
      take(1),
      map(fs => setSubmittedValue({ submittedValue: fs.value })),
    ).subscribe(this.store);
  }
}
