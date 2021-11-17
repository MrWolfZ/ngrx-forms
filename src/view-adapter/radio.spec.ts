import { Component, getDebugNode, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgrxRadioViewAdapter } from './radio';

const TEST_ID = 'test ID';

const OPTION1_VALUE = 'op1';
const OPTION2_VALUE = 'op2';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'radio-test',
  template: `
<input type="radio" value="op1" [ngrxFormControlState]="state" />
<input type="radio" value="op2" checked="checked" [ngrxFormControlState]="state" />

<input type="radio" value="op1" [ngrxFormControlState]="state" name="customName" />
<input type="radio" value="op1" [ngrxFormControlState]="state" [name]="boundName" />

<input type="radio" *ngFor="let o of stringOptions; trackBy: trackByIndex" [value]="o" [ngrxFormControlState]="state" />

<input type="radio" *ngFor="let o of numberOptions; trackBy: trackByIndex" [value]="o" [ngrxFormControlState]="state" />

<input type="radio" *ngFor="let o of booleanOptions; trackBy: trackByIndex" [value]="o" [ngrxFormControlState]="state" />
`,
})
export class RadioTestComponent {
  boundName = 'boundName';
  stringOptions = ['op1', 'op2'];
  numberOptions = [1, 2];
  booleanOptions = [true, false];
  state = { id: TEST_ID } as any;
  trackByIndex = (index: number) => index;
}

