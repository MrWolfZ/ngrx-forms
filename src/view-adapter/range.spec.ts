import { Component, getDebugNode, Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgrxRangeViewAdapter } from './range';

const TEST_ID = 'test ID';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'range-test',
  template: `
<input type="range" [ngrxFormControlState]="state" />
`,
})
export class RangeTestComponent {
  state = { id: TEST_ID } as any;
}

describe(NgrxRangeViewAdapter.name, () => {
  let fixture: ComponentFixture<RangeTestComponent>;
  let viewAdapter: NgrxRangeViewAdapter;
  let element: HTMLInputElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NgrxRangeViewAdapter,
        RangeTestComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeTestComponent);
    fixture.detectChanges();
    element = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
    viewAdapter = getDebugNode(element)!.injector.get(NgrxRangeViewAdapter);
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

  it('should not set the ID of the element if the ID of the state does not change', () => {
    const renderer: Renderer2 = jasmine.createSpyObj('renderer', ['setProperty']);
    const nativeElement: any = {};
    viewAdapter = new NgrxRangeViewAdapter(renderer, { nativeElement } as any);
    viewAdapter.ngrxFormControlState = { id: TEST_ID } as any;
    expect(renderer.setProperty).toHaveBeenCalledTimes(1);
    nativeElement.id = TEST_ID;
    viewAdapter.ngrxFormControlState = { id: TEST_ID } as any;
    expect(renderer.setProperty).toHaveBeenCalledTimes(1);
  });

  it('should set the input\'s value', () => {
    const newValue = 10;
    viewAdapter.setViewValue(newValue);
    expect(element.value).toBe(newValue.toString());
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

  it('should call the registered function with null if value is empty string', () => {
    const spy = jasmine.createSpy('fn');
    viewAdapter.setOnChangeCallback(spy);
    viewAdapter.handleInput({ target: { value: '' } } as any);
    expect(spy).toHaveBeenCalledWith(null);
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

  it('should not throw if calling callbacks before they are registered', () => {
    expect(() => new NgrxRangeViewAdapter(undefined as any, undefined as any).onChange(undefined)).not.toThrowError();
    expect(() => new NgrxRangeViewAdapter(undefined as any, undefined as any).onTouched()).not.toThrowError();
  });
});
