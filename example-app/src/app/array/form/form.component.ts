import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { FormGroupState, ResetAction, SetValueAction } from 'ngrx-forms';

import { FormValue, INITIAL_STATE } from '../array.reducer';

@Component({
  selector: 'ngf-array-example',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArrayFormComponent {
  @Input() formState: FormGroupState<FormValue>;

  constructor(private actionsSubject: ActionsSubject) { }

  reset() {
    this.actionsSubject.next(new SetValueAction(INITIAL_STATE.id, INITIAL_STATE.value));
    this.actionsSubject.next(new ResetAction(INITIAL_STATE.id));
  }
}
