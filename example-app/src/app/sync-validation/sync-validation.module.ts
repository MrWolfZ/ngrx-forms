import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { NgrxFormsModule } from 'ngrx-forms';

import { MaterialModule } from '../material';
import { SharedModule } from '../shared/shared.module';
import { SyncValidationPageComponent } from './sync-validation.component';
import { reducer } from './sync-validation.reducer';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    NgrxFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: SyncValidationPageComponent },
    ]),
    StoreModule.forFeature('syncValidation', reducer),
  ],
  declarations: [
    SyncValidationPageComponent,
  ],
})
export class SyncValidationModule { }
