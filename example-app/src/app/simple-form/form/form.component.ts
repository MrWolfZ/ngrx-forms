import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { FormGroupState, ResetAction, SetValueAction } from 'ngrx-forms';

import { INITIAL_STATE, SimpleFormValue } from '../simple-form.reducer';

@Component({
  selector: 'ngf-simple-form-example',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleFormComponent {
  @Input() formState: FormGroupState<SimpleFormValue>;
  submittedValue: SimpleFormValue;

  constructor(private actionsSubject: ActionsSubject) { }

  reset() {
    this.actionsSubject.next(new SetValueAction(INITIAL_STATE.id, INITIAL_STATE.value));
    this.actionsSubject.next(new ResetAction(INITIAL_STATE.id));
  }

  submit() {
    this.submittedValue = this.formState.value;
  }
}
