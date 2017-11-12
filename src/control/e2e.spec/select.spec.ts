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
  let option1: HTMLOptionElement;
  let option2: HTMLOptionElement;
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
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;
    element = nativeElement.querySelector('select') as HTMLSelectElement;
    option1 = nativeElement.querySelectorAll('option')[0] as HTMLOptionElement;
    option2 = nativeElement.querySelectorAll('option')[1] as HTMLOptionElement;
    valueAccessor = getDebugNode(element)!.injector.get(NgrxSelectControlValueAccessor);
  });

  it('should select the correct option initially', () => {
    expect(option2.selected).toBe(true);
  });

  it('should trigger a SetValueAction with the selected value when an option is selected', done => {
    element.selectedIndex = 0;
    element.dispatchEvent(new Event('change'));
    actions$.first().subscribe(a => {
      expect(a.type).toBe(SetValueAction.TYPE);
      expect((a as SetValueAction<string>).payload.value).toBe(SELECT_OPTIONS[0]);
      done();
    });
  });
});

const SELECT_NUMBER_OPTIONS = [1, 2];

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'select-test',
  template: '<select [ngrxFormControlState]="state"><option *ngFor="let o of options" [value]="o">{{o}}</option></select>',
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
  let option1: HTMLOptionElement;
  let option2: HTMLOptionElement;
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
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;
    element = nativeElement.querySelector('select') as HTMLSelectElement;
    option1 = element.querySelectorAll('option')[0] as HTMLOptionElement;
    option2 = element.querySelectorAll('option')[1] as HTMLOptionElement;
    valueAccessor = getDebugNode(element)!.injector.get(NgrxSelectControlValueAccessor);
  });

  it('should select the correct option initially', () => {
    expect(option2.selected).toBe(true);
  });

  it('should trigger a SetValueAction with the selected value when an option is selected', done => {
    element.selectedIndex = 0;
    element.dispatchEvent(new Event('change'));
    actions$.first().subscribe(a => {
      expect(a.type).toBe(SetValueAction.TYPE);
      expect((a as SetValueAction<number>).payload.value).toBe(SELECT_NUMBER_OPTIONS[0]);
      done();
    });
  });
});
