import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { NgrxFormsModule } from 'ngrx-forms';

import { MaterialModule } from '../material';
import { SharedModule } from '../shared/shared.module';
import { DynamicFormComponent } from './form/form.component';
import { DynamicPageComponent } from './material.component';
import { reducer } from './material.reducer';

export const COMPONENTS = [
  DynamicPageComponent,
  DynamicFormComponent,
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    NgrxFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: DynamicPageComponent },
    ]),

    StoreModule.forFeature('material', reducer),
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class MaterialExampleModule { }
