import {
  Directive,
  ElementRef,
  forwardRef,
  Host,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, SelectMultipleControlValueAccessor } from '@angular/forms';

// tslint:disable:directive-class-suffix

@Directive({
  selector: 'select:not([multiple])[ngrxFormControlState]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgrxSelectControlValueAccessor),
    multi: true,
  }],
})
export class NgrxSelectControlValueAccessor implements ControlValueAccessor {
  private optionMap: { [id: string]: any } = {};
  private idCounter = 0;
  private selectedId: string | null = null;

  onChangeFn: (value: any) => void = () => void 0;

  @HostListener('blur')
  onTouched: () => void = () => void 0

  constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

  writeValue(value: any) {
    this.selectedId = this.getOptionId(value);
    if (this.selectedId === null) {
      this.renderer.setProperty(this.elementRef.nativeElement, 'selectedIndex', -1);
    }

    this.renderer.setProperty(this.elementRef.nativeElement, 'value', this.selectedId);
  }

  @HostListener('change', ['$event'])
  onChange(event: UIEvent) {
    this.selectedId = (event.target as HTMLOptionElement).value;
    const value = this.optionMap[this.selectedId];
    this.onChangeFn(value);
  }

  registerOnChange(fn: (value: any) => void) {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }

  createOptionId() {
    const id = this.idCounter.toString();
    this.idCounter += 1;
    return id;
  }

  updateOptionValue(id: string, value: any) {
    this.optionMap[id] = value;

    if (this.selectedId === id) {
      this.onChangeFn(value);
    }
  }

  deregisterOption(id: string) {
    delete this.optionMap[id];

    if (this.selectedId === id) {
      this.onChangeFn(null);
    }
  }

  private getOptionId(value: any) {
    for (const id of Array.from(Object.keys(this.optionMap))) {
      if (this.optionMap[id] === value) {
        return id;
      }
    }

    return null;
  }
}

const NULL_VALUE_ACCESSOR: NgrxSelectControlValueAccessor = {
  createOptionId: () => '',
  deregisterOption: () => void 0,
  updateOptionValue: () => void 0,
} as any;

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'option',
})
export class NgrxSelectOption implements OnInit, OnDestroy {
  id: string;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    @Host() @Optional() private valueAccessor: NgrxSelectControlValueAccessor,
  ) {
    this.valueAccessor = valueAccessor || NULL_VALUE_ACCESSOR;
    this.id = this.valueAccessor.createOptionId();
  }

  @Input('value')
  set value(value: any) {
    this.valueAccessor.updateOptionValue(this.id, value);
  }

  ngOnInit() {
    this.renderer.setProperty(this.element.nativeElement, 'value', this.id);
  }

  ngOnDestroy(): void {
    this.valueAccessor.deregisterOption(this.id);
  }
}

@Directive({
  selector: 'select[multiple][ngrxFormControlState]',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '(change)': 'onChange($event.target)',
    '(blur)': 'onTouched()',
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgrxSelectMultipleControlValueAccessor),
    multi: true,
  }],
})
export class NgrxSelectMultipleControlValueAccessor extends SelectMultipleControlValueAccessor { }
