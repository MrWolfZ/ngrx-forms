import { Injectable } from '@angular/core';
import {  Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { debounceTime, delay, map } from 'rxjs/operators';

import {
  GetManufacturersAction,
  ManufacturersActionsTypes,
  SetManufacturersAction
} from './local-state-advanced.reducer';

@Injectable()
export class LocalStateAdvancedEffects {

  @Effect()
  getManufacturers$: Observable<ManufacturersActionsTypes> = this.actions$.pipe(
    debounceTime(300),
    delay(1000),
    ofType(GetManufacturersAction.type),
    map((action: ManufacturersActionsTypes) => {
      if (action.type === GetManufacturersAction.type) {
        if (action.countryCode === 'US') {
          return SetManufacturersAction(['Ford', 'Chevrolet']);
        } else if (action.countryCode === 'UK') {
          return SetManufacturersAction(['Aston Martin', 'Jaguar']);
        } else {
          return SetManufacturersAction([]);
        }
      }
      return SetManufacturersAction([]);
    })
  );

  constructor(private actions$: Observable<ManufacturersActionsTypes>) { }
}
