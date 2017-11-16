import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { FormGroupState, cast } from 'ngrx-forms';

import { FormValue } from '../array.reducer';

@Component({
  selector: 'ngf-array-example',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArrayFormComponent {
  @Input() formState: FormGroupState<FormValue>;

  get optionsState() {
    return cast(this.formState.controls.options);
  }

  constructor(private actionsSubject: ActionsSubject) { }

  trackByIndex(index: number) {
    return index;
  }
}
