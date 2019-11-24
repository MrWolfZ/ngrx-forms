import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgrxFormsModule } from 'ngrx-forms';

import { SharedModule } from '../shared/shared.module';
import { LocalStateIntroductionComponent } from './local-state-introduction.component';

@NgModule({
  imports: [
    CommonModule,
    NgrxFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: LocalStateIntroductionComponent },
    ]),
    // Notice that StoreModule.forFeature is not included here!
  ],
  declarations: [
    LocalStateIntroductionComponent,
  ],
})
export class LocalStateIntroductionModule { }
