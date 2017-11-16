import { NgModule } from '@angular/core';
import {
  MAT_PLACEHOLDER_GLOBAL_OPTIONS,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatTabsModule,
} from '@angular/material';

import { CustomErrorStateMatcherDirective } from './error-state-matcher';
import { NgrxMatSelectValueAccessor } from './mat-select-value-accessor';

@NgModule({
  imports: [
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  declarations: [
    NgrxMatSelectValueAccessor,
    CustomErrorStateMatcherDirective,
  ],
  exports: [
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgrxMatSelectValueAccessor,
    CustomErrorStateMatcherDirective,
  ],
  providers: [
    { provide: MAT_PLACEHOLDER_GLOBAL_OPTIONS, useValue: { float: 'always' } }
  ]
})
export class MaterialModule { }
