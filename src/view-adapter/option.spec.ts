import { ElementRef, Renderer2 } from '@angular/core';

import { NgrxFallbackSelectOption } from './option';
import { NgrxSelectViewAdapter } from './select';
import { NgrxSelectMultipleViewAdapter } from './select-multiple';

describe(NgrxFallbackSelectOption.name, () => {
  let viewAdapter: NgrxSelectViewAdapter;
  let multipleViewAdapter: NgrxSelectMultipleViewAdapter;
  let option: NgrxFallbackSelectOption;
  let renderer: Renderer2;
  let elementRef: ElementRef;

  beforeEach(() => {
    elementRef = { nativeElement: {} } as any;
    renderer = jasmine.createSpyObj('renderer2', ['setProperty']);
    viewAdapter = new NgrxSelectViewAdapter(renderer, {} as any);
    multipleViewAdapter = new NgrxSelectMultipleViewAdapter(renderer, {} as any);
  });

  it('should set the value attribute if no view adapter is provided', () => {
    option = new NgrxFallbackSelectOption({} as any, renderer, null as any, null as any);
    option.value = 'value';
    expect(renderer.setProperty).not.toHaveBeenCalledWith(elementRef.nativeElement, 'value', 'value');
  });

  it('should not set the value attribute if a view adapter is provided', () => {
    option = new NgrxFallbackSelectOption({} as any, renderer, viewAdapter, null as any);
    option.value = 'value';
    expect(renderer.setProperty).not.toHaveBeenCalled();
  });

  it('should not set the value attribute if a multiple view adapter is provided', () => {
    option = new NgrxFallbackSelectOption({} as any, renderer, null as any, multipleViewAdapter);
    option.value = 'value';
    expect(renderer.setProperty).not.toHaveBeenCalled();
  });
});
