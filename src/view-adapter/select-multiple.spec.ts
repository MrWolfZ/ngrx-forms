import { Component, ElementRef, getDebugNode, Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgrxSelectMultipleOption, NgrxSelectMultipleViewAdapter } from './select-multiple';

const TEST_ID = 'test ID';

const OPTION1_VALUE = 'op1';
const OPTION2_VALUE = 'op2';
const OPTION3_VALUE = 'op3';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'select-test',
  template: `
<select multiple [ngrxFormControlState]="state">
  <option value="op1">op1</option>
  <option value="op2" selected>op2</option>
  <option value="op3" selected>op2</option>
</select>

<select multiple [ngrxFormControlState]="state" id="customId">
  <option value="op1">op1</option>
  <option value="op2" selected>op2</option>
  <option value="op3" selected>op2</option>
</select>

<select multiple [ngrxFormControlState]="state" [id]="boundId">
  <option value="op1">op1</option>
  <option value="op2" selected>op2</option>
  <option value="op3" selected>op2</option>
</select>

<select multiple [ngrxFormControlState]="state">
  <option *ngFor="let o of stringOptions; trackBy: trackByIndex" [value]="o">{{ o }}</option>
</select>

<select multiple [ngrxFormControlState]="state">
  <option *ngFor="let o of numberOptions; trackBy: trackByIndex" [value]="o">{{ o }}</option>
</select>

<select multiple [ngrxFormControlState]="state">
  <option *ngFor="let o of booleanOptions; trackBy: trackByIndex" [value]="o">{{ o }}</option>
</select>
`,
})
export class SelectTestComponent {
  boundId = 'boundId';
  stringOptions = ['op1', 'op2', 'op3'];
  numberOptions = [1, 2, 3];
  booleanOptions = [true, false];
  state = { id: TEST_ID } as any;
  trackByIndex = (index: number) => index;
}

