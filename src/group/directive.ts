import { Directive, Input, HostListener } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';

import { MarkAsSubmittedAction } from '../actions';
import { FormGroupState } from '../state';

@Directive({
  selector: 'form[ngrxFormState]',
})
export class NgrxFormDirective<TValue extends { [key: string]: any }> {
  // tslint:disable-next-line:no-input-rename
  @Input('ngrxFormState') state: FormGroupState<TValue>;

  constructor(private actionsSubject: ActionsSubject) { }

  @HostListener('submit', ['$event'])
  onSubmit(event: Event) {
    if (!this.state) {
      return;
    }

    event.preventDefault();
    if (this.state.isUnsubmitted) {
      this.actionsSubject.next(new MarkAsSubmittedAction(this.state.id));
    }
  }
}
