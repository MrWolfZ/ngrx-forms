import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { NgrxFormsModule } from 'ngrx-forms';

import { MaterialModule } from '../material';
import { SharedModule } from '../shared/shared.module';
import { DynamicPageComponent } from './dynamic.component';
import { reducers } from './dynamic.reducer';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    NgrxFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: DynamicPageComponent },
    ]),
    StoreModule.forFeature('dynamic', reducers),
  ],
  declarations: [
    DynamicPageComponent,
  ],
})
export class DynamicModule { }
