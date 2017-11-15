import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';

import { FormValue } from '../async-validation.reducer';

@Component({
  selector: 'ngf-async-validation-example',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsyncValidationFormComponent {
  @Input() formState: FormGroupState<FormValue>;
  @Input() searchResults: string[];

  constructor(private actionsSubject: ActionsSubject) { }
}
