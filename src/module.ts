import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
];

@NgModule({
  imports: [],
  declarations: exportsAndDeclarations,
  exports: exportsAndDeclarations,
})
export class NgrxFormsModule { }
