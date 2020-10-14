import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { NgrxFormsModule } from 'ngrx-forms';

import { MaterialModule } from '../material';
import { SharedModule } from '../shared/shared.module';
import { SimpleFormNgrx8PageComponent } from './simple-form-ngrx8.component';
import { reducer } from './simple-form-ngrx8.reducer';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    NgrxFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: SimpleFormNgrx8PageComponent },
    ]),
    StoreModule.forFeature('simpleFormNgrx8', reducer),
  ],
  declarations: [
    SimpleFormNgrx8PageComponent,
  ],
})
export class SimpleFormNgrx8Module { }
