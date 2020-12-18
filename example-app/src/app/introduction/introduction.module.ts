import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material';
import { IntroductionPageComponent } from './introduction.component';

export const COMPONENTS = [
  IntroductionPageComponent,
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild([
      { path: '', component: IntroductionPageComponent },
    ]),
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class IntroductionModule {
  static forRoot(): ModuleWithProviders<IntroductionModule> {
    return {
      ngModule: IntroductionModule,
    };
  }
}
