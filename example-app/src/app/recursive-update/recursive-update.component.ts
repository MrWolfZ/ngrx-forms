import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import { Observable } from 'rxjs/Rx';

import { FormValue, State } from './recursive-update.reducer';

@Component({
  selector: 'ngf-recursive-update',
  templateUrl: './recursive-update.component.html',
  styleUrls: ['./recursive-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecursiveUpdatePageComponent {
  formState$: Observable<FormGroupState<FormValue>>;

  constructor(store: Store<State>) {
    this.formState$ = store.select(s => s.recursiveUpdate.formState);
  }
}
