// import { Component, Input } from '@angular/core';
// import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
// import { Action, ActionsSubject } from '@ngrx/store';
// import { Observable, Subject } from 'rxjs';
// import { first, skip } from 'rxjs/operators';

// import { MarkAsDirtyAction, SetValueAction } from '../../actions';
// import { NgrxValueConverters } from '../../control/value-converter';
// import { NgrxFormsModule } from '../../module';
// import { createFormControlState, FormControlState } from '../../state';

// const SELECT_OPTIONS = ['op1', 'op2'];

// @Component({
//   // tslint:disable-next-line:component-selector
//   selector: 'select-multiple-test',
//   template: `
//   <select multiple [ngrxFormControlState]="state" [ngrxValueConverter]="valueConverter">
//     <option *ngFor="let o of options" [value]="o">{{ o }}</option>
//   </select>
//   `,
// })
// export class SelectMultipleComponent {
//   @Input() state: FormControlState<string>;
//   options = SELECT_OPTIONS;
//   valueConverter = NgrxValueConverters.objectToJSON;
// }

// describe(SelectMultipleComponent.name, () => {
//   let component: SelectMultipleComponent;
//   let fixture: ComponentFixture<SelectMultipleComponent>;
//   let actionsSubject: ActionsSubject;
//   let actions$: Observable<Action>;
//   let element: HTMLSelectElement;
//   let option1: HTMLOptionElement;
//   let option2: HTMLOptionElement;
//   const FORM_CONTROL_ID = 'test ID';
//   const INITIAL_FORM_CONTROL_VALUE = `["${SELECT_OPTIONS[1]}"]`;
//   const INITIAL_STATE = createFormControlState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

//   beforeEach(() => {
//     actionsSubject = new Subject<Action>() as ActionsSubject;
//     actions$ = actionsSubject as Observable<Action>; // cast required due to mismatch of lift() function signature
//   });

//   beforeEach(waitForAsync(() => {
//     TestBed.configureTestingModule({
//       imports: [NgrxFormsModule],
//       declarations: [SelectMultipleComponent],
//       providers: [{ provide: ActionsSubject, useValue: actionsSubject }],
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SelectMultipleComponent);
//     component = fixture.componentInstance;
//     component.state = INITIAL_STATE;
//     fixture.detectChanges();
//     const nativeElement = fixture.nativeElement as HTMLElement;
//     element = nativeElement.querySelector('select')!;
//     option1 = nativeElement.querySelectorAll('option')[0];
//     option2 = nativeElement.querySelectorAll('option')[1];
//   });

//   it('should select the correct option initially', () => {
//     expect(option2.selected).toBe(true);
//   });

//   it('should trigger a SetValueAction with the selected value when an option is selected', done => {
//     actions$.pipe(first()).subscribe(a => {
//       expect(a.type).toBe(SetValueAction.TYPE);
//       expect((a as SetValueAction<string>).value).toBe(JSON.stringify(SELECT_OPTIONS));
//       done();
//     });

//     option1.selected = true;
//     element.dispatchEvent(new Event('change'));
//   });

//   it(`should trigger a ${MarkAsDirtyAction.name} when an option is selected`, done => {
//     actions$.pipe(skip(1), first()).subscribe(a => {
//       expect(a.type).toBe(MarkAsDirtyAction.TYPE);
//       done();
//     });

//     option1.selected = true;
//     element.dispatchEvent(new Event('change'));
//   });
// });

// @Component({
//   // tslint:disable-next-line:component-selector
//   selector: 'select-multiple-test',
//   template: `
//   <select multiple [ngrxFormControlState]="state">
//     <option *ngFor="let o of options" [value]="o">{{ o }}</option>
//   </select>
//   `,
// })
// export class SelectMultipleWithoutConverterComponent {
//   @Input() state: FormControlState<string[]>;
//   options = SELECT_OPTIONS;
// }

// describe(SelectMultipleWithoutConverterComponent.name, () => {
//   let component: SelectMultipleWithoutConverterComponent;
//   let fixture: ComponentFixture<SelectMultipleWithoutConverterComponent>;
//   let actionsSubject: ActionsSubject;
//   let actions$: Observable<Action>;
//   let element: HTMLSelectElement;
//   let option1: HTMLOptionElement;
//   let option2: HTMLOptionElement;
//   const FORM_CONTROL_ID = 'test ID';
//   const INITIAL_FORM_CONTROL_VALUE = [SELECT_OPTIONS[1]];
//   const INITIAL_STATE = createFormControlState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

//   beforeEach(() => {
//     actionsSubject = new Subject<Action>() as ActionsSubject;
//     actions$ = actionsSubject as Observable<Action>; // cast required due to mismatch of lift() function signature
//   });

//   beforeEach(waitForAsync(() => {
//     TestBed.configureTestingModule({
//       imports: [NgrxFormsModule],
//       declarations: [SelectMultipleWithoutConverterComponent],
//       providers: [{ provide: ActionsSubject, useValue: actionsSubject }],
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SelectMultipleWithoutConverterComponent);
//     component = fixture.componentInstance;
//     component.state = INITIAL_STATE;
//     fixture.detectChanges();
//     const nativeElement = fixture.nativeElement as HTMLElement;
//     element = nativeElement.querySelector('select')!;
//     option1 = nativeElement.querySelectorAll('option')[0];
//     option2 = nativeElement.querySelectorAll('option')[1];
//   });

//   it('should select the correct option initially', () => {
//     expect(option2.selected).toBe(true);
//   });

//   it('should trigger a SetValueAction with the selected value when an option is selected', done => {
//     actions$.pipe(first()).subscribe(a => {
//       expect(a.type).toBe(SetValueAction.TYPE);
//       expect((a as SetValueAction<string[]>).value).toEqual(SELECT_OPTIONS);
//       done();
//     });

//     option1.selected = true;
//     element.dispatchEvent(new Event('change'));
//   });

//   it(`should trigger a ${MarkAsDirtyAction.name} when an option is selected`, done => {
//     actions$.pipe(skip(1), first()).subscribe(a => {
//       expect(a.type).toBe(MarkAsDirtyAction.TYPE);
//       done();
//     });

//     option1.selected = true;
//     element.dispatchEvent(new Event('change'));
//   });
// });
