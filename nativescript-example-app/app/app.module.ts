import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NgrxFormsModule, formControlReducer, createFormControlState } from 'ngrx-forms';

import { AppComponent, NgrxTextFieldViewAdapter } from './app.component';

@NgModule({
  declarations: [AppComponent, NgrxTextFieldViewAdapter],
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, CommonModule, StoreModule.forRoot<any>({
    controlState: formControlReducer,
  }, {
    initialState: {
      controlState: createFormControlState('test control', 'initial value'),
    },
  }), NgrxFormsModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
