import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroupState } from 'ngrx-forms';

import { FormValue } from '../array.reducer';

@Component({
  selector: 'ngf-array-example',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrayFormComponent {
  @Input() formState: FormGroupState<FormValue>;

  trackByIndex(index: number) {
    return index;
  }
}
