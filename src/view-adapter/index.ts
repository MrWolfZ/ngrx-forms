import { ControlValueAccessor } from '@angular/forms';

import { NgrxCheckboxViewAdapter } from './checkbox';
import { NgrxDefaultViewAdapter } from './default';
import { NgrxNumberViewAdapter } from './number';
import { NgrxRadioViewAdapter } from './radio';
import { NgrxRangeViewAdapter } from './range';
import { NgrxSelectViewAdapter, NgrxSelectMultipleViewAdapter } from './select';

export { NgrxCheckboxViewAdapter } from './checkbox';
export { NgrxDefaultViewAdapter } from './default';
export { NgrxNumberViewAdapter } from './number';
export { NgrxRadioViewAdapter } from './radio';
export { NgrxRangeViewAdapter } from './range';
export { NgrxSelectViewAdapter, NgrxSelectMultipleViewAdapter, NgrxSelectOption } from './select';

const BUILTIN_ACCESSORS = [
  NgrxCheckboxViewAdapter,
  NgrxRangeViewAdapter,
  NgrxNumberViewAdapter,
  NgrxSelectViewAdapter,
  NgrxSelectMultipleViewAdapter,
  NgrxRadioViewAdapter,
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
    if (v.constructor === NgrxDefaultViewAdapter) {
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
