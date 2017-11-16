import { Observable } from 'rxjs/Rx';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { FormGroupState, ResetAction, SetValueAction } from 'ngrx-forms';

import { FormValue, INITIAL_STATE, BlockUIAction, UnblockUIAction } from '../recursive-update.reducer';

@Component({
  selector: 'ngf-recursive-update-example',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecursiveUpdateFormComponent {
  @Input() formState: FormGroupState<FormValue>;

  constructor(private actionsSubject: ActionsSubject) { }

  submit() {
    this.actionsSubject.next(new BlockUIAction());
    Observable.timer(1000)
      .map(() => new UnblockUIAction())
      .subscribe(this.actionsSubject);
  }
}
