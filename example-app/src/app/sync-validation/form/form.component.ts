import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { FormGroupState, ResetAction, SetValueAction, cast } from 'ngrx-forms';

import { FormValue, INITIAL_STATE } from '../sync-validation.reducer';

@Component({
  selector: 'ngf-sync-validation-example',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SyncValidationComponent {
  @Input() formState: FormGroupState<FormValue>;
  submittedValue: FormValue;

  get passwordState() {
    return cast(this.formState.controls.password);
  }

  days = Array.from(Array(31).keys());
  months = [
    'January',
    'Febuary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  years = Array.from(Array(115).keys()).map(i => i + 1910);

  constructor(private actionsSubject: ActionsSubject) { }

  reset() {
    this.actionsSubject.next(new SetValueAction(INITIAL_STATE.id, INITIAL_STATE.value));
    this.actionsSubject.next(new ResetAction(INITIAL_STATE.id));
  }

  submit() {
    if (this.formState.isInvalid) {
      return;
    }

    this.submittedValue = this.formState.value;
  }
}
