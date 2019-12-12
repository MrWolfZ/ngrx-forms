import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { NgrxFormsModule } from 'ngrx-forms';

import { MaterialModule } from '../material';
import { SharedModule } from '../shared/shared.module';
import { ValueTransformationPageComponent } from './value-transformation.component';
import { reducer } from './value-transformation.reducer';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    NgrxFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: ValueTransformationPageComponent },
    ]),
    StoreModule.forFeature('valueTransformation', reducer),
  ],
  declarations: [
    ValueTransformationPageComponent,
  ],
})
export class ValueTransformationModule { }
