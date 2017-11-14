import { NgrxCheckboxViewAdapter } from './checkbox';
import { NgrxDefaultViewAdapter } from './default';
import { NgrxNumberViewAdapter } from './number';
import { NgrxRadioViewAdapter } from './radio';
import { NgrxRangeViewAdapter } from './range';
import { NgrxSelectViewAdapter } from './select';
import { NgrxSelectMultipleViewAdapter } from './select-multiple';
import { FormViewAdapter } from './view-adapter';

const BUILTIN_ADAPTERS = [
  NgrxCheckboxViewAdapter,
  NgrxRangeViewAdapter,
  NgrxNumberViewAdapter,
  NgrxSelectViewAdapter,
  NgrxSelectMultipleViewAdapter,
  NgrxRadioViewAdapter,
];

export function isBuiltInViewAdapter(viewAdapter: FormViewAdapter): boolean {
  return BUILTIN_ADAPTERS.some(a => viewAdapter.constructor === a);
}

export function selectViewAdapter(viewAdapters: FormViewAdapter[]): FormViewAdapter {
  if (!viewAdapters) {
    throw new Error('No view adapter matches!');
  }

  let defaultAdapter: FormViewAdapter | undefined;
  let builtinAdapter: FormViewAdapter | undefined;
  let customAdapter: FormViewAdapter | undefined;
  viewAdapters.forEach((v: FormViewAdapter) => {
    if (v.constructor === NgrxDefaultViewAdapter) {
      defaultAdapter = v;
    } else if (isBuiltInViewAdapter(v)) {
      if (builtinAdapter) {
        throw new Error('More than one built-in view adapter matches!');
      }

      builtinAdapter = v;
    } else {
      if (customAdapter) {
        throw new Error('More than one custom view adapter matches!');
      }

      customAdapter = v;
    }
  });

  if (customAdapter) {
    return customAdapter;
  }

  if (builtinAdapter) {
    return builtinAdapter;
  }

  if (defaultAdapter) {
    return defaultAdapter;
  }

  throw new Error('No valid view adapter!');
}
