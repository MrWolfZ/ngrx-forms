import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { NgrxFormsModule } from 'ngrx-forms';

import { MaterialModule } from '../material';
import { SharedModule } from '../shared/shared.module';
import { RecursiveUpdatePageComponent } from './recursive-update.component';
import { reducer } from './recursive-update.reducer';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    NgrxFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: RecursiveUpdatePageComponent },
    ]),
    StoreModule.forFeature('recursiveUpdate', reducer),
  ],
  declarations: [
    RecursiveUpdatePageComponent,
  ],
})
export class RecursiveUpdateModule { }
