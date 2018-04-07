import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NgrxFormsModule } from 'ngrx-forms';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, StoreModule.forRoot({}), NgrxFormsModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
