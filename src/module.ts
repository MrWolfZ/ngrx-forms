import { NgModule } from '@angular/core';

import { NgrxFormControlDirective } from './control/directive';
import { NgrxFormDirective } from './group/directive';
import {
  NgrxCheckboxViewAdapter,
  NgrxDefaultViewAdapter,
  NgrxNumberViewAdapter,
  NgrxRadioViewAdapter,
  NgrxRangeViewAdapter,
  NgrxSelectMultipleOption,
  NgrxSelectMultipleViewAdapter,
  NgrxSelectOption,
  NgrxSelectViewAdapter,
} from './view-adapter';

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
