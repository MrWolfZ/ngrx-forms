import { Component, getDebugNode, Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgrxSelectOption, NgrxSelectViewAdapter } from './select';

const TEST_ID = 'test ID';

const OPTION1_VALUE = 'op1';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'select-test',
  template: `
<select [ngrxFormControlState]="state">
  <option value="op1">op1</option>
  <option value="op2" selected>op2</option>
</select>

<select [ngrxFormControlState]="state">
  <option *ngFor="let o of stringOptions; trackBy: trackByIndex" [value]="o">{{o}}</option>
</select>

<select [ngrxFormControlState]="state">
  <option *ngFor="let o of numberOptions; trackBy: trackByIndex" [value]="o">{{o}}</option>
</select>

<select [ngrxFormControlState]="state">
  <option *ngFor="let o of booleanOptions; trackBy: trackByIndex" [value]="o">{{o}}</option>
</select>
`,
})
export class SelectTestComponent {
  stringOptions = ['op1', 'op2'];
  numberOptions = [1, 2];
  booleanOptions = [true, false];
  state = { id: TEST_ID } as any;
  trackByIndex = (index: number) => index;
}

describe(NgrxSelectViewAdapter.name, () => {
  let component: SelectTestComponent;
  let fixture: ComponentFixture<SelectTestComponent>;
  let viewAdapter: NgrxSelectViewAdapter;
  let element: HTMLSelectElement;
  let option1: HTMLOptionElement;
  let option2: HTMLOptionElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NgrxSelectViewAdapter,
        NgrxSelectOption,
        SelectTestComponent,
      ],
    }).compileComponents();
  }));

  describe('static options', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SelectTestComponent);
      component = fixture.componentInstance;
      const nativeElement = fixture.nativeElement as HTMLElement;
      element = nativeElement.querySelector('select') as HTMLSelectElement;
      option1 = element.querySelectorAll('option')[0] as HTMLOptionElement;
      option2 = element.querySelectorAll('option')[1] as HTMLOptionElement;
      viewAdapter = getDebugNode(element)!.injector.get(NgrxSelectViewAdapter);
      fixture.detectChanges();
    });

    it('should attach the view adapter', () => expect(viewAdapter).toBeDefined());

    it('should mark the option as selected if same value is written', () => {
      viewAdapter.setViewValue(OPTION1_VALUE);
      expect(option1.selected).toBe(true);
    });

    it('should mark the option as unselected if different value is written', () => {
      viewAdapter.setViewValue(OPTION1_VALUE);
      expect(option2.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter.setOnChangeCallback(spy);
      element.value = '0';
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(OPTION1_VALUE);
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

  describe('dynamic string options', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SelectTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const nativeElement = fixture.nativeElement as HTMLElement;
      element = nativeElement.querySelectorAll('select')[1] as HTMLSelectElement;
      option1 = element.querySelectorAll('option')[0] as HTMLOptionElement;
      option2 = element.querySelectorAll('option')[1] as HTMLOptionElement;
      viewAdapter = getDebugNode(element)!.injector.get(NgrxSelectViewAdapter);
      viewAdapter.setViewValue(component.stringOptions[1]);
    });

    it('should set the ID of the element to the ID of the state', () => {
      expect(element.id).toBe(TEST_ID);
    });

    it('should set the ID of the element if the ID of the state changes', () => {
      const newId = 'new ID';
      viewAdapter.ngrxFormControlState = { id: newId } as any;
      fixture.detectChanges();
      expect(element.id).toBe(newId);
    });

    it('should mark the option as selected if same value is written', () => {
      viewAdapter.setViewValue(component.stringOptions[0]);
      expect(option1.selected).toBe(true);
    });

    it('should mark the option as unselected if different value is written', () => {
      viewAdapter.setViewValue(component.stringOptions[0]);
      expect(option2.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter.setOnChangeCallback(spy);
      element.selectedIndex = 0;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(component.stringOptions[0]);
    });

    it('should call the registered function whenever the selected option\'s value changes', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter.setOnChangeCallback(spy);
      const newValue = 'new value';
      component.stringOptions[1] = newValue;
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it('should not call the registered function whenever an unselected option\'s value changes', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter.setOnChangeCallback(spy);
      const newValue = 'new value';
      component.stringOptions[0] = newValue;
      fixture.detectChanges();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should create new options dynamically', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter.setOnChangeCallback(spy);
      const newValue = 'op3';
      component.stringOptions.push(newValue);
      fixture.detectChanges();
      element.selectedIndex = 2;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it('should remove options dynamically', () => {
      const oldValue = component.stringOptions[1];
      component.stringOptions.pop();
      fixture.detectChanges();
      expect(() => viewAdapter.setViewValue(oldValue)).not.toThrow();
      expect(element.selectedIndex).toEqual(-1);
    });
  });

  describe('dynamic number options', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SelectTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const nativeElement = fixture.nativeElement as HTMLElement;
      element = nativeElement.querySelectorAll('select')[2] as HTMLSelectElement;
      option1 = element.querySelectorAll('option')[0] as HTMLOptionElement;
      option2 = element.querySelectorAll('option')[1] as HTMLOptionElement;
      viewAdapter = getDebugNode(element)!.injector.get(NgrxSelectViewAdapter);
      viewAdapter.setViewValue(component.numberOptions[1]);
    });

    it('should mark the option as selected if same value is written', () => {
      viewAdapter.setViewValue(component.numberOptions[0]);
      expect(option1.selected).toBe(true);
    });

    it('should mark the option as unselected if different value is written', () => {
      viewAdapter.setViewValue(component.numberOptions[0]);
      expect(option2.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter.setOnChangeCallback(spy);
      element.selectedIndex = 0;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(component.numberOptions[0]);
    });

    it('should call the registered function whenever the selected option\'s value changes', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter.setOnChangeCallback(spy);
      const newValue = 3;
      component.numberOptions[1] = newValue;
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it('should not call the registered function whenever an unselected option\'s value changes', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter.setOnChangeCallback(spy);
      const newValue = 3;
      component.numberOptions[0] = newValue;
      fixture.detectChanges();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should create new options dynamically', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter.setOnChangeCallback(spy);
      const newValue = 3;
      component.numberOptions.push(newValue);
      fixture.detectChanges();
      element.selectedIndex = 2;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it('should remove options dynamically', () => {
      const oldValue = component.numberOptions[1];
      component.numberOptions.pop();
      fixture.detectChanges();
      expect(() => viewAdapter.setViewValue(oldValue)).not.toThrow();
      expect(element.selectedIndex).toEqual(-1);
    });
  });

  describe('dynamic boolean options', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SelectTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const nativeElement = fixture.nativeElement as HTMLElement;
      element = nativeElement.querySelectorAll('select')[3] as HTMLSelectElement;
      option1 = element.querySelectorAll('option')[0] as HTMLOptionElement;
      option2 = element.querySelectorAll('option')[1] as HTMLOptionElement;
      viewAdapter = getDebugNode(element)!.injector.get(NgrxSelectViewAdapter);
      viewAdapter.setViewValue(component.booleanOptions[1]);
    });

    it('should mark the option as selected if same value is written', () => {
      viewAdapter.setViewValue(component.booleanOptions[0]);
      expect(option1.selected).toBe(true);
    });

    it('should mark the option as unselected if different value is written', () => {
      viewAdapter.setViewValue(component.booleanOptions[0]);
      expect(option2.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter.setOnChangeCallback(spy);
      element.selectedIndex = 0;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(component.booleanOptions[0]);
    });

    it('should call the registered function whenever the selected option\'s value changes', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter.setOnChangeCallback(spy);
      const newValue = true;
      component.booleanOptions[1] = newValue;
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it('should create new options dynamically', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter.setOnChangeCallback(spy);
      const newValue = true;
      component.booleanOptions.push(newValue);
      fixture.detectChanges();
      element.selectedIndex = 2;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(newValue);
    });

    it('should remove options dynamically', () => {
      const oldValue = component.booleanOptions[1];
      component.booleanOptions.pop();
      fixture.detectChanges();
      expect(() => viewAdapter.setViewValue(oldValue)).not.toThrow();
      expect(element.selectedIndex).toEqual(-1);
    });
  });
});

describe(NgrxSelectOption.name, () => {
  let viewAdapter: NgrxSelectViewAdapter;
  let option: NgrxSelectOption;
  let renderer: Renderer2;

  beforeEach(() => {
    renderer = jasmine.createSpyObj('renderer2', ['setProperty']);
    viewAdapter = new NgrxSelectViewAdapter(renderer, {} as any);
    option = new NgrxSelectOption({} as any, renderer, viewAdapter);
  });

  it('should work if option is created without view adapter', () => {
    expect(new NgrxSelectOption({} as any, {} as any, null as any)).toBeDefined();
  });
});
