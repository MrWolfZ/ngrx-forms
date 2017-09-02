import { NgModule } from '@angular/core';

import { NgrxFormControlDirective } from './control/directive';
import { NgrxFormDirective } from './group/directive';
import {
  NgrxDefaultValueAccessor,
  NgrxCheckboxControlValueAccessor,
  NgrxNumberValueAccessor,
  NgrxRangeValueAccessor,
  NgrxSelectControlValueAccessor,
  NgrxSelectMultipleControlValueAccessor,
  NgrxRadioControlValueAccessor,
  NgrxSelectOption,
} from './value-accessors';

const exportsAndDeclarations = [
  NgrxFormControlDirective,
  NgrxFormDirective,
  NgrxDefaultValueAccessor,
  NgrxCheckboxControlValueAccessor,
  NgrxNumberValueAccessor,
  NgrxRangeValueAccessor,
  NgrxSelectControlValueAccessor,
  NgrxSelectMultipleControlValueAccessor,
  NgrxRadioControlValueAccessor,
  NgrxSelectOption,
];

@NgModule({
  imports: [],
  declarations: exportsAndDeclarations,
  exports: exportsAndDeclarations,
})
export class NgrxFormsModule { }
