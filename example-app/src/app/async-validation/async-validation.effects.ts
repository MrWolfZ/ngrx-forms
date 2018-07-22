import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import {
  ClearAsyncErrorAction,
  SetAsyncErrorAction,
  StartAsyncValidationAction,
} from 'ngrx-forms';
import { Observable, timer } from 'rxjs';
import { catchError, concat, distinct, filter, flatMap, map, switchMap } from 'rxjs/operators';

import { SetSearchResultAction, State } from './async-validation.reducer';

@Injectable()
export class AsyncValidationEffects {

  @Effect()
  searchBooks$: Observable<Action> = this.store.pipe(
    select(s => s.asyncValidation.formState),
    filter(fs => !!fs.value.searchTerm && fs.controls.numberOfResultsToShow.isValid),
    distinct(fs => fs.value),
    switchMap(fs =>
      timer(300).pipe(
        map(() => new StartAsyncValidationAction(
          fs.controls.searchTerm.id,
          'exists',
        )),
        concat(
          this.httpClient.get(
            `https://www.googleapis.com/books/v1/volumes`,
            {
              params: {
                q: fs.value.searchTerm,
                maxResults: `${fs.value.numberOfResultsToShow}`,
              },
            }
          ).pipe(
            flatMap((resp: any) => {
              if (resp.totalItems > 0) {
                return [
                  new SetSearchResultAction(
                    resp.items.map((i: any) => i.volumeInfo.title),
                  ),
                  new ClearAsyncErrorAction(
                    fs.controls.searchTerm.id,
                    'exists',
                  ),
                ] as Action[];
              }

              return [
                new SetSearchResultAction([]),
                new SetAsyncErrorAction(
                  fs.controls.searchTerm.id,
                  'exists',
                  fs.value.searchTerm,
                ),
              ];
            }),
            catchError(_ => [
              new SetSearchResultAction([]),
              new SetAsyncErrorAction(
                fs.controls.searchTerm.id,
                'exists',
                fs.value.searchTerm,
              ),
            ]),
          )
        ),
      )
    )
  );

  constructor(private store: Store<State>, private httpClient: HttpClient) { }
}
