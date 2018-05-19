import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { NgrxFormsModule } from 'ngrx-forms';

import { MaterialModule } from '../material';
import { SharedModule } from '../shared/shared.module';
import { SimpleFormPageComponent } from './simple-form.component';
import { reducers } from './simple-form.reducer';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    NgrxFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: SimpleFormPageComponent },
    ]),
    StoreModule.forFeature('simpleForm', reducers),
  ],
  declarations: [
    SimpleFormPageComponent,
  ],
})
export class SimpleFormModule { }
