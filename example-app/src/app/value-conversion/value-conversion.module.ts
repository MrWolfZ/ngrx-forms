import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { NgrxFormsModule } from 'ngrx-forms';

import { MaterialModule } from '../material';
import { SharedModule } from '../shared/shared.module';
import { ValueConversionFormComponent } from './form/form.component';
import { ValueConversionPageComponent } from './value-conversion.component';
import { reducers } from './value-conversion.reducer';

export const COMPONENTS = [
  ValueConversionPageComponent,
  ValueConversionFormComponent,
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    NgrxFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: ValueConversionPageComponent },
    ]),

    StoreModule.forFeature('valueConversion', reducers),
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class ValueConversionModule { }
