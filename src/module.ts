import { NgModule } from '@angular/core';

import { NgrxFormControlDirective } from './control/directive';
import { NgrxFormDirective } from './group/directive';
import { NgrxCheckboxViewAdapter } from './view-adapter/checkbox';
import { NgrxDefaultViewAdapter } from './view-adapter/default';
import { NgrxNumberViewAdapter } from './view-adapter/number';
import { NgrxRadioViewAdapter } from './view-adapter/radio';
import { NgrxRangeViewAdapter } from './view-adapter/range';
import { NgrxSelectOption, NgrxSelectViewAdapter } from './view-adapter/select';
import { NgrxSelectMultipleOption, NgrxSelectMultipleViewAdapter } from './view-adapter/select-multiple';

const exportsAndDeclarations = [
  NgrxFormControlDirective,
  NgrxFormDirective,
  NgrxCheckboxViewAdapter,
  NgrxDefaultViewAdapter,
  NgrxNumberViewAdapter,
  NgrxRadioViewAdapter,
  NgrxRangeViewAdapter,
  NgrxSelectMultipleOption,
  NgrxSelectMultipleViewAdapter,
  NgrxSelectOption,
  NgrxSelectViewAdapter,
];

@NgModule({
  declarations: exportsAndDeclarations,
  exports: exportsAndDeclarations,
})
export class NgrxFormsModule { }
