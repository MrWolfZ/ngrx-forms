import { ElementRef } from '@angular/core';
import { Action, ActionsSubject } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { count, first, skip } from 'rxjs/operators';

import { ControlValueAccessor } from '@angular/forms';
import { FocusAction, MarkAsDirtyAction, MarkAsTouchedAction, SetValueAction, UnfocusAction } from '../actions';
import { createFormControlState } from '../state';
import { FormViewAdapter } from '../view-adapter/view-adapter';
import { NGRX_UPDATE_ON_TYPE, NgrxFormControlDirective } from './directive';
import { NgrxValueConverters } from './value-converter';

// tslint:disable:no-unbound-method

describe(NgrxFormControlDirective.name, () => {
  let directive: NgrxFormControlDirective<string | null, any>;
  let elementRef: ElementRef;
  let nativeElement: HTMLElement;
  let document: Document;
  let actionsSubject: ReplaySubject<Action>;
  let actions$: Observable<Action>;
  let viewAdapter: Required<FormViewAdapter>;
  let onChange: (value: any) => void;
  let onTouched: () => void;
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = 'value';
  const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  beforeEach(() => {
    nativeElement = jasmine.createSpyObj('nativeElement', ['focus', 'blur']);
    elementRef = { nativeElement } as any as ElementRef;
    document = {} as any as Document;
    actionsSubject = new ReplaySubject<Action>();
    actions$ = actionsSubject as any; // required due to mismatch of lift() function signature
    viewAdapter = {
      setViewValue: () => void 0,
      setOnChangeCallback: fn => onChange = fn,
      setOnTouchedCallback: fn => onTouched = fn,
      setIsDisabled: () => void 0,
    };
    directive = new NgrxFormControlDirective<string | null>(elementRef, document, actionsSubject as any, [viewAdapter], []);
    directive.ngrxFormControlState = INITIAL_STATE;
  });

  it('should throw if the provided state is not defined', () => {
    expect(() => directive.ngrxFormControlState = undefined!).toThrowError();
  });

  it('should throw if state is not set when component is initialized', () => {
    directive = new NgrxFormControlDirective<string | null>(elementRef, document, actionsSubject as any, [viewAdapter], []);
    expect(() => directive.ngOnInit()).toThrowError();
  });

  it('should throw while trying to emit actions if no ActionsSubject was provided', () => {
    directive = new NgrxFormControlDirective<string | null>(elementRef, document, null as any as ActionsSubject, [viewAdapter], []);
    directive.ngrxFormControlState = INITIAL_STATE;
    directive.ngOnInit();
    const newValue = 'new value';
    expect(() => onChange(newValue)).toThrowError();
  });

  describe('writing values and dispatching value and dirty actions', () => {
    beforeEach(() => {
      directive.ngOnInit();
    });

    it('should write the value when the state changes', () => {
      const newValue = 'new value';
      const spy = spyOn(viewAdapter, 'setViewValue');
      directive.ngrxFormControlState = { ...INITIAL_STATE, value: newValue };
      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it('should not write the value when the state value does not change', () => {
      const spy = spyOn(viewAdapter, 'setViewValue');
      directive.ngrxFormControlState = INITIAL_STATE;
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not write the value when the state value is the same as the view value', () => {
      const newValue = 'new value';
      onChange(newValue);
      const spy = spyOn(viewAdapter, 'setViewValue');
      directive.ngrxFormControlState = { ...INITIAL_STATE, value: newValue };
      expect(spy).not.toHaveBeenCalled();
    });

    it('should write the value when the state value does not change but the id does', () => {
      const spy = spyOn(viewAdapter, 'setViewValue');
      directive.ngrxFormControlState = { ...INITIAL_STATE, id: `${FORM_CONTROL_ID}1` };
      expect(spy).toHaveBeenCalledWith(INITIAL_STATE.value);
    });

    it('should not throw if id changes and new state is disabled but adapter does not support disabling', () => {
      delete (viewAdapter as FormViewAdapter).setIsDisabled;
      expect(() => directive.ngrxFormControlState = { ...INITIAL_STATE, id: `${FORM_CONTROL_ID}1`, isDisabled: true, isEnabled: false }).not.toThrowError();
    });

    it('should write the value when the state value does not change but the id does after a new view value was reported', () => {
      const newValue = 'new value';
      onChange(newValue);
      const spy = spyOn(viewAdapter, 'setViewValue');
      directive.ngrxFormControlState = { ...INITIAL_STATE, id: `${FORM_CONTROL_ID}1`, value: newValue };
      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it('should write the value when the state value does not change but the id does after an undefined view value was reported', () => {
      const newValue = undefined as any;
      onChange(newValue);
      const spy = spyOn(viewAdapter, 'setViewValue');
      directive.ngrxFormControlState = { ...INITIAL_STATE, id: `${FORM_CONTROL_ID}1`, value: newValue };
      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it('should write the value after the view is initialized', () => {
      const newValue = 'new value';
      directive.ngrxFormControlState = { ...INITIAL_STATE, value: newValue };
      const spy = spyOn(viewAdapter, 'setViewValue');
      directive.ngAfterViewInit();
      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it('should not throw after the view is initialized and adapter does not support disabling', () => {
      delete (viewAdapter as FormViewAdapter).setIsDisabled;
      directive.ngrxFormControlState = { ...INITIAL_STATE, isDisabled: true, isEnabled: false };
      expect(() => directive.ngAfterViewInit()).not.toThrowError();
    });

    it(`should dispatch a ${SetValueAction.name} if the view value changes`, done => {
      const newValue = 'new value';

      actions$.pipe(first()).subscribe(a => {
        expect(a).toEqual(new SetValueAction(INITIAL_STATE.id, newValue));
        done();
      });

      onChange(newValue);
    });

    it(`should not dispatch a ${SetValueAction.name} if the view value is the same as the state`, done => {
      actions$.pipe(count()).subscribe(c => {
        expect(c).toEqual(0);
        done();
      });

      onChange(INITIAL_STATE.value);
      actionsSubject.complete();
    });

    it(`should dispatch a ${MarkAsDirtyAction.name} if the view value changes when the state is not marked as dirty`, done => {
      actions$.pipe(skip(1)).pipe(first()).subscribe(a => {
        expect(a).toEqual(new MarkAsDirtyAction(INITIAL_STATE.id));
        done();
      });

      const newValue = 'new value';
      onChange(newValue);
    });

    it(`should not dispatch a ${MarkAsDirtyAction.name} if the view value changes when the state is marked as dirty`, done => {
      actions$.pipe(count()).subscribe(c => {
        expect(c).toEqual(1);
        done();
      });

      directive.ngrxFormControlState = { ...INITIAL_STATE, isDirty: true, isPristine: false };
      const newValue = 'new value';
      onChange(newValue);
      actionsSubject.complete();
    });

    it('should write the value when the state changes to the same value that was reported from the view before', () => {
      const newValue = 'new value';
      onChange(newValue);
      directive.ngrxFormControlState = { ...INITIAL_STATE, value: newValue };
      directive.ngrxFormControlState = INITIAL_STATE;
      const spy = spyOn(viewAdapter, 'setViewValue');
      directive.ngrxFormControlState = { ...INITIAL_STATE, value: newValue };
      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it('should correctly set the initial values if a value converter is set after the initial state', () => {
      const convertedValue = ['A'];
      viewAdapter = {
        ...viewAdapter,
        setViewValue: v => expect(v).toEqual(convertedValue),
      };
      directive = new NgrxFormControlDirective<string | null>(elementRef, document, actionsSubject as any, [viewAdapter], []);
      directive.ngrxFormControlState = INITIAL_STATE;
      directive.ngrxValueConverter = {
        convertStateToViewValue: () => convertedValue,
        convertViewToStateValue: s => s,
      };
      directive.ngOnInit();
    });
  });

  describe('touch handling', () => {
    beforeEach(() => {
      directive.ngOnInit();
    });

    it(`should dispatch a ${MarkAsTouchedAction.name} if the view adapter notifies and the state is not touched`, done => {
      actions$.pipe(first()).subscribe(a => {
        expect(a).toEqual(new MarkAsTouchedAction(INITIAL_STATE.id));
        done();
      });

      onTouched();
      actionsSubject.complete();
    });

    it(`should not dispatch a ${MarkAsTouchedAction.name} if the view adapter notifies and the state is touched`, done => {
      actions$.pipe(count()).subscribe(i => {
        expect(i).toEqual(0);
        done();
      });

      directive.ngrxFormControlState = { ...INITIAL_STATE, isTouched: true, isUntouched: false };
      onTouched();
      actionsSubject.complete();
    });
  });

  describe('ngrxUpdateOn "blur"', () => {
    beforeEach(() => {
      directive.ngOnInit();
      directive.ngrxFormControlState = { ...INITIAL_STATE, isTouched: true, isUntouched: false };
      directive.ngrxUpdateOn = NGRX_UPDATE_ON_TYPE.BLUR;
    });

    it('should dispatch an action on blur if the view value has changed with ngrxUpdateOn "blur"', done => {
      const newValue = 'new value';

      actions$.pipe(first()).subscribe(a => {
        expect(a).toEqual(new SetValueAction(INITIAL_STATE.id, newValue));
        done();
      });

      onChange(newValue);
      onTouched();
    });

    it('should not dispatch an action on blur if the view value has not changed with ngrxUpdateOn "blur"', done => {
      actions$.pipe(count()).subscribe(c => {
        expect(c).toEqual(0);
        done();
      });

      onTouched();
      actionsSubject.complete();
    });

    it('should not dispatch an action if the view value changes with ngrxUpdateOn "blur"', done => {
      actions$.pipe(count()).subscribe(c => {
        expect(c).toEqual(0);
        done();
      });

      const newValue = 'new value';
      onChange(newValue);
      actionsSubject.complete();
    });

    it('should not write the value when the state value does not change', () => {
      const newValue = 'new value';
      onChange(newValue);
      const spy = spyOn(viewAdapter, 'setViewValue');
      directive.ngrxFormControlState = { ...INITIAL_STATE };
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('ngrxUpdateOn "never"', () => {
    beforeEach(() => {
      directive.ngOnInit();
      directive.ngrxUpdateOn = NGRX_UPDATE_ON_TYPE.NEVER;
    });

    it('should not dispatch any action even if the view value changed', done => {
      const newValue = 'new value';

      actions$.pipe(count()).subscribe(x => {
        expect(x).toEqual(0);
        done();
      });

      onChange(newValue);
      onTouched();
      actionsSubject.complete();
    });
  });

  describe('enabling/disabling', () => {
    beforeEach(() => {
      directive.ngOnInit();
    });

    it('should enable the state if disabled', () => {
      directive.ngrxFormControlState = { ...INITIAL_STATE, isEnabled: false, isDisabled: true };
      const spy = spyOn(viewAdapter, 'setIsDisabled');
      directive.ngrxFormControlState = { ...INITIAL_STATE };
      expect(spy).toHaveBeenCalledWith(false);
    });

    it('should not enable the state if enabled', () => {
      const spy = spyOn(viewAdapter, 'setIsDisabled');
      directive.ngrxFormControlState = { ...INITIAL_STATE };
      expect(spy).not.toHaveBeenCalled();
    });

    it('should disable the state if enabled', () => {
      const spy = spyOn(viewAdapter, 'setIsDisabled');
      directive.ngrxFormControlState = { ...INITIAL_STATE, isEnabled: false, isDisabled: true };
      expect(spy).toHaveBeenCalledWith(true);
    });

    it('should not disable the state if disabled', () => {
      directive.ngrxFormControlState = { ...INITIAL_STATE, isEnabled: false, isDisabled: true };
      const spy = spyOn(viewAdapter, 'setIsDisabled');
      directive.ngrxFormControlState = { ...INITIAL_STATE, isEnabled: false, isDisabled: true };
      expect(spy).not.toHaveBeenCalled();
    });

    it('should enable after the view is initialized', () => {
      directive.ngrxFormControlState = INITIAL_STATE;
      const spy = spyOn(viewAdapter, 'setIsDisabled');
      directive.ngAfterViewInit();
      expect(spy).toHaveBeenCalledWith(false);
    });

    it('should disable after the view is initialized', () => {
      directive.ngrxFormControlState = { ...INITIAL_STATE, isEnabled: false, isDisabled: true };
      const spy = spyOn(viewAdapter, 'setIsDisabled');
      directive.ngAfterViewInit();
      expect(spy).toHaveBeenCalledWith(true);
    });

    it('should not throw if setIsDisabled is not defined', () => {
      (viewAdapter as FormViewAdapter).setIsDisabled = undefined;
      expect(() => directive.ngrxFormControlState = { ...INITIAL_STATE, isEnabled: false, isDisabled: true }).not.toThrow();
    });
  });

  describe('value conversion', () => {
    const VIEW_VALUE = new Date(0);
    const STATE_VALUE = '1970-01-01T00:00:00.000Z';

    beforeEach(() => {
      directive.ngOnInit();
      directive.ngrxValueConverter = NgrxValueConverters.dateToISOString;
    });

    it('should convert the state value when the state changes', () => {
      const spy = spyOn(viewAdapter, 'setViewValue');
      directive.ngrxFormControlState = { ...INITIAL_STATE, value: STATE_VALUE };
      expect(spy).toHaveBeenCalledWith(VIEW_VALUE);
    });

    it('should convert the view value if it changes', done => {
      actions$.pipe(first()).subscribe(a => {
        expect(a).toEqual(new SetValueAction(INITIAL_STATE.id, STATE_VALUE));
        done();
      });

      onChange(VIEW_VALUE);
    });

    it('should not write the value when the state value does not change with conversion', () => {
      directive.ngrxFormControlState = { ...INITIAL_STATE, value: STATE_VALUE };
      const spy = spyOn(viewAdapter, 'setViewValue');
      directive.ngrxFormControlState = { ...INITIAL_STATE, value: STATE_VALUE };
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not dispatch an action if the view value is the same as the state with conversion', done => {
      actions$.pipe(count()).subscribe(c => {
        expect(c).toEqual(0);
        done();
      });

      directive.ngrxFormControlState = { ...INITIAL_STATE, value: STATE_VALUE };
      onChange(VIEW_VALUE);
      actionsSubject.complete();
    });
  });

  describe('focus tracking', () => {
    describe('is enabled', () => {
      beforeEach(() => {
        directive.ngrxEnableFocusTracking = true;
      });

      it('should focus the element if state is focused initially', () => {
        directive.ngrxFormControlState = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
        directive.ngOnInit();
        expect(nativeElement.focus).toHaveBeenCalled();
      });

      it('should blur the element if state is unfocused initially', () => {
        directive.ngOnInit();
        expect(nativeElement.blur).toHaveBeenCalled();
      });

      it('should focus the element if state becomes focused', () => {
        directive.ngOnInit();
        expect(nativeElement.focus).not.toHaveBeenCalled();
        directive.ngrxFormControlState = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
        expect(nativeElement.focus).toHaveBeenCalled();
      });

      it('should blur the element if state becomes unfocused', () => {
        directive.ngrxFormControlState = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
        directive.ngOnInit();
        expect(nativeElement.blur).not.toHaveBeenCalled();
        directive.ngrxFormControlState = INITIAL_STATE;
        expect(nativeElement.blur).toHaveBeenCalled();
      });

      it('should not focus the element if state is and was focused', () => {
        directive.ngOnInit();
        directive.ngrxFormControlState = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
        expect(nativeElement.focus).toHaveBeenCalledTimes(1);
        directive.ngrxFormControlState = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
        expect(nativeElement.focus).toHaveBeenCalledTimes(1);
      });

      it(`should dispatch a ${FocusAction} when element becomes focused and state is not focused`, done => {
        directive.ngOnInit();

        actions$.pipe(first()).subscribe(a => {
          expect(a).toEqual(new FocusAction(INITIAL_STATE.id));
          done();
        });

        (document as any).activeElement = nativeElement;
        directive.onFocusChange();
        actionsSubject.complete();
      });

      it('should not dispatch an action when element becomes focused and state is focused', done => {
        directive.ngOnInit();

        actions$.pipe(count()).subscribe(c => {
          expect(c).toEqual(0);
          done();
        });

        directive.ngrxFormControlState = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
        (document as any).activeElement = nativeElement;
        directive.onFocusChange();
        actionsSubject.complete();
      });

      it(`should dispatch an ${UnfocusAction} when element becomes unfocused and state is focused`, done => {
        directive.ngOnInit();

        actions$.pipe(first()).subscribe(a => {
          expect(a).toEqual(new UnfocusAction(INITIAL_STATE.id));
          done();
        });

        directive.ngrxFormControlState = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
        directive.onFocusChange();
        actionsSubject.complete();
      });

      it('should not dispatch an action when element becomes unfocused and state is unfocused', done => {
        directive.ngOnInit();

        actions$.pipe(count()).subscribe(c => {
          expect(c).toEqual(0);
          done();
        });

        directive.onFocusChange();
        actionsSubject.complete();
      });

      it('should add the cdk focus attribute if state is focused', () => {
        directive.ngOnInit();
        directive.ngrxFormControlState = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
        expect(directive.focusRegionStartAttr).toBe('');
      });

      it('should remove the cdk focus attribute if state is unfocused', () => {
        directive.ngOnInit();
        expect(directive.focusRegionStartAttr).toBe(null);
      });
    });

    describe('is disabled', () => {
      it('should not focus the element initially', () => {
        directive.ngrxFormControlState = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
        directive.ngOnInit();
        expect(nativeElement.focus).not.toHaveBeenCalled();
      });

      it('should not blur the element initially', () => {
        directive.ngOnInit();
        expect(nativeElement.blur).not.toHaveBeenCalled();
      });

      it('should not focus the element if state becomes focused', () => {
        directive.ngOnInit();
        directive.ngrxFormControlState = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
        expect(nativeElement.focus).not.toHaveBeenCalled();
      });

      it('should not blur the element if state becomes unfocused', () => {
        directive.ngrxFormControlState = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
        directive.ngOnInit();
        directive.ngrxFormControlState = INITIAL_STATE;
        expect(nativeElement.blur).not.toHaveBeenCalled();
      });

      it(`should not dispatch an action when element becomes focused and state is not focused`, done => {
        directive.ngOnInit();

        actions$.pipe(count()).subscribe(c => {
          expect(c).toEqual(0);
          done();
        });

        (document as any).activeElement = nativeElement;
        directive.onFocusChange();
        actionsSubject.complete();
      });

      it('should not dispatch an action when element becomes focused and state is focused', done => {
        directive.ngOnInit();

        actions$.pipe(count()).subscribe(c => {
          expect(c).toEqual(0);
          done();
        });

        directive.ngrxFormControlState = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
        (document as any).activeElement = nativeElement;
        directive.onFocusChange();
        actionsSubject.complete();
      });

      it(`should not dispatch an action when element becomes unfocused and state is focused`, done => {
        directive.ngOnInit();

        actions$.pipe(count()).subscribe(c => {
          expect(c).toEqual(0);
          done();
        });

        directive.ngrxFormControlState = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
        directive.onFocusChange();
        actionsSubject.complete();
      });

      it('should not dispatch an action when element becomes unfocused and state is unfocused', done => {
        directive.ngOnInit();

        actions$.pipe(count()).subscribe(c => {
          expect(c).toEqual(0);
          done();
        });

        directive.onFocusChange();
        actionsSubject.complete();
      });
    });
  });

  describe('non-browser platforms', () => {
    beforeEach(() => {
      directive = new NgrxFormControlDirective<string | null>(elementRef, null, actionsSubject as any, [viewAdapter], []);
      directive.ngrxFormControlState = INITIAL_STATE;
    });

    it('should throw when trying to enable focus tracking', () => {
      expect(() => directive.ngrxEnableFocusTracking = true).toThrowError();
    });
  });

  describe('ControlValueAccessor integration', () => {
    it('should adapt a control value accessor to a form view adapter if no form view adapter is provided', () => {
      const controlValueAccessor: ControlValueAccessor = jasmine.createSpyObj('controlValueAccessor', [
        'writeValue',
        'registerOnChange',
        'registerOnTouched',
        'setDisabledState',
      ]);

      directive = new NgrxFormControlDirective<string | null>(elementRef, document, actionsSubject as any, null as any, [controlValueAccessor]);

      directive.state = { ...INITIAL_STATE, isDisabled: true, isEnabled: false };
      directive.ngOnInit();
      expect(controlValueAccessor.writeValue).toHaveBeenCalledWith(INITIAL_STATE.value);
      expect(controlValueAccessor.setDisabledState).toHaveBeenCalledWith(true);
      expect(controlValueAccessor.registerOnChange).toHaveBeenCalled();
      expect(controlValueAccessor.registerOnTouched).toHaveBeenCalled();
    });

    it('should adapt a control value accessor without disabling support', () => {
      const controlValueAccessor: ControlValueAccessor = jasmine.createSpyObj('controlValueAccessor', [
        'writeValue',
        'registerOnChange',
        'registerOnTouched',
      ]);

      directive = new NgrxFormControlDirective<string | null>(elementRef, document, actionsSubject as any, null as any, [controlValueAccessor]);

      directive.state = { ...INITIAL_STATE, isDisabled: true, isEnabled: false };
      expect(() => directive.ngOnInit()).not.toThrow();
    });

    it('should throw if more than one control value accessor is provided', () => {
      expect(() => new NgrxFormControlDirective<string | null>(elementRef, document, actionsSubject as any, [], [{} as any, {} as any])).toThrowError();
    });
  });
});
