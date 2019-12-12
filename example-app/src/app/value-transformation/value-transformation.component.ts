import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import { Observable } from 'rxjs';

import { FormValue, State } from './value-transformation.reducer';

@Component({
  selector: 'ngf-value-transformation',
  templateUrl: './value-transformation.component.html',
  styleUrls: ['./value-transformation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValueTransformationPageComponent {
  formState$: Observable<FormGroupState<FormValue>>;

  constructor(store: Store<State>) {
    this.formState$ = store.pipe(select(s => s.valueTransformation.formState));
  }

  uppercaseConverter = {
    convertViewToStateValue: (viewValue: string) => viewValue.toUpperCase(),
    convertStateToViewValue: (stateValue: string) => stateValue,
  };

  stringEquals = (newStateValue: string, oldStateValue: string) => newStateValue === oldStateValue;
}
