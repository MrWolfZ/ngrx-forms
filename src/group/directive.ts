import { Directive, HostListener, Input, OnInit } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';

import { MarkAsSubmittedAction } from '../actions';
import { FormGroupState } from '../state';

// this interface just exists to prevent a direct reference to
// `Event` in our code, which otherwise causes issues in NativeScript
// applications
interface CustomEvent extends Event { }

@Directive({
  // tslint:disable-next-line:directive-selector
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
  onSubmit(event: CustomEvent) {
    event.preventDefault();
    if (this.state.isUnsubmitted) {
      this.actionsSubject.next(new MarkAsSubmittedAction(this.state.id));
    }
  }
}
