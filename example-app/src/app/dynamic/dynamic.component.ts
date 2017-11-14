import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import { Observable } from 'rxjs/Rx';

import { FormValue, State } from './dynamic.reducer';

@Component({
  selector: 'ngf-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicPageComponent {
  formState$: Observable<FormGroupState<FormValue>>;

  reducerCode = `
  `;

  componentCode = `
  `;

  componentHtml = `
  `;

  constructor(store: Store<State>) {
    this.formState$ = store.select(s => s.dynamic.formState);
  }
}
