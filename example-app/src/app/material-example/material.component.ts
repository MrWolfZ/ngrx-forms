import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import { Observable } from 'rxjs/Rx';

import { FormValue, State } from './material.reducer';

@Component({
  selector: 'ngf-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss'],
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
    this.formState$ = store.select(s => s.material.formState);
  }
}
