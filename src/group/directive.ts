import { Directive, Input, HostListener, OnInit } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';

import { MarkAsSubmittedAction } from '../actions';
import { FormGroupState } from '../state';

@Directive({
  selector: 'form[ngrxFormState]',
})
export class NgrxFormDirective<TValue extends { [key: string]: any }> implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('ngrxFormState') state: FormGroupState<TValue>;

  constructor(private actionsSubject: ActionsSubject) { }

  ngOnInit() {
    if (!this.state) {
      throw new Error('The form state must not be undefined!');
    }
  }

  @HostListener('submit', ['$event'])
  onSubmit(event: Event) {
    event.preventDefault();
    if (this.state.isUnsubmitted) {
      this.actionsSubject.next(new MarkAsSubmittedAction(this.state.id));
    }
  }
}
