import {
  AfterViewInit,
  Directive,
  ElementRef,
  forwardRef,
  Host,
  HostListener,
  Input,
  OnDestroy,
  Optional,
  Renderer2,
} from '@angular/core';

import { FormControlState } from '../state';
import { FormViewAdapter, NGRX_FORM_VIEW_ADAPTER } from './view-adapter';

// tslint:disable:directive-class-suffix

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'select:not([multiple])[ngrxFormControlState]',
  providers: [{
    provide: NGRX_FORM_VIEW_ADAPTER,
    useExisting: forwardRef(() => NgrxSelectViewAdapter),
    multi: true,
  }],
})
export class NgrxSelectViewAdapter implements FormViewAdapter, AfterViewInit {
  private state: FormControlState<any>;
  private optionMap: { [id: string]: any } = {};
  private idCounter = 0;
  private selectedId: string | null = null;
  private value: any = undefined;
  private nativeIdWasSet = false;

  onChangeFn: (value: any) => void = () => void 0;

  @HostListener('blur')
  onTouched: () => void = () => void 0

  @Input() set ngrxFormControlState(value: FormControlState<any>) {
    if (!value) {
      throw new Error('The control state must not be undefined!');
    }

    this.state = value;
    const nativeId = this.elementRef.nativeElement.id;
    const shouldSetNativeId = value.id !== nativeId && this.nativeIdWasSet;
    if (shouldSetNativeId) {
      this.renderer.setProperty(this.elementRef.nativeElement, 'id', value.id);
    }
  }

  constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

  ngAfterViewInit() {
    const nativeId = this.elementRef.nativeElement.id;
    const shouldSetNativeId = this.state.id !== nativeId && !nativeId;
    if (shouldSetNativeId) {
      this.renderer.setProperty(this.elementRef.nativeElement, 'id', this.state.id);
      this.nativeIdWasSet = true;
    }
  }

  setViewValue(value: any) {
    this.value = value;
    this.selectedId = this.getOptionId(value);
    if (this.selectedId === null) {
      this.renderer.setProperty(this.elementRef.nativeElement, 'selectedIndex', -1);
    }

    this.renderer.setProperty(this.elementRef.nativeElement, 'value', this.selectedId);
  }

  @HostListener('change', ['$event'])
  onChange({ target }: { target: HTMLOptionElement }) {
    this.selectedId = target.value;
    const value = this.optionMap[this.selectedId];
    this.value = value;
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
    } else if (value === this.value) {
      this.setViewValue(value);
    }
  }

  deregisterOption(id: string) {
    delete this.optionMap[id];
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

const NULL_RENDERER: Renderer2 = {
  setProperty: () => void 0,
} as any;

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'option',
})
export class NgrxSelectOption implements OnDestroy {
  private isInitialized = false;
  id: string;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    @Host() @Optional() private viewAdapter: NgrxSelectViewAdapter,
  ) {
    this.renderer = viewAdapter ? renderer : NULL_RENDERER;
    this.viewAdapter = viewAdapter || NULL_VIEW_ADAPTER;
    this.id = this.viewAdapter.createOptionId();
  }

  @Input('value')
  set value(value: any) {
    // this cannot be done inside ngOnInit since the value property
    // must be already set when the option value is updated in the view
    // adapter and the initial binding of 'value' happens before
    // ngOnInit runs
    if (!this.isInitialized) {
      this.isInitialized = true;
      this.renderer.setProperty(this.element.nativeElement, 'value', this.id);
    }

    this.viewAdapter.updateOptionValue(this.id, value);
  }

  ngOnDestroy(): void {
    this.viewAdapter.deregisterOption(this.id);
  }
}
