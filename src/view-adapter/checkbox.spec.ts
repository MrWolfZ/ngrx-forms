import { Component, getDebugNode } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgrxCheckboxViewAdapter } from './checkbox';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'checkbox-test',
  template: `
<input type="checkbox" ngrxFormControlState />
`,
})
export class CheckboxTestComponent { }

describe(NgrxCheckboxViewAdapter.name, () => {
  let component: CheckboxTestComponent;
  let fixture: ComponentFixture<CheckboxTestComponent>;
  let viewAdapter: NgrxCheckboxViewAdapter;
  let element: HTMLInputElement;

  const TEST_ID = 'test ID';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NgrxCheckboxViewAdapter,
        CheckboxTestComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    element = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
    viewAdapter = getDebugNode(element)!.injector.get(NgrxCheckboxViewAdapter);
    viewAdapter.ngrxFormControlState = { id: TEST_ID } as any;
    fixture.detectChanges();
  });

  it('should attach the view adapter', () => expect(viewAdapter).toBeDefined());

  it('should set the ID of the element to the ID of the state', () => {
    expect(element.id).toBe(TEST_ID);
  });

  it('should set the ID of the element if the ID of the state changes', () => {
    const newId = 'new ID';
    viewAdapter.ngrxFormControlState = { id: newId } as any;
    fixture.detectChanges();
    expect(element.id).toBe(newId);
  });

  it('should mark the input as checked', () => {
    const newValue = true;
    viewAdapter.setViewValue(newValue);
    expect(element.checked).toBe(newValue);
  });

  it('should call the registered function whenever the checkbox is checked', () => {
    const spy = jasmine.createSpy('fn');
    viewAdapter.setOnChangeCallback(spy);
    element.checked = true;
    element.dispatchEvent(new Event('change'));
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should call the registered function whenever the checkbox is unchecked', () => {
    element.checked = true;
    element.dispatchEvent(new Event('change'));
    const spy = jasmine.createSpy('fn');
    viewAdapter.setOnChangeCallback(spy);
    element.checked = false;
    element.dispatchEvent(new Event('change'));
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should call the registered function whenever the input is blurred', () => {
    const spy = jasmine.createSpy('fn');
    viewAdapter.setOnTouchedCallback(spy);
    element.dispatchEvent(new Event('blur'));
    expect(spy).toHaveBeenCalled();
  });

  it('should disable the input', () => {
    viewAdapter.setIsDisabled(true);
    expect(element.disabled).toBe(true);
  });

  it('should enable the input', () => {
    element.disabled = true;
    viewAdapter.setIsDisabled(false);
    expect(element.disabled).toBe(false);
  });
});
