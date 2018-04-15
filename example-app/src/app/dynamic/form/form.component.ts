import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { AddArrayControlAction, FormGroupState, RemoveArrayControlAction } from 'ngrx-forms';

import { CreateGroupElementAction, FormValue, RemoveGroupElementAction } from '../dynamic.reducer';

@Component({
  selector: 'ngf-dynamic-example',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormComponent {
  @Input() formState: FormGroupState<FormValue>;
  @Input() arrayOptions: number[];
  @Input() groupOptions: string[];

  constructor(private actionsSubject: ActionsSubject) { }

  addGroupOption() {
    const name = Math.random().toString(36).substr(2, 3);
    this.actionsSubject.next(new CreateGroupElementAction(name));
  }

  removeGroupOption(name: string) {
    this.actionsSubject.next(new RemoveGroupElementAction(name));
  }

  addArrayOption(index: number) {
    this.actionsSubject.next(new AddArrayControlAction(
      this.formState.controls.array.id,
      false,
      index,
    ));
  }

  removeArrayOption(index: number) {
    this.actionsSubject.next(new RemoveArrayControlAction(
      this.formState.controls.array.id,
      index,
    ));
  }

  trackByIndex(index: number) {
    return index;
  }

  trackById(index: number, id: string) {
    return id;
  }
}
