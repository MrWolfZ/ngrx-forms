import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgrxFormsModule } from 'ngrx-forms';

import { MaterialModule } from '../material';
import { SharedModule } from '../shared/shared.module';
import { AsyncValidationPageComponent } from './async-validation.component';
import { AsyncValidationEffects } from './async-validation.effects';
import { reducers } from './async-validation.reducer';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    NgrxFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: AsyncValidationPageComponent },
    ]),
    StoreModule.forFeature('asyncValidation', reducers),
    EffectsModule.forFeature([AsyncValidationEffects]),
  ],
  declarations: [
    AsyncValidationPageComponent,
  ],
})
export class AsyncValidationModule { }
