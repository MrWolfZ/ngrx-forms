import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  Inject,
  Optional,
  Self,
  Output,
  EventEmitter,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActionsSubject } from '@ngrx/store';

import { FormControlValueTypes } from '../state';
import { FormViewAdapter, NGRX_FORM_VIEW_ADAPTER } from '../view-adapter/view-adapter';
import { NgrxFormControlDirective, Document } from './directive';
import { Actions } from '../actions';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngrxFormControlState][ngrxFormsAction]',
})
export class NgrxLocalFormControlDirective<TStateValue extends FormControlValueTypes, TViewValue = TStateValue>
  extends NgrxFormControlDirective<TStateValue, TViewValue> {

  @Output() ngrxFormsAction = new EventEmitter<Actions<TStateValue>>();

  constructor(
    el: ElementRef,
    @Optional() @Inject(DOCUMENT) dom: Document | null,
    @Self() @Optional() @Inject(NGRX_FORM_VIEW_ADAPTER) viewAdapters: FormViewAdapter[],
    @Self() @Optional() @Inject(NG_VALUE_ACCESSOR) valueAccessors: ControlValueAccessor[],
  ) {
    super(el, dom, null as any as ActionsSubject, viewAdapters, valueAccessors);
  }

  protected dispatchAction(action: Actions<TStateValue>) {
    this.ngrxFormsAction.emit(action);
  };
}
