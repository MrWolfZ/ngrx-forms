import { Directive, EventEmitter, Output } from '@angular/core';

import { Actions } from '../actions';
import { KeyValue } from '../state';
import { NgrxFormDirective } from './directive';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'form[ngrxFormState][ngrxFormsAction]',
})
export class NgrxLocalFormDirective<TStateValue extends KeyValue> extends NgrxFormDirective<TStateValue> {

  @Output() ngrxFormsAction = new EventEmitter<Actions<TStateValue>>();

  constructor() {
    super(null);
  }

  protected dispatchAction(action: Actions<TStateValue>) {
    this.ngrxFormsAction.emit(action);
  }
}
