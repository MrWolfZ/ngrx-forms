import { Component, getDebugNode } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgrxDefaultViewAdapter } from './default';

const TEST_ID = 'test ID';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'default-test',
  template: `
<input type="text" [ngrxFormControlState]="state" />
`,
})
export class DefaultInputTestComponent {
  state = { id: TEST_ID } as any;
}

describe(NgrxDefaultViewAdapter.name, () => {
  let fixture: ComponentFixture<DefaultInputTestComponent>;
  let viewAdapter: NgrxDefaultViewAdapter;
  let element: HTMLInputElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NgrxDefaultViewAdapter,
        DefaultInputTestComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultInputTestComponent);
    fixture.detectChanges();
    element = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
    viewAdapter = getDebugNode(element)!.injector.get(NgrxDefaultViewAdapter);
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
    const newValue = 'new value';
    viewAdapter.setViewValue(newValue);
    expect(element.value).toBe(newValue);
  });

  it('should set the input\'s value to empty string if null', () => {
    viewAdapter.setViewValue(null);
    expect(element.value).toBe('');
  });

  it('should call the registered function whenever the value changes', () => {
    const spy = jasmine.createSpy('fn');
    viewAdapter.setOnChangeCallback(spy);
    const newValue = 'new value';
    element.value = newValue;
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

  it('should throw if state is undefined', () => {
    expect(() => viewAdapter.ngrxFormControlState = undefined as any).toThrowError();
  });
});