describe(NgrxSelectMultipleViewAdapter.name, () => {
  let component: SelectTestComponent;
  let fixture: ComponentFixture<SelectTestComponent>;
  let viewAdapter: NgrxSelectMultipleViewAdapter;
  let element: HTMLSelectElement;
  let option1: HTMLOptionElement;
  let option2: HTMLOptionElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NgrxSelectMultipleViewAdapter,
        NgrxSelectMultipleOption,
        SelectTestComponent,
      ],
    }).compileComponents();
  }));

  describe('static options', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SelectTestComponent);
      component = fixture.componentInstance;
      const nativeElement = fixture.nativeElement as HTMLElement;
      element = nativeElement.querySelector('select')!;
      option1 = element.querySelectorAll('option')[0];
      option2 = element.querySelectorAll('option')[1];
      viewAdapter = getDebugNode(element)!.injector.get<NgrxSelectMultipleViewAdapter>(NgrxSelectMultipleViewAdapter);
      fixture.detectChanges();
    });

    it('should attach the view adapter', () => expect(viewAdapter).toBeDefined());

    it('should set the ID of the element to the ID of the state if the ID is not already set', () => {
      expect(element.id).toBe(TEST_ID);
    });

    it('should not set the ID of the element to the ID of the state if the ID is set in template manually', () => {
      element = (fixture.nativeElement as HTMLElement).querySelectorAll('select')[1];
      expect(element.id).toBe('customId');
    });

    it('should not set the ID of the element to the ID of the state if the ID is set in template via binding', () => {
      element = (fixture.nativeElement as HTMLElement).querySelectorAll('select')[2];
      expect(element.id).toBe(component.boundId);
    });

    it('should set the ID of the element if the ID of the state changes and the ID was set previously', () => {
      const newId = 'new ID';
      viewAdapter.ngrxFormControlState = { id: newId } as any;
      fixture.detectChanges();
      expect(element.id).toBe(newId);
    });

    it('should not set the ID of the element if the ID of the state changes and the ID was not set previously due to manual value', () => {
      element = (fixture.nativeElement as HTMLElement).querySelectorAll('select')[1];
      viewAdapter = getDebugNode(element)!.injector.get<NgrxSelectMultipleViewAdapter>(NgrxSelectMultipleViewAdapter);
      const newId = 'new ID';
      viewAdapter.ngrxFormControlState = { id: newId } as any;
      fixture.detectChanges();
      expect(element.id).toBe('customId');
    });

    it('should not set the ID of the element if the ID of the state changes and the ID was not set previously due to other binding', () => {
      element = (fixture.nativeElement as HTMLElement).querySelectorAll('select')[2];
      viewAdapter = getDebugNode(element)!.injector.get<NgrxSelectMultipleViewAdapter>(NgrxSelectMultipleViewAdapter);
      const newId = 'new ID';
      viewAdapter.ngrxFormControlState = { id: newId } as any;
      fixture.detectChanges();
      expect(element.id).toBe(component.boundId);
    });

    it('should not set the ID of the element if the ID of the state does not change', () => {
      const renderer: Renderer2 = jasmine.createSpyObj('renderer', ['setProperty']);
      const nativeElement: any = {};
      viewAdapter = new NgrxSelectMultipleViewAdapter(renderer, { nativeElement } as any);
      viewAdapter.ngrxFormControlState = { id: TEST_ID } as any;
      viewAdapter.ngAfterViewInit();
      expect(renderer.setProperty).toHaveBeenCalledTimes(1);
      nativeElement.id = TEST_ID;
      viewAdapter.ngrxFormControlState = { id: TEST_ID } as any;
      expect(renderer.setProperty).toHaveBeenCalledTimes(1);
    });

    it('should mark a single option as selected if same value is written', () => {
      viewAdapter.setViewValue([OPTION1_VALUE]);
      expect(option1.selected).toBe(true);
    });

    it('should mark multiple options as selected if same values are written', () => {
      viewAdapter.setViewValue([OPTION1_VALUE, OPTION2_VALUE]);
      expect(option1.selected).toBe(true);
      expect(option2.selected).toBe(true);
    });

    it('should mark options as unselected if different value is written', () => {
      viewAdapter.setViewValue([OPTION1_VALUE, OPTION3_VALUE]);
      expect(option2.selected).toBe(false);
    });

    it('should mark options as unselected if null is written', () => {
      viewAdapter.setViewValue(null);
      expect(option1.selected).toBe(false);
      expect(option2.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter.setOnChangeCallback(spy);
      option1.selected = true;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith([OPTION1_VALUE, OPTION2_VALUE, OPTION3_VALUE]);
      option2.selected = false;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith([OPTION1_VALUE, OPTION3_VALUE]);
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
      expect(() => new NgrxSelectMultipleViewAdapter(undefined as any, undefined as any).onChange()).not.toThrowError();
      expect(() => new NgrxSelectMultipleViewAdapter(undefined as any, undefined as any).onTouched()).not.toThrowError();
    });

    it('should throw if value is not an array', () => {
      expect(() => viewAdapter.setViewValue({})).toThrowError();
    });
  });

  describe('dynamic string options', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SelectTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const nativeElement = fixture.nativeElement as HTMLElement;
      element = nativeElement.querySelectorAll('select')[3];
      option1 = element.querySelectorAll('option')[0];
      option2 = element.querySelectorAll('option')[1];
      viewAdapter = getDebugNode(element)!.injector.get<NgrxSelectMultipleViewAdapter>(NgrxSelectMultipleViewAdapter);
      viewAdapter.setViewValue([component.stringOptions[1], component.stringOptions[2]]);
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

    it('should mark a single option as selected if same value is written', () => {
      viewAdapter.setViewValue([component.stringOptions[0]]);
      expect(option1.selected).toBe(true);
    });

    it('should mark multiple options as selected if same values are written', () => {
      viewAdapter.setViewValue([component.stringOptions[0], component.stringOptions[1]]);
      expect(option1.selected).toBe(true);
      expect(option2.selected).toBe(true);
    });

    it('should mark an option as unselected if different value is written', () => {
      viewAdapter.setViewValue([component.stringOptions[0], component.stringOptions[2]]);
      expect(option2.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter.setOnChangeCallback(spy);
      option1.selected = true;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(component.stringOptions);
      option2.selected = false;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith([component.stringOptions[0], component.stringOptions[2]]);
    });

    it('should call the registered function whenever a selected option\'s value changes', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter.setOnChangeCallback(spy);
      const newValue = 'new value';
      component.stringOptions[1] = newValue;
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith([component.stringOptions[1], component.stringOptions[2]]);
    });

    it('should create new options dynamically', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter.setOnChangeCallback(spy);
      const newValue = 'op4';
      component.stringOptions.push(newValue);
      fixture.detectChanges();
      (element.querySelectorAll('option')[3]).selected = true;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith([component.stringOptions[1], component.stringOptions[2], component.stringOptions[3]]);
    });

    it('should remove options dynamically', () => {
      const oldValue = [...component.stringOptions];
      component.stringOptions.pop();
      fixture.detectChanges();
      expect(() => viewAdapter.setViewValue(oldValue)).not.toThrow();
    });
  });

  describe('dynamic number options', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SelectTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const nativeElement = fixture.nativeElement as HTMLElement;
      element = nativeElement.querySelectorAll('select')[4];
      option1 = element.querySelectorAll('option')[0];
      option2 = element.querySelectorAll('option')[1];
      viewAdapter = getDebugNode(element)!.injector.get<NgrxSelectMultipleViewAdapter>(NgrxSelectMultipleViewAdapter);
      viewAdapter.setViewValue([component.numberOptions[1], component.numberOptions[2]]);
    });

    it('should mark a single option as selected if same value is written', () => {
      viewAdapter.setViewValue([component.numberOptions[0]]);
      expect(option1.selected).toBe(true);
    });

    it('should mark multiple options as selected if same values are written', () => {
      viewAdapter.setViewValue([component.numberOptions[0], component.numberOptions[1]]);
      expect(option1.selected).toBe(true);
      expect(option2.selected).toBe(true);
    });

    it('should mark an option as unselected if different value is written', () => {
      viewAdapter.setViewValue([component.numberOptions[0], component.numberOptions[2]]);
      expect(option2.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter.setOnChangeCallback(spy);
      option1.selected = true;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(component.numberOptions);
      option2.selected = false;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith([component.numberOptions[0], component.numberOptions[2]]);
    });

    it('should call the registered function whenever a selected option\'s value changes', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter.setOnChangeCallback(spy);
      const newValue = 3;
      component.numberOptions[1] = newValue;
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith([component.numberOptions[1], component.numberOptions[2]]);
    });

    it('should create new options dynamically', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter.setOnChangeCallback(spy);
      const newValue = 4;
      component.numberOptions.push(newValue);
      fixture.detectChanges();
      (element.querySelectorAll('option')[3]).selected = true;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith([component.numberOptions[1], component.numberOptions[2], component.numberOptions[3]]);
    });

    it('should remove options dynamically', () => {
      const oldValue = [...component.numberOptions];
      component.numberOptions.pop();
      fixture.detectChanges();
      expect(() => viewAdapter.setViewValue(oldValue)).not.toThrow();
    });
  });

  describe('dynamic boolean options', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SelectTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const nativeElement = fixture.nativeElement as HTMLElement;
      element = nativeElement.querySelectorAll('select')[5];
      option1 = element.querySelectorAll('option')[0];
      option2 = element.querySelectorAll('option')[1];
      viewAdapter = getDebugNode(element)!.injector.get<NgrxSelectMultipleViewAdapter>(NgrxSelectMultipleViewAdapter);
      viewAdapter.setViewValue([component.booleanOptions[1]]);
    });

    it('should mark a single option as selected if same value is written', () => {
      viewAdapter.setViewValue([component.booleanOptions[0]]);
      expect(option1.selected).toBe(true);
    });

    it('should mark multiple options as selected if same values are written', () => {
      viewAdapter.setViewValue([component.booleanOptions[0], component.booleanOptions[1]]);
      expect(option1.selected).toBe(true);
      expect(option2.selected).toBe(true);
    });

    it('should mark an option as unselected if different value is written', () => {
      viewAdapter.setViewValue([component.booleanOptions[0]]);
      expect(option2.selected).toBe(false);
    });

    it('should call the registered function whenever the value changes', () => {
      const spy = jasmine.createSpy('fn');
      viewAdapter.setOnChangeCallback(spy);
      option1.selected = true;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith(component.booleanOptions);
      option2.selected = false;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith([component.booleanOptions[0]]);
    });

    it('should call the registered function whenever a selected option\'s value changes', () => {
      component.booleanOptions = [true];
      fixture.detectChanges();
      viewAdapter.setViewValue(component.booleanOptions);
      const spy = jasmine.createSpy('fn');
      viewAdapter.setOnChangeCallback(spy);
      const newValue = false;
      component.booleanOptions[0] = newValue;
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(component.booleanOptions);
    });

    it('should create new options dynamically', () => {
      component.booleanOptions = [true];
      fixture.detectChanges();
      viewAdapter.setViewValue(component.booleanOptions);
      const spy = jasmine.createSpy('fn');
      viewAdapter.setOnChangeCallback(spy);
      const newValue = false;
      component.booleanOptions.push(newValue);
      fixture.detectChanges();
      (element.querySelectorAll('option')[1]).selected = true;
      element.dispatchEvent(new Event('change'));
      expect(spy).toHaveBeenCalledWith([component.booleanOptions[0], component.booleanOptions[1]]);
    });

    it('should remove options dynamically', () => {
      viewAdapter.setViewValue(component.booleanOptions);
      const oldValue = [...component.booleanOptions];
      component.booleanOptions.pop();
      fixture.detectChanges();
      expect(() => viewAdapter.setViewValue(oldValue)).not.toThrow();
    });
  });
});

describe(NgrxSelectMultipleOption.name, () => {
  let viewAdapter: NgrxSelectMultipleViewAdapter;
  let option: NgrxSelectMultipleOption;
  let renderer: Renderer2;
  let elementRef: ElementRef;

  beforeEach(() => {
    elementRef = { nativeElement: {} } as any;
    renderer = jasmine.createSpyObj('renderer2', ['setProperty']);
    viewAdapter = new NgrxSelectMultipleViewAdapter(renderer, {} as any);
    option = new NgrxSelectMultipleOption({} as any, renderer, viewAdapter);
  });

  it('should work if option is created without view adapter', () => {
    expect(new NgrxSelectMultipleOption({} as any, {} as any, null as any)).toBeDefined();
  });

  it('should set the value to the id of the element', () => {
    option.ngOnInit();
    expect(renderer.setProperty).not.toHaveBeenCalledWith(elementRef.nativeElement, 'value', 0);
  });

  it('should not set the value to the id if no view adapter is provided', () => {
    option = new NgrxSelectMultipleOption({} as any, renderer, null as any);
    option.ngOnInit();
    expect(renderer.setProperty).not.toHaveBeenCalled();
  });
});
