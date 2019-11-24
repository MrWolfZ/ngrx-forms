import { Directive, EventEmitter, Output } from '@angular/core';

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
    super(null);
  }

  protected dispatchAction(action: Actions<TValue>) {
    this.ngrxFormsAction.emit(action);
  }
}
