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

import { FormControlState } from '../state';
import { FormViewAdapter, NGRX_FORM_VIEW_ADAPTER } from './view-adapter';

// tslint:disable:directive-class-suffix

@Directive({
  selector: 'select:not([multiple])[ngrxFormControlState]',
  providers: [{
    provide: NGRX_FORM_VIEW_ADAPTER,
    useExisting: forwardRef(() => NgrxSelectViewAdapter),
    multi: true,
  }],
})
export class NgrxSelectViewAdapter implements FormViewAdapter {
  private optionMap: { [id: string]: any } = {};
  private idCounter = 0;
  private selectedId: string | null = null;

  onChangeFn: (value: any) => void = () => void 0;

  @HostListener('blur')
  onTouched: () => void = () => void 0

  @Input() set ngrxFormControlState(value: FormControlState<any>) {
    if (!value) {
      throw new Error('The control state must not be undefined!');
    }

    if (value.id !== this.elementRef.nativeElement.id) {
      this.renderer.setProperty(this.elementRef.nativeElement, 'id', value.id);
    }
  }

  constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

  setViewValue(value: any) {
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

  setOnChangeCallback(fn: (value: any) => void) {
    this.onChangeFn = fn;
  }

  setOnTouchedCallback(fn: () => void) {
    this.onTouched = fn;
  }

  setIsDisabled(isDisabled: boolean) {
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

const NULL_VIEW_ADAPTER: NgrxSelectViewAdapter = {
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
    @Host() @Optional() private viewAdapter: NgrxSelectViewAdapter,
  ) {
    this.viewAdapter = viewAdapter || NULL_VIEW_ADAPTER;
    this.id = this.viewAdapter.createOptionId();
  }

  @Input('value')
  set value(value: any) {
    this.viewAdapter.updateOptionValue(this.id, value);
  }

  ngOnInit() {
    this.renderer.setProperty(this.element.nativeElement, 'value', this.id);
  }

  ngOnDestroy(): void {
    this.viewAdapter.deregisterOption(this.id);
  }
}
