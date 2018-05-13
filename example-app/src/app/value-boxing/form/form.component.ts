import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroupState, unbox } from 'ngrx-forms';

import { FormValue } from '../value-boxing.reducer';

@Component({
  selector: 'ngf-value-boxing-example',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValueBoxingFormComponent {
  @Input() formState: FormGroupState<FormValue>;

  unbox = unbox;
}
