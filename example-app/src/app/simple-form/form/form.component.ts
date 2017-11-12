import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import {
  FormGroupState,
  MarkAsPristineAction,
  MarkAsUnsubmittedAction,
  MarkAsUntouchedAction,
  SetValueAction,
} from 'ngrx-forms';

import { INITIAL_STATE, SimpleFormValue } from '../reducer';

@Component({
  selector: 'ngf-simple-form-example',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent {
  @Input() formState: FormGroupState<SimpleFormValue>;

  constructor(private actionsSubject: ActionsSubject) { }

  reset() {
    this.actionsSubject.next(new SetValueAction(INITIAL_STATE.id, INITIAL_STATE.value));
    // this.actionsSubject.next(new ResetAction(INITIAL_STATE.id));
    this.actionsSubject.next(new MarkAsPristineAction(INITIAL_STATE.id));
    this.actionsSubject.next(new MarkAsUntouchedAction(INITIAL_STATE.id));
    this.actionsSubject.next(new MarkAsUnsubmittedAction(INITIAL_STATE.id));
  }
}
