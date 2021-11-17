import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Action, ActionsSubject } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { first, skip } from 'rxjs/operators';

import { MarkAsDirtyAction, SetValueAction } from '../../actions';
import { NgrxFormsModule } from '../../module';
import { createFormControlState, FormControlState } from '../../state';

const SELECT_OPTIONS = ['op1', 'op2'];

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'select-test',
  template: '<select [ngrxFormControlState]="state"><option *ngFor="let o of options" [value]="o">{{ o }}</option></select>',
})
export class SelectComponent {
  @Input() state: FormControlState<string>;
  options = SELECT_OPTIONS;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'select-test-fallback',
  template: '<select><option *ngFor="let o of options" [value]="o">{{ o }} Label</option></select>',
})
export class SelectFallbackComponent {
  options = SELECT_OPTIONS;
}

describe(SelectComponent.name, () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
  let actionsSubject: ActionsSubject;
  let actions$: Observable<Action>;
  let element: HTMLSelectElement;
  let option1: HTMLOptionElement;
  let option2: HTMLOptionElement;
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = SELECT_OPTIONS[1];
  const INITIAL_STATE = createFormControlState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  beforeEach(() => {
    actionsSubject = new Subject<Action>() as ActionsSubject;
    actions$ = actionsSubject as Observable<Action>; // cast required due to mismatch of lift() function signature
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NgrxFormsModule],
      declarations: [SelectComponent, SelectFallbackComponent],
      providers: [{ provide: ActionsSubject, useValue: actionsSubject }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    component.state = INITIAL_STATE;
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;
    element = nativeElement.querySelector('select')!;
    option2 = nativeElement.querySelectorAll('option')[1];
  });

  it('should select the correct option initially', () => {
    expect(option2.selected).toBe(true);
  });

  it(`should trigger a ${SetValueAction.name} with the selected value when an option is selected`, done => {
    actions$.pipe(first()).subscribe(a => {
      expect(a.type).toBe(SetValueAction.TYPE);
      expect((a as SetValueAction<string>).value).toBe(SELECT_OPTIONS[0]);
      done();
    });

    element.selectedIndex = 0;
    element.dispatchEvent(new Event('change'));
  });

  it(`should trigger a ${MarkAsDirtyAction.name} when an option is selected`, done => {
    actions$.pipe(skip(1), first()).subscribe(a => {
      expect(a.type).toBe(MarkAsDirtyAction.TYPE);
      done();
    });

    element.selectedIndex = 0;
    element.dispatchEvent(new Event('change'));
  });

  it('should set the value attribute for options without associated form state', () => {
    const fallbackFixture = TestBed.createComponent(SelectFallbackComponent);
    fallbackFixture.detectChanges();
    const nativeElement = fallbackFixture.nativeElement as HTMLElement;
    element = nativeElement.querySelector('select')!;
    option1 = nativeElement.querySelectorAll('option')[0];
    option2 = nativeElement.querySelectorAll('option')[1];
    expect(option1.value).toBe(SELECT_OPTIONS[0]);
    expect(option2.value).toBe(SELECT_OPTIONS[1]);
  });
});

const SELECT_NUMBER_OPTIONS = [1, 2];

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'select-test',
  template: '<select [ngrxFormControlState]="state"><option *ngFor="let o of options" [value]="o">{{ o }}</option></select>',
})
export class NumberSelectComponent {
  @Input() state: FormControlState<number>;
  options = SELECT_NUMBER_OPTIONS;
}

describe(NumberSelectComponent.name, () => {
  let component: NumberSelectComponent;
  let fixture: ComponentFixture<NumberSelectComponent>;
  let actionsSubject: ActionsSubject;
  let actions$: Observable<Action>;
  let element: HTMLSelectElement;
  let option2: HTMLOptionElement;
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = SELECT_NUMBER_OPTIONS[1];
  const INITIAL_STATE = createFormControlState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  beforeEach(() => {
    actionsSubject = new Subject<Action>() as ActionsSubject;
    actions$ = actionsSubject as Observable<Action>; // cast required due to mismatch of lift() function signature
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NgrxFormsModule],
      declarations: [NumberSelectComponent],
      providers: [{ provide: ActionsSubject, useValue: actionsSubject }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberSelectComponent);
    component = fixture.componentInstance;
    component.state = INITIAL_STATE;
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;
    element = nativeElement.querySelector('select')!;
    option2 = element.querySelectorAll('option')[1];
  });

  it('should select the correct option initially', () => {
    expect(option2.selected).toBe(true);
  });

  it(`should trigger a ${SetValueAction.name} with the selected value when an option is selected`, done => {
    actions$.pipe(first()).subscribe(a => {
      expect(a.type).toBe(SetValueAction.TYPE);
      expect((a as SetValueAction<number>).value).toBe(SELECT_NUMBER_OPTIONS[0]);
      done();
    });

    element.selectedIndex = 0;
    element.dispatchEvent(new Event('change'));
  });

  it(`should trigger a ${MarkAsDirtyAction.name} when an option is selected`, done => {
    actions$.pipe(skip(1), first()).subscribe(a => {
      expect(a.type).toBe(MarkAsDirtyAction.TYPE);
      done();
    });

    element.selectedIndex = 0;
    element.dispatchEvent(new Event('change'));
  });
});
