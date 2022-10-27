import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { debounceTime, delay, map } from 'rxjs/operators';

import { GetManufacturersAction, SetManufacturersAction } from './local-state-advanced.reducer';

@Injectable()
export class LocalStateAdvancedEffects {

  
  getManufacturers$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(GetManufacturersAction.TYPE),
    debounceTime(300),
    delay(1000),
    map((action: GetManufacturersAction) => {
      if (action.countryCode === 'US') {
        return new SetManufacturersAction(['Ford', 'Chevrolet']);
      } else if (action.countryCode === 'UK') {
        return new SetManufacturersAction(['Aston Martin', 'Jaguar']);
      } else {
        return new SetManufacturersAction([]);
      }
    })
  ));

  constructor(private actions$: Actions) { }
}
