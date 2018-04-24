import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '../material';
import { FormExampleComponent } from './form-example/form-example.component';

export const COMPONENTS = [
  FormExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class SharedModule { }
