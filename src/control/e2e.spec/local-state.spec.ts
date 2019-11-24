import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Action, ActionsSubject } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { count } from 'rxjs/operators';

import { MarkAsDirtyAction } from '../../actions';
import { NgrxFormsModule } from '../../module';
import { createFormControlState, FormControlState } from '../../state';

const SELECT_NUMBER_OPTIONS = [1, 2];

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'select-test',
  template: `
  <select [ngrxFormControlState]="state" (ngrxFormsAction)="handleAction($event)">
    <option *ngFor="let o of options" [value]="o">{{ o }}</option>
  </select>`,
})
export class NumberSelectComponentLocalStateComponent {
  @Input() state: FormControlState<number>;
  options = SELECT_NUMBER_OPTIONS;

  action: Action | null = null;
  handleAction(actionParam: Action) {
    this.action = actionParam;
  }
}

describe(NumberSelectComponentLocalStateComponent.name, () => {
  let component: NumberSelectComponentLocalStateComponent;
  let fixture: ComponentFixture<NumberSelectComponentLocalStateComponent>;
  let actionsSubject: ActionsSubject;
  let actions$: Observable<Action>;
  let element: HTMLSelectElement;
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = SELECT_NUMBER_OPTIONS[1];
  const INITIAL_STATE = createFormControlState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  beforeEach(() => {
    actionsSubject = new Subject<Action>() as ActionsSubject;
    actions$ = actionsSubject as Observable<Action>; // cast required due to mismatch of lift() function signature
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgrxFormsModule],
      declarations: [NumberSelectComponentLocalStateComponent],
      providers: [{ provide: ActionsSubject, useValue: actionsSubject }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberSelectComponentLocalStateComponent);
    component = fixture.componentInstance;
    component.state = INITIAL_STATE;
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;
    element = nativeElement.querySelector('select')!;
  });

  it(`should not trigger a ${MarkAsDirtyAction.name} to the global store when an option is selected`, done => {
    actions$.pipe(count()).subscribe(c => {
      expect(c).toEqual(0);
      done();
    });

    element.selectedIndex = 0;
    element.dispatchEvent(new Event('change'));
    actionsSubject.complete();
  });

  it(`should trigger a ${MarkAsDirtyAction.name} to the event emitter when an option is selected`, () => {
    element.selectedIndex = 0;
    element.dispatchEvent(new Event('change'));

    expect(component.action).toBeTruthy();
    expect(component.action!.type).toBe(MarkAsDirtyAction.TYPE);
  });
});
