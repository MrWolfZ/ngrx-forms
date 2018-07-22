import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { NgrxFormsModule } from 'ngrx-forms';

import { SharedModule } from '../shared/shared.module';
import { ValueBoxingPageComponent } from './value-boxing.component';
import { reducer } from './value-boxing.reducer';

@NgModule({
  imports: [
    CommonModule,
    NgrxFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: ValueBoxingPageComponent },
    ]),
    StoreModule.forFeature('valueBoxing', reducer),
  ],
  declarations: [
    ValueBoxingPageComponent,
  ],
})
export class ValueBoxingModule { }
