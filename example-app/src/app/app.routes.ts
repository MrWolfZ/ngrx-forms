import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/introduction', pathMatch: 'full' },
  {
    path: 'introduction',
    loadChildren: './introduction/introduction.module#IntroductionModule',
  },
  {
    path: 'simpleForm',
    loadChildren: './simple-form/simple-form.module#SimpleFormModule',
  },
];
