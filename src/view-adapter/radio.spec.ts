import { Component, getDebugNode } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgrxRadioViewAdapter } from './radio';

const OPTION1_VALUE = 'op1';
const OPTION2_VALUE = 'op2';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'radio-test',
  template: `
<input type="radio" value="op1" ngrxFormControlState />
<input type="radio" value="op2" ngrxFormControlState />
`,
})
export class RadioTestComponent { }

describe(NgrxRadioViewAdapter.name, () => {
  let component: RadioTestComponent;
  let fixture: ComponentFixture<RadioTestComponent>;
  let valueAccessor: NgrxRadioViewAdapter;
  let element: HTMLInputElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NgrxRadioViewAdapter,
        RadioTestComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioTestComponent);
    component = fixture.componentInstance;
    element = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
    valueAccessor = getDebugNode(element)!.injector.get(NgrxRadioViewAdapter);
    fixture.detectChanges();
  });

  it('should attach the value accessor', () => expect(valueAccessor).toBeDefined());

  it('should mark the option as checked if same value is written', () => {
    valueAccessor.writeValue(OPTION1_VALUE);
    expect(element.checked).toBe(true);
  });

  it('should mark the option as unchecked if different value is written', () => {
    element.checked = true;
    valueAccessor.writeValue(OPTION2_VALUE);
    expect(element.checked).toBe(false);
  });

  it('should call the registered function whenever the value changes', () => {
    const spy = jasmine.createSpy('fn');
    valueAccessor.registerOnChange(spy);
    element.checked = true;
    element.dispatchEvent(new Event('change'));
    expect(spy).toHaveBeenCalledWith(OPTION1_VALUE);
  });

  it('should call the registered function whenever the input is blurred', () => {
    const spy = jasmine.createSpy('fn');
    valueAccessor.registerOnTouched(spy);
    element.dispatchEvent(new Event('blur'));
    expect(spy).toHaveBeenCalled();
  });

  it('should disable the input', () => {
    valueAccessor.setDisabledState(true);
    expect(element.disabled).toBe(true);
  });

  it('should enable the input', () => {
    element.disabled = true;
    valueAccessor.setDisabledState(false);
    expect(element.disabled).toBe(false);
  });
});
