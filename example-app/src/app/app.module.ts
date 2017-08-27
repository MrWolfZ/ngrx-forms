import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { HttpModule } from '@angular/http';
import { MaterialModule, MdNativeDateModule } from '@angular/material';
import { NgrxFormsModule } from 'ngrx-forms';

import { reducers } from './app.reducer';
import { AppComponent } from './app.component';
import { ItemFormComponent } from './item-form/item-form.component';
import { NgrxMdSelectValueAccessor } from './md-select-value-accessor';

@NgModule({
  declarations: [
    AppComponent,
    ItemFormComponent,
    NgrxMdSelectValueAccessor,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    MdNativeDateModule,
    NgrxFormsModule,
    HttpModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({ maxAge: 30 }),
    EffectsModule.forRoot([]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
