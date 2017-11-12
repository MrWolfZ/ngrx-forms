import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { NgrxFormsModule } from 'ngrx-forms';

import { MaterialModule } from '../material';
import { SharedModule } from '../shared/shared.module';
import { SimpleFormPageComponent } from './component';
import { FormComponent } from './form/form.component';
import { reducers } from './reducer';

export const COMPONENTS = [
  SimpleFormPageComponent,
  FormComponent,
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    NgrxFormsModule,
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
