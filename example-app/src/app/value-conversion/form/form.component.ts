import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroupState, NgrxValueConverters } from 'ngrx-forms';

import { FormValue } from '../value-conversion.reducer';

@Component({
  selector: 'ngf-value-conversion-example',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValueConversionFormComponent {
  @Input() formState: FormGroupState<FormValue>;

  jsonValueConverter = NgrxValueConverters.objectToJSON;
}
