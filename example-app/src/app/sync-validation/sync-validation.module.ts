import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { NgrxFormsModule } from 'ngrx-forms';

import { MaterialModule } from '../material';
import { SharedModule } from '../shared/shared.module';
import { SyncValidationComponent } from './form/form.component';
import { SyncValidationPageComponent } from './sync-validation.component';
import { reducers } from './sync-validation.reducer';

export const COMPONENTS = [
  SyncValidationPageComponent,
  SyncValidationComponent,
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    NgrxFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: SyncValidationPageComponent },
    ]),
    StoreModule.forFeature('syncValidation', reducers),
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class SyncValidationModule { }
