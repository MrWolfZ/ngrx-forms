import { Component, getDebugNode } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgrxNumberViewAdapter } from './number';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'number-test',
  template: `
<input type="number" ngrxFormControlState />
`,
})
export class NumberTestComponent { }

describe(NgrxNumberViewAdapter.name, () => {
  let component: NumberTestComponent;
  let fixture: ComponentFixture<NumberTestComponent>;
  let viewAdapter: NgrxNumberViewAdapter;
  let element: HTMLInputElement;

  const TEST_ID = 'test ID';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NgrxNumberViewAdapter,
        NumberTestComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    element = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
    viewAdapter = getDebugNode(element)!.injector.get(NgrxNumberViewAdapter);
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

  it('should set the input\'s value', () => {
    const newValue = 10;
    viewAdapter.setViewValue(newValue);
    expect(element.value).toBe(newValue.toString());
  });

  it('should set the input\'s value to empty string if null', () => {
    viewAdapter.setViewValue(null);
    expect(element.value).toBe('');
  });

  it('should call the registered function whenever the value changes with a change event', () => {
    const spy = jasmine.createSpy('fn');
    viewAdapter.setOnChangeCallback(spy);
    const newValue = 100;
    element.value = newValue.toString();
    element.dispatchEvent(new Event('change'));
    expect(spy).toHaveBeenCalledWith(newValue);
  });

  it('should call the registered function whenever the value changes with an input event', () => {
    const spy = jasmine.createSpy('fn');
    viewAdapter.setOnChangeCallback(spy);
    const newValue = 100;
    element.value = newValue.toString();
    element.dispatchEvent(new Event('input'));
    expect(spy).toHaveBeenCalledWith(newValue);
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
