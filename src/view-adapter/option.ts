import {
  Directive,
  ElementRef,
  Host,
  Input,
  Optional,
  Renderer2,
} from '@angular/core';

import { NgrxSelectViewAdapter } from './select';
import { NgrxSelectMultipleViewAdapter } from './select-multiple';

// tslint:disable:directive-class-suffix

const NULL_RENDERER: Renderer2 = {
  setProperty: () => void 0,
} as any;

/**
 * This directive is necessary to restore the default behaviour of Angular
 * when an `option` is used without an **ngrx-forms** form state. Since it
 * is not possible to select an element with a selector that considers its
 * parent the `option` directives for `select` and `select[multiple]` will
 * always be applied and therefore overriding the `[value]` binding which
 * disabled Angular's normal behaviour. This directive restores this
 * behaviour if no `select` or `select[multiple]` view adapter is found.
 * This is not a perfect solution since it may interfere with other
 * directives that try to set the `[value]` but that is very unlikely.
 */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'option',
})
export class NgrxFallbackSelectOption {
  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    @Host() @Optional() viewAdapter: NgrxSelectViewAdapter,
    @Host() @Optional() multipleViewAdapter: NgrxSelectMultipleViewAdapter,
  ) {
    this.renderer = viewAdapter || multipleViewAdapter ? NULL_RENDERER : renderer;
  }

  @Input('value')
  set value(value: any) {
    this.renderer.setProperty(this.element.nativeElement, 'value', value);
  }
}
