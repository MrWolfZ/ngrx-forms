import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { NgrxFormsModule } from 'ngrx-forms';

import { MaterialModule } from '../material';
import { SharedModule } from '../shared/shared.module';
import { ValueConversionPageComponent } from './value-conversion.component';
import { reducers } from './value-conversion.reducer';

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
  declarations: [
    ValueConversionPageComponent,
  ],
})
export class ValueConversionModule { }
