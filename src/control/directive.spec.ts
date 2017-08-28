import { ElementRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Action, ActionsSubject } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/count';

import { SetValueAction } from '../actions';
import { createFormControlState } from '../state';
import { NgrxFormControlDirective } from './directive';

describe(NgrxFormControlDirective.name, () => {
  let directive: NgrxFormControlDirective<string>;
  let elementRef: ElementRef;
  let document: Document;
  let actionsSubject: ActionsSubject;
  let actions$: Observable<Action>;
  let valueAccessor: ControlValueAccessor;
  let onChange: (value: string) => void;
  let onTouched: () => void;
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = 'value';
  const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  beforeEach(() => {
    elementRef = { nativeElement: { focus: () => void 0, blur: () => void 0 } } as any as ElementRef;
    document = {} as any as Document;
    actionsSubject = new BehaviorSubject<Action>({ type: '' }) as ActionsSubject;
    actions$ = actionsSubject as any; // required due to mismatch of lift() function signature
    valueAccessor = {
      writeValue: () => void 0,
      registerOnChange: fn => onChange = fn,
      registerOnTouched: fn => onTouched = fn,
      setDisabledState: () => void 0,
    };
    directive = new NgrxFormControlDirective<string>(elementRef, document, actionsSubject, [valueAccessor]);
    directive.ngrxFormControlState = INITIAL_STATE;
    directive.ngOnInit();
  });

  afterEach(() => {
    directive.ngOnDestroy();
  });

  it('should write the value when the state changes', () => {
    const newValue = 'new value';
    const spy = spyOn(valueAccessor, 'writeValue');
    directive.ngrxFormControlState = { ...INITIAL_STATE, value: newValue };
    expect(spy).toHaveBeenCalledWith(newValue);
  });

  it('should not write the value when the state value does not change', () => {
    const spy = spyOn(valueAccessor, 'writeValue');
    directive.ngrxFormControlState = INITIAL_STATE;
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not write the value when the state value is the same as the view value', () => {
    const newValue = 'new value';
    onChange(newValue);
    const spy = spyOn(valueAccessor, 'writeValue');
    directive.ngrxFormControlState = { ...INITIAL_STATE, value: newValue };
    expect(spy).not.toHaveBeenCalled();
  });

  it('should write the value when the state value does not change but the id does', () => {
    const spy = spyOn(valueAccessor, 'writeValue');
    directive.ngrxFormControlState = { ...INITIAL_STATE, id: FORM_CONTROL_ID + '1' };
    expect(spy).toHaveBeenCalledWith(INITIAL_STATE.value);
  });

  it('should write the value when the state value does not change but the id does after a new view value was reported', () => {
    const newValue = 'new value';
    onChange(newValue);
    const spy = spyOn(valueAccessor, 'writeValue');
    directive.ngrxFormControlState = { ...INITIAL_STATE, id: FORM_CONTROL_ID + '1', value: newValue };
    expect(spy).toHaveBeenCalledWith(newValue);
  });

  it('should write the value when the state value does not change but the id does after an undefined view value was reported', () => {
    const newValue = undefined as any;
    onChange(newValue);
    const spy = spyOn(valueAccessor, 'writeValue');
    directive.ngrxFormControlState = { ...INITIAL_STATE, id: FORM_CONTROL_ID + '1', value: newValue };
    expect(spy).toHaveBeenCalledWith(newValue);
  });

  it('should dispatch an action if the view value changes', done => {
    const newValue = 'new value';
    onChange(newValue);
    actions$.first().subscribe(a => {
      expect(a).toEqual(new SetValueAction(INITIAL_STATE.id, newValue));
      done();
    });
  });

  it('should not dispatch an action if the view value is the same as the state', done => {
    onChange(INITIAL_STATE.value);
    actionsSubject.complete();
    actions$.count().subscribe(c => {
      expect(c).toEqual(0);
      done();
    });
  });

  // TODO: throwing error on undefined state
  // TODO: value conversion
  // TODO: mark as touched
  // TODO: disabling and enabling
  // TODO: focus tracking
  // TODO: last keydown code tracking
});
