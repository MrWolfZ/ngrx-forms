import { Directive,Output, EventEmitter } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';

import { Actions } from '../actions';
import { NgrxFormDirective } from './directive';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'form[ngrxFormState][ngrxFormsAction]',
})
export class NgrxLocalFormDirective<TValue extends { [key: string]: any }>
  extends NgrxFormDirective<TValue> {

  @Output() ngrxFormsAction = new EventEmitter<Actions<TValue>>();

  constructor() {
    super(null as any as ActionsSubject);
  }

  protected dispatchAction(action: Actions<TValue>) {
    this.ngrxFormsAction.emit(action);
  };
}
