import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, getDebugNode } from '@angular/core';
import { ActionsSubject, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/skip';

import { FormControlState, createFormControlState } from '../../state';
import { SetValueAction } from '../../actions';
import { NgrxFormsModule } from '../../module';
import { NgrxSelectControlValueAccessor } from '../../value-accessors';

const SELECT_OPTIONS = ['op1', 'op2'];

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'select-test',
  template: '<select [ngrxFormControlState]="state"><option *ngFor="let o of options" [value]="o">{{o}}</option></select>',
})
export class SelectComponent {
  @Input() state: FormControlState<string>;
  options = SELECT_OPTIONS;
}

describe(SelectComponent.name, () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
  let valueAccessor: NgrxSelectControlValueAccessor;
  let actionsSubject: ActionsSubject;
  let actions$: Observable<Action>;
  let element: HTMLSelectElement;
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = SELECT_OPTIONS[1];
  const INITIAL_STATE = createFormControlState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  beforeEach(() => {
    actionsSubject = new BehaviorSubject<Action>({ type: '' }) as ActionsSubject;
    actions$ = actionsSubject as Observable<Action>; // cast required due to mismatch of lift() function signature
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgrxFormsModule],
      declarations: [SelectComponent],
      providers: [{ provide: ActionsSubject, useValue: actionsSubject }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    component.state = INITIAL_STATE;
    element = (fixture.nativeElement as HTMLElement).querySelector('select') as HTMLSelectElement;
    valueAccessor = getDebugNode(element)!.injector.get(NgrxSelectControlValueAccessor);
    fixture.detectChanges();
  });

  it('should select the correct option initially', () => {
    expect(valueAccessor.value).toBe(INITIAL_FORM_CONTROL_VALUE);
  });

  it('should trigger a SetValueAction with the selected value when an option is selected', done => {
    const newValue = SELECT_OPTIONS[0];
    element.value = newValue;
    element.dispatchEvent(new Event('change'));
    actions$.first().subscribe(a => {
      expect(a.type).toBe(SetValueAction.TYPE);
      expect((a as SetValueAction<string>).payload.value).toBe(newValue);
      done();
    });
  });
});

const SELECT_NUMBER_OPTIONS = [1, 2];

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'select-test',
  template: '<select [ngrxFormControlState]="state"><option *ngFor="let o of options" [ngValue]="o">{{o}}</option></select>',
})
export class NgValueSelectComponent {
  @Input() state: FormControlState<number>;
  options = SELECT_NUMBER_OPTIONS;
}

describe(NgValueSelectComponent.name, () => {
  let component: NgValueSelectComponent;
  let fixture: ComponentFixture<NgValueSelectComponent>;
  let valueAccessor: NgrxSelectControlValueAccessor;
  let actionsSubject: ActionsSubject;
  let actions$: Observable<Action>;
  let element: HTMLSelectElement;
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = SELECT_NUMBER_OPTIONS[1];
  const INITIAL_STATE = createFormControlState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  beforeEach(() => {
    actionsSubject = new BehaviorSubject<Action>({ type: '' }) as ActionsSubject;
    actions$ = actionsSubject as Observable<Action>; // cast required due to mismatch of lift() function signature
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgrxFormsModule],
      declarations: [NgValueSelectComponent],
      providers: [{ provide: ActionsSubject, useValue: actionsSubject }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgValueSelectComponent);
    component = fixture.componentInstance;
    component.state = INITIAL_STATE;
    element = (fixture.nativeElement as HTMLElement).querySelector('select') as HTMLSelectElement;
    valueAccessor = getDebugNode(element)!.injector.get(NgrxSelectControlValueAccessor);
    fixture.detectChanges();
  });

  it('should select the correct option initially', () => {
    expect(valueAccessor.value).toBe(INITIAL_FORM_CONTROL_VALUE);
  });

  it('should trigger a SetValueAction with the selected value when an option is selected', done => {
    const newValue = SELECT_NUMBER_OPTIONS[0];
    element.selectedIndex = 0;
    element.dispatchEvent(new Event('change'));
    actions$.first().subscribe(a => {
      expect(a.type).toBe(SetValueAction.TYPE);
      expect((a as SetValueAction<number>).payload.value).toBe(newValue);
      done();
    });
  });
});
