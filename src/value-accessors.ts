import {
  Directive,
  ElementRef,
  Renderer2,
  forwardRef,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  DefaultValueAccessor,
  CheckboxControlValueAccessor,
  SelectControlValueAccessor,
  SelectMultipleControlValueAccessor,
  RadioControlValueAccessor,
} from '@angular/forms';

// tslint:disable:directive-selector
// tslint:disable:use-host-property-decorator
// tslint:disable:directive-class-suffix
// tslint:disable:triple-equals

// sadly we have to copy all the existing value accessors since their selectors won't match
// without the [formControl] directive being applied
@Directive({
  selector: 'input:not([type=checkbox])[ngrxFormControlState],textarea[ngrxFormControlState]',
  host: {
    '(input)': '_handleInput($event.target.value)',
    '(blur)': 'onTouched()',
    '(compositionstart)': '_compositionStart()',
    '(compositionend)': '_compositionEnd($event.target.value)'
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgrxDefaultValueAccessor),
    multi: true
  }],
})
export class NgrxDefaultValueAccessor extends DefaultValueAccessor { }

@Directive({
  selector: 'input[type=checkbox][ngrxFormControlState]',
  host: {
    '(change)': 'onChange($event.target.checked)',
    '(blur)': 'onTouched()',
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgrxCheckboxControlValueAccessor),
    multi: true
  }],
})
export class NgrxCheckboxControlValueAccessor extends CheckboxControlValueAccessor { }

@Directive({
  selector: 'input[type=range][ngrxFormControlState]',
  host: {
    '(change)': 'onChange($event.target.value)',
    '(input)': 'onChange($event.target.value)',
    '(blur)': 'onTouched()'
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgrxRangeValueAccessor),
    multi: true
  }],
})
export class NgrxRangeValueAccessor implements ControlValueAccessor {

  constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

  onChange = (_: any) => void 0 as any;
  onTouched = () => void 0 as any;

  writeValue(value: any): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', parseFloat(value));
  }

  registerOnChange(fn: (_: number | null) => void): void {
    this.onChange = (value) => { fn(value == '' ? null : parseFloat(value)); };
  }

  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }
}

@Directive({
  selector: 'input[type=number][ngrxFormControlState]',
  host: {
    '(change)': 'onChange($event.target.value)',
    '(input)': 'onChange($event.target.value)',
    '(blur)': 'onTouched()'
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgrxNumberValueAccessor),
    multi: true
  }],
})
// for some reason @angular/forms does not export the NumberValueAccessor, so we have to copy the implementation here
export class NgrxNumberValueAccessor implements ControlValueAccessor {

  constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

  onChange = (_: any) => void 0 as any;
  onTouched = () => void 0 as any;

  writeValue(value: number): void {
    // The value needs to be normalized for IE9, otherwise it is set to 'null' when null
    const normalizedValue = value == null ? '' : value;
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', normalizedValue);
  }

  registerOnChange(fn: (_: number | null) => void): void {
    this.onChange = (value) => { fn(value == '' ? null : parseFloat(value)); };
  }

  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }
}

@Directive({
  selector: 'select:not([multiple])[ngrxFormControlState]',
  host: {
    '(change)': 'onChange($event.target.value)',
    '(blur)': 'onTouched()',
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgrxSelectControlValueAccessor),
    multi: true
  }],
})
export class NgrxSelectControlValueAccessor extends SelectControlValueAccessor { }

@Directive({
  selector: 'select[multiple][ngrxFormControlState]',
  host: {
    '(change)': 'onChange($event.target)',
    '(blur)': 'onTouched()',
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgrxSelectMultipleControlValueAccessor),
    multi: true
  }],
})
export class NgrxSelectMultipleControlValueAccessor extends SelectMultipleControlValueAccessor { }

@Directive({
  selector: 'input[type=radio][ngrxFormControlState]',
  host: {
    '(change)': 'onChange()',
    '(blur)': 'onTouched()',
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgrxRadioControlValueAccessor),
    multi: true
  }],
})
export class NgrxRadioControlValueAccessor extends RadioControlValueAccessor { }

const BUILTIN_ACCESSORS = [
  NgrxCheckboxControlValueAccessor,
  NgrxRangeValueAccessor,
  NgrxNumberValueAccessor,
  NgrxSelectControlValueAccessor,
  NgrxSelectMultipleControlValueAccessor,
  NgrxRadioControlValueAccessor,
];

export function isBuiltInAccessor(valueAccessor: ControlValueAccessor): boolean {
  return BUILTIN_ACCESSORS.some(a => valueAccessor.constructor === a);
}

export function selectValueAccessor(valueAccessors: ControlValueAccessor[]): ControlValueAccessor {
  if (!valueAccessors) {
    throw new Error('No value accessor matches!');
  }

  let defaultAccessor: ControlValueAccessor | undefined;
  let builtinAccessor: ControlValueAccessor | undefined;
  let customAccessor: ControlValueAccessor | undefined;
  valueAccessors.forEach((v: ControlValueAccessor) => {
    if (v.constructor === NgrxDefaultValueAccessor) {
      defaultAccessor = v;
    } else if (isBuiltInAccessor(v)) {
      if (builtinAccessor) {
        throw new Error('More than one built-in value accessor matches!');
      }

      builtinAccessor = v;
    } else {
      if (customAccessor) {
        throw new Error('More than one custom value accessor matches!');
      }

      customAccessor = v;
    }
  });

  if (customAccessor) {
    return customAccessor;
  }

  if (builtinAccessor) {
    return builtinAccessor;
  }

  if (defaultAccessor) {
    return defaultAccessor;
  }

  throw new Error('No valid value accessor!');
}
