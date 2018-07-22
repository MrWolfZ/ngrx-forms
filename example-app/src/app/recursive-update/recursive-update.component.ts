import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { BlockUIAction, FormValue, State, UnblockUIAction } from './recursive-update.reducer';

@Component({
  selector: 'ngf-recursive-update',
  templateUrl: './recursive-update.component.html',
  styleUrls: ['./recursive-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecursiveUpdatePageComponent {
  formState$: Observable<FormGroupState<FormValue>>;

  constructor(private store: Store<State>) {
    this.formState$ = store.pipe(select(s => s.recursiveUpdate.formState));
  }

  submit() {
    this.store.dispatch(new BlockUIAction());
    timer(1000).pipe(map(() => new UnblockUIAction())).subscribe(this.store);
  }
}
