import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { NgrxFormsModule } from 'ngrx-forms';

import { MaterialModule } from '../material';
import { SharedModule } from '../shared/shared.module';
import { ArrayPageComponent } from './array.component';
import { reducer } from './array.reducer';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    NgrxFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: ArrayPageComponent },
    ]),
    StoreModule.forFeature('array', reducer),
  ],
  declarations: [
    ArrayPageComponent,
  ],
})
export class ArrayModule { }
