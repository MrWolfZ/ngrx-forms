import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/introduction', pathMatch: 'full' },
  {
    path: 'introduction',
    loadChildren: () => import('./introduction/introduction.module').then(m => m.IntroductionModule),
  },
  {
    path: 'simpleForm',
    loadChildren: () => import('./simple-form/simple-form.module').then(m => m.SimpleFormModule),
  },
  {
    path: 'simpleFormNgrx8',
    loadChildren: () => import('./simple-form-ngrx8/simple-form-ngrx8.module').then(m => m.SimpleFormNgrx8Module),
  },
  {
    path: 'syncValidation',
    loadChildren: () => import('./sync-validation/sync-validation.module').then(m => m.SyncValidationModule),
  },
  {
    path: 'asyncValidation',
    loadChildren: () => import('./async-validation/async-validation.module').then(m => m.AsyncValidationModule),
  },
  {
    path: 'array',
    loadChildren: () => import('./array/array.module').then(m => m.ArrayModule),
  },
  {
    path: 'dynamic',
    loadChildren: () => import('./dynamic/dynamic.module').then(m => m.DynamicModule),
  },
  {
    path: 'valueBoxing',
    loadChildren: () => import('./value-boxing/value-boxing.module').then(m => m.ValueBoxingModule),
  },
  {
    path: 'valueConversion',
    loadChildren: () => import('./value-conversion/value-conversion.module').then(m => m.ValueConversionModule),
  },
  {
    path: 'recursiveUpdate',
    loadChildren: () => import('./recursive-update/recursive-update.module').then(m => m.RecursiveUpdateModule),
  },
  {
    path: 'material',
    loadChildren: () => import('./material-example/material.module').then(m => m.MaterialExampleModule),
  },
  {
    path: 'localStateIntroduction',
    loadChildren: () => import('./local-state-introduction/local-state-introduction.module').then(m => m.LocalStateIntroductionModule),
  },
  {
    path: 'localStateAdvanced',
    loadChildren: () => import('./local-state-advanced/local-state-advanced.module').then(m => m.LocalStateAdvancedModule),
  },
  { path: '**', redirectTo: '/introduction' },
];
