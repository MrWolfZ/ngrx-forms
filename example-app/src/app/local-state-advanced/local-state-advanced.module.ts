import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { NgrxFormsModule } from 'ngrx-forms';

import { SharedModule } from '../shared/shared.module';
import { LocalStateAdvancedComponent } from './local-state-advanced.component';
import { LocalStateAdvancedEffects } from './local-state-advanced.effects';

@NgModule({
  imports: [
    CommonModule,
    NgrxFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: LocalStateAdvancedComponent },
    ]),
    // Notice that StoreModule.forFeature is not included here!
    EffectsModule.forFeature([LocalStateAdvancedEffects]),
  ],
  declarations: [
    LocalStateAdvancedComponent,
  ],
})
export class LocalStateAdvancedModule { }
