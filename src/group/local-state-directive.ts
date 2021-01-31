import { Directive, EventEmitter, Output } from '@angular/core';
import { NgrxFormActionTypes } from '../actions';

import { NgrxFormDirective } from './directive';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'form[ngrxFormState][ngrxFormsAction]',
})
export class NgrxLocalFormDirective<TStateValue> extends NgrxFormDirective<TStateValue> {

  @Output() ngrxFormsAction = new EventEmitter<any>(); // type fix me

  constructor() {
    super(null);
  }

  protected dispatchAction(action: NgrxFormActionTypes) {
    this.ngrxFormsAction.emit(action);
  }
}
