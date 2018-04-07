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
  {
    path: 'syncValidation',
    loadChildren: './sync-validation/sync-validation.module#SyncValidationModule',
  },
  {
    path: 'asyncValidation',
    loadChildren: './async-validation/async-validation.module#AsyncValidationModule',
  },
  {
    path: 'array',
    loadChildren: './array/array.module#ArrayModule',
  },
  {
    path: 'dynamic',
    loadChildren: './dynamic/dynamic.module#DynamicModule',
  },
  {
    path: 'valueConversion',
    loadChildren: './value-conversion/value-conversion.module#ValueConversionModule',
  },
  {
    path: 'recursiveUpdate',
    loadChildren: './recursive-update/recursive-update.module#RecursiveUpdateModule',
  },
  {
    path: 'material',
    loadChildren: './material-example/material.module#MaterialExampleModule',
  },
  { path: '**', redirectTo: '/introduction' },
];
