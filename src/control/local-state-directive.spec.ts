import { ElementRef } from '@angular/core';
import { Action } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { count, first } from 'rxjs/operators';

import { SetValueAction } from '../actions';
import { createFormControlState } from '../state';
import { FormViewAdapter } from '../view-adapter/view-adapter';
import { NgrxLocalFormControlDirective } from './local-state-directive';

// tslint:disable:no-unbound-method

describe(NgrxLocalFormControlDirective.name, () => {
  let directive: NgrxLocalFormControlDirective<string | null, any>;
  let elementRef: ElementRef;
  let nativeElement: HTMLElement;
  let document: Document;
  let actionsSubject: ReplaySubject<Action>;
  let actions$: Observable<Action>;
  let viewAdapter: FormViewAdapter;
  let onChange: (value: any) => void;
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
      setOnTouchedCallback: () => void 0,
      setIsDisabled: () => void 0,
    };
    directive = new NgrxLocalFormControlDirective<string | null>(elementRef, document, [viewAdapter], []);
    directive.ngrxFormControlState = INITIAL_STATE;
  });

  describe('local action emit', () => {
    beforeEach(() => {
      directive.ngOnInit();
    });

    it(`should not dispatch a ${SetValueAction.name} to the global store if the view value changes`, done => {
      const newValue = 'new value';

      actions$.pipe(count()).subscribe(c => {
        expect(c).toEqual(0);
        done();
      });

      onChange(newValue);
      actionsSubject.complete();
    });

    it(`should dispatch a ${SetValueAction.name} to the output event emitter if the view value changes`, done => {
      const newValue = 'new value';

      directive.ngrxFormsAction.pipe(first()).subscribe(a => {
        expect(a).toEqual(new SetValueAction(INITIAL_STATE.id, newValue));
        done();
      });

      onChange(newValue);
    });

    it(`should not dispatch a ${SetValueAction.name} to the global store if the view value is the same as the state`, done => {
      actions$.pipe(count()).subscribe(c => {
        expect(c).toEqual(0);
        done();
      });

      onChange(INITIAL_STATE.value);
      actionsSubject.complete();
    });

    it(`should not dispatch a ${SetValueAction.name} to the output event emitter if the view value is the same as the state`, done => {
      directive.ngrxFormsAction.pipe(count()).subscribe(c => {
        expect(c).toEqual(0);
        done();
      });

      onChange(INITIAL_STATE.value);
      directive.ngrxFormsAction.complete();
    });
  });
});
