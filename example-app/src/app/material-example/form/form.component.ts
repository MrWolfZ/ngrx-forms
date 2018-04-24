import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { FormGroupState, NgrxValueConverter, NgrxValueConverters, ResetAction, SetValueAction } from 'ngrx-forms';

import { FormValue, INITIAL_STATE } from '../material.reducer';

@Component({
  selector: 'ngf-material-example',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent {
  @Input() formState: FormGroupState<FormValue>;
  submittedValue: FormValue;
  hobbyOptions = ['Sports', 'Video Games'];

  objectToJSON = NgrxValueConverters.objectToJSON;

  dateValueConverter: NgrxValueConverter<Date | null, string | null> = {
    convertViewToStateValue(value) {
      if (value === null) {
        return null;
      }

      // the value provided by the date picker is in local time but we want UTC so we recreate the date as UTC
      value = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
      return NgrxValueConverters.dateToISOString.convertViewToStateValue(value);
    },
    convertStateToViewValue: NgrxValueConverters.dateToISOString.convertStateToViewValue,
  };

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
