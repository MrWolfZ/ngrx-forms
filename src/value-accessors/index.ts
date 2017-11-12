import { ControlValueAccessor } from '@angular/forms';

import { NgrxCheckboxControlValueAccessor } from './checkbox';
import { NgrxDefaultValueAccessor } from './default';
import { NgrxNumberValueAccessor } from './number';
import { NgrxRadioControlValueAccessor } from './radio';
import { NgrxRangeValueAccessor } from './range';
import { NgrxSelectControlValueAccessor, NgrxSelectMultipleControlValueAccessor } from './select';

export { NgrxCheckboxControlValueAccessor } from './checkbox';
export { NgrxDefaultValueAccessor } from './default';
export { NgrxNumberValueAccessor } from './number';
export { NgrxRadioControlValueAccessor } from './radio';
export { NgrxRangeValueAccessor } from './range';
export { NgrxSelectControlValueAccessor, NgrxSelectMultipleControlValueAccessor, NgrxSelectOption } from './select';

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