describe(NgrxRadioViewAdapter.name, () => {
  let component: RadioTestComponent;
  let fixture: ComponentFixture<RadioTestComponent>;
  let viewAdapter1: NgrxRadioViewAdapter;
  let viewAdapter2: NgrxRadioViewAdapter;
  let element1: HTMLInputElement;
  let element2: HTMLInputElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        NgrxRadioViewAdapter,
        RadioTestComponent,
      ],
    }).compileComponents();
  }));

  describe('static options', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(RadioTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      element1 = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[0];
      element2 = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[1];
      viewAdapter1 = getDebugNode(element1)!.injector.get<NgrxRadioViewAdapter>(NgrxRadioViewAdapter);
      viewAdapter2 = getDebugNode(element2)!.injector.get<NgrxRadioViewAdapter>(NgrxRadioViewAdapter);
    });

    it('should attach the view adapter', () => expect(viewAdapter1).toBeDefined());

    it('should set the name of the elements to the ID of the state if the name is not already set', () => {
      expect(element1.name).toBe(TEST_ID);
      expect(element2.name).toBe(TEST_ID);
    });

    it('should not set the name of the element to the ID of the state if the name is set in template manually', () => {
      const element = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[2];
      expect(element.name).toBe('customName');
    });

    it('should not set the name of the element to the ID of the state if the name is set in template via binding', () => {
      const element = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[3];
      expect(element.name).toBe(component.boundName);
    });

    it('should set the name of the elements when the state\'s ID changes and the name was set previously', () => {
      const newId = 'new ID';
      viewAdapter1.ngrxFormControlState = { id: newId } as any;
      viewAdapter2.ngrxFormControlState = { id: newId } as any;
      fixture.detectChanges();
      expect(element1.name).toBe(newId);
      expect(element2.name).toBe(newId);
    });

    it('should not set the name of the elements when the state\'s ID changes and the name was not set previously due to manual value', () => {
      const element = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[2];
      const viewAdapter = getDebugNode(element)!.injector.get<NgrxRadioViewAdapter>(NgrxRadioViewAdapter);
      const newId = 'new ID';
      viewAdapter.ngrxFormControlState = { id: newId } as any;
      fixture.detectChanges();
      expect(element.name).toBe('customName');
    });

    it('should not set the name of the elements when the state\'s ID changes and the name was not set previously due to other binding', () => {
      const element = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[3];
      const viewAdapter = getDebugNode(element)!.injector.get<NgrxRadioViewAdapter>(NgrxRadioViewAdapter);
      const newId = 'new ID';
      viewAdapter.ngrxFormControlState = { id: newId } as any;
      fixture.detectChanges();
      expect(element.name).toBe(component.boundName);
    });

    it('should not set the name of the elements if the ID of the state does not change', () => {
      const renderer: Renderer2 = jasmine.createSpyObj('renderer', ['setProperty']);
      const nativeElement: any = {};
      const viewAdapter = new NgrxRadioViewAdapter(renderer, { nativeElement } as any);
      viewAdapter.ngrxFormControlState = { id: TEST_ID } as any;
      viewAdapter.ngAfterViewInit();
      expect(renderer.setProperty).toHaveBeenCalledTimes(1);
      nativeElement.name = TEST_ID;
      viewAdapter.ngrxFormControlState = { id: TEST_ID } as any;
      expect(renderer.setProperty).toHaveBeenCalledTimes(1);
    });

    it('should mark the option as checked if same value is written', () => {
      viewAdapter1.setViewValue(OPTION1_VALUE);
      expect(element1.checked).toBe(true);
    });

    it('should mark the option as unchecked if different value is written', () => {
      element1.checked = true;
      viewAdapter1.setViewValue(OPTION2_VALUE);
      expect(element1.checked).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter1.setOnChangeCallback(spy);
      element1.checked = true;
      element1.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(OPTION1_VALUE);
    });

    it('should call the registered function whenever the input is blurred', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter1.setOnTouchedCallback(spy);
      element1.dispatchEvent(new Event('blur'));
      expect(spy).toHaveBeenCalled();
    });

    it('should disable the input', () => {
      viewAdapter1.setIsDisabled(true);
      expect(element1.disabled).toBe(true);
    });

    it('should enable the input', () => {
      element1.disabled = true;
      viewAdapter1.setIsDisabled(false);
      expect(element1.disabled).toBe(false);
    });

    it('should throw if state is undefined', () => {
      expect(() => viewAdapter1.ngrxFormControlState = undefined as any).toThrowError();
    });

    it('should not throw if calling callbacks before they are registered', () => {
      expect(() => new NgrxRadioViewAdapter(undefined as any, undefined as any).onChange()).not.toThrowError();
      expect(() => new NgrxRadioViewAdapter(undefined as any, undefined as any).onTouched()).not.toThrowError();
    });
  });

  describe('dynamic string options', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(RadioTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      element1 = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[4];
      element2 = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[5];
      viewAdapter1 = getDebugNode(element1)!.injector.get<NgrxRadioViewAdapter>(NgrxRadioViewAdapter);
      viewAdapter2 = getDebugNode(element2)!.injector.get<NgrxRadioViewAdapter>(NgrxRadioViewAdapter);
      viewAdapter1.setViewValue(component.stringOptions[1]);
      viewAdapter2.setViewValue(component.stringOptions[1]);
    });

    it('should mark the option as checked if same value is written', () => {
      viewAdapter1.setViewValue(component.stringOptions[0]);
      viewAdapter2.setViewValue(component.stringOptions[0]);
      expect(element1.checked).toBe(true);
    });

    it('should mark the option as unchecked if different value is written', () => {
      element1.checked = true;
      viewAdapter1.setViewValue(component.stringOptions[1]);
      viewAdapter2.setViewValue(component.stringOptions[1]);
      expect(element1.checked).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter1.setOnChangeCallback(spy);
      viewAdapter2.setOnChangeCallback(spy);
      element1.checked = true;
      element1.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(component.stringOptions[0]);
    });

    it('should call the registered function whenever the selected option\'s value changes', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter1.setOnChangeCallback(spy);
      viewAdapter2.setOnChangeCallback(spy);
      const newValue = 'new value';
      component.stringOptions[1] = newValue;
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it('should not call the registered function whenever an unselected option\'s value changes', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter1.setOnChangeCallback(spy);
      viewAdapter2.setOnChangeCallback(spy);
      const newValue = 'new value';
      component.stringOptions[0] = newValue;
      fixture.detectChanges();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not call the registered function when the option\'s value does not change', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter1.setOnChangeCallback(spy);
      viewAdapter1.value = component.stringOptions[0];
      fixture.detectChanges();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should create new options dynamically', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter1.setOnChangeCallback(spy);
      viewAdapter2.setOnChangeCallback(spy);
      const newValue = 'op3';
      component.stringOptions.push(newValue);
      fixture.detectChanges();
      const newElement = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[6];
      const newViewAdapter = getDebugNode(newElement)!.injector.get<NgrxRadioViewAdapter>(NgrxRadioViewAdapter);
      newViewAdapter.setOnChangeCallback(spy);
      newElement.checked = true;
      newElement.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(newValue);
    });
  });

  describe('dynamic number options', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(RadioTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      element1 = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[6];
      element2 = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[7];
      viewAdapter1 = getDebugNode(element1)!.injector.get<NgrxRadioViewAdapter>(NgrxRadioViewAdapter);
      viewAdapter2 = getDebugNode(element2)!.injector.get<NgrxRadioViewAdapter>(NgrxRadioViewAdapter);
      viewAdapter1.setViewValue(component.numberOptions[1]);
      viewAdapter2.setViewValue(component.numberOptions[1]);
    });

    it('should mark the option as checked if same value is written', () => {
      viewAdapter1.setViewValue(component.numberOptions[0]);
      viewAdapter2.setViewValue(component.numberOptions[0]);
      expect(element1.checked).toBe(true);
    });

    it('should mark the option as unchecked if different value is written', () => {
      element1.checked = true;
      viewAdapter1.setViewValue(component.numberOptions[1]);
      viewAdapter2.setViewValue(component.numberOptions[1]);
      expect(element1.checked).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter1.setOnChangeCallback(spy);
      viewAdapter2.setOnChangeCallback(spy);
      element1.checked = true;
      element1.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(component.numberOptions[0]);
    });

    it('should call the registered function whenever the selected option\'s value changes', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter1.setOnChangeCallback(spy);
      viewAdapter2.setOnChangeCallback(spy);
      const newValue = 3;
      component.numberOptions[1] = newValue;
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it('should not call the registered function whenever an unselected option\'s value changes', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter1.setOnChangeCallback(spy);
      viewAdapter2.setOnChangeCallback(spy);
      const newValue = 3;
      component.numberOptions[0] = newValue;
      fixture.detectChanges();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should create new options dynamically', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter1.setOnChangeCallback(spy);
      viewAdapter2.setOnChangeCallback(spy);
      const newValue = 3;
      component.numberOptions.push(newValue);
      fixture.detectChanges();
      const newElement = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[8];
      const newViewAdapter = getDebugNode(newElement)!.injector.get<NgrxRadioViewAdapter>(NgrxRadioViewAdapter);
      newViewAdapter.setOnChangeCallback(spy);
      newElement.checked = true;
      newElement.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(newValue);
    });
  });

  describe('dynamic boolean options', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(RadioTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      element1 = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[8];
      element2 = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[9];
      viewAdapter1 = getDebugNode(element1)!.injector.get<NgrxRadioViewAdapter>(NgrxRadioViewAdapter);
      viewAdapter2 = getDebugNode(element2)!.injector.get<NgrxRadioViewAdapter>(NgrxRadioViewAdapter);
      viewAdapter1.setViewValue(component.booleanOptions[1]);
      viewAdapter2.setViewValue(component.booleanOptions[1]);
    });

    it('should mark the option as checked if same value is written', () => {
      viewAdapter1.setViewValue(component.booleanOptions[0]);
      viewAdapter2.setViewValue(component.booleanOptions[0]);
      expect(element1.checked).toBe(true);
    });

    it('should mark the option as unchecked if different value is written', () => {
      element1.checked = true;
      viewAdapter1.setViewValue(component.booleanOptions[1]);
      viewAdapter2.setViewValue(component.booleanOptions[1]);
      expect(element1.checked).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter1.setOnChangeCallback(spy);
      viewAdapter2.setOnChangeCallback(spy);
      element1.checked = true;
      element1.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(component.booleanOptions[0]);
    });

    it('should call the registered function whenever the selected option\'s value changes', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter1.setOnChangeCallback(spy);
      viewAdapter2.setOnChangeCallback(spy);
      const newValue = true;
      component.booleanOptions[1] = newValue;
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it('should not call the registered function whenever an unselected option\'s value changes', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter1.setOnChangeCallback(spy);
      viewAdapter2.setOnChangeCallback(spy);
      const newValue = true;
      component.booleanOptions[0] = newValue;
      fixture.detectChanges();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should create new options dynamically', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter1.setOnChangeCallback(spy);
      viewAdapter2.setOnChangeCallback(spy);
      const newValue = true;
      component.booleanOptions.push(newValue);
      fixture.detectChanges();
      const newElement = (fixture.nativeElement as HTMLElement).querySelectorAll('input')[10];
      const newViewAdapter = getDebugNode(newElement)!.injector.get<NgrxRadioViewAdapter>(NgrxRadioViewAdapter);
      newViewAdapter.setOnChangeCallback(spy);
      newElement.checked = true;
      newElement.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(newValue);
    });
  });
});
