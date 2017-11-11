import { Store } from '@ngrx/store';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroupState } from 'ngrx-forms';
import { Observable } from 'rxjs/Rx';

import { SimpleFormValue, State } from './reducer';

@Component({
  selector: 'ngf-simple-form',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleFormPageComponent {
  formState$: Observable<FormGroupState<SimpleFormValue>>;

  constructor(store: Store<State>) {
    this.formState$ = store.select(s => s.simpleForm);
  }
}
