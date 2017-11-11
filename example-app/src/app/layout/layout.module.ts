import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material';
import { LayoutComponent } from './layout/component';
import { NavItemComponent } from './nav-item/component';
import { SidenavComponent } from './sidenav/component';

export const COMPONENTS = [
  LayoutComponent,
  NavItemComponent,
  SidenavComponent,
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class LayoutModule {
  static forRoot() {
    return {
      ngModule: LayoutModule,
    };
  }
}
