import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { NgrxFormsModule } from 'ngrx-forms';

import { MaterialModule } from '../material';
import { SharedModule } from '../shared/shared.module';
import { RecursiveUpdateFormComponent } from './form/form.component';
import { RecursiveUpdatePageComponent } from './recursive-update.component';
import { reducers } from './recursive-update.reducer';

export const COMPONENTS = [
  RecursiveUpdatePageComponent,
  RecursiveUpdateFormComponent,
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    NgrxFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: RecursiveUpdatePageComponent },
    ]),
    StoreModule.forFeature('recursiveUpdate', reducers),
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class RecursiveUpdateModule { }
