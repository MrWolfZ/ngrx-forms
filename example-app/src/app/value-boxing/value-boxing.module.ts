import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { NgrxFormsModule } from 'ngrx-forms';

import { SharedModule } from '../shared/shared.module';
import { ValueBoxingFormComponent } from './form/form.component';
import { ValueBoxingPageComponent } from './value-boxing.component';
import { reducers } from './value-boxing.reducer';

export const COMPONENTS = [
  ValueBoxingPageComponent,
  ValueBoxingFormComponent,
];

@NgModule({
  imports: [
    CommonModule,
    NgrxFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: ValueBoxingPageComponent },
    ]),
    StoreModule.forFeature('valueBoxing', reducers),
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class ValueBoxingModule { }
