import { NgModule } from '@angular/core';

import { NgrxFormControlDirective } from './control/directive';
import { NgrxFormDirective } from './group/directive';
import {
  NgrxDefaultViewAdapter,
  NgrxCheckboxViewAdapter,
  NgrxNumberViewAdapter,
  NgrxRangeViewAdapter,
  NgrxSelectViewAdapter,
  NgrxSelectMultipleViewAdapter,
  NgrxRadioViewAdapter,
  NgrxSelectOption,
} from './view-adapter';

const exportsAndDeclarations = [
  NgrxFormControlDirective,
  NgrxFormDirective,
  NgrxDefaultViewAdapter,
  NgrxCheckboxViewAdapter,
  NgrxNumberViewAdapter,
  NgrxRangeViewAdapter,
  NgrxSelectViewAdapter,
  NgrxSelectMultipleViewAdapter,
  NgrxRadioViewAdapter,
  NgrxSelectOption,
];

@NgModule({
  imports: [],
  declarations: exportsAndDeclarations,
  exports: exportsAndDeclarations,
})
export class NgrxFormsModule { }
