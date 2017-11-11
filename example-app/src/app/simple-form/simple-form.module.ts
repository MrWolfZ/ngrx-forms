import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { MaterialModule } from '../material';
import { SharedModule } from '../shared/shared.module';
import { SimpleFormPageComponent } from './component';
import { reducers } from './reducer';

export const COMPONENTS = [
  SimpleFormPageComponent,
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: SimpleFormPageComponent },
    ]),

    StoreModule.forFeature('simpleForm', reducers),

    // EffectsModule.forFeature([BookEffects, CollectionEffects]),
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class SimpleFormModule { }
