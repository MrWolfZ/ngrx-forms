import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {
  ClearAsyncErrorAction,
  SetAsyncErrorAction,
  StartAsyncValidationAction,
} from 'ngrx-forms';
import { Observable } from 'rxjs/Observable';

import { SetSearchResultAction, State } from './async-validation.reducer';

@Injectable()
export class AsyncValidationEffects {

  @Effect()
  searchBooks$: Observable<Action> = this.store
    .select(s => s.asyncValidation.formState)
    .filter(fs =>
      !!fs.value.searchTerm
      && fs.controls.numberOfResultsToShow.isValid)
    .distinct(fs => fs.value)
    .switchMap(fs =>
      Observable.timer(300)
        .map(() => new StartAsyncValidationAction(
          fs.controls.searchTerm.id,
          'exists',
        ))
        .concat(
        this.httpClient.get(
          `https://www.googleapis.com/books/v1/volumes`,
          {
            params: {
              q: fs.value.searchTerm,
              maxResults: `${fs.value.numberOfResultsToShow}`,
            },
          }
        )
          .flatMap((resp: any) => {
            if (resp.totalItems > 0) {
              return [
                new SetSearchResultAction(
                  resp.items.map((i: any) => i.volumeInfo.title),
                ),
                new ClearAsyncErrorAction(
                  fs.controls.searchTerm.id,
                  'exists',
                ),
              ];
            }

            return [
              new SetSearchResultAction([]),
              new SetAsyncErrorAction(
                fs.controls.searchTerm.id,
                'exists',
                fs.value.searchTerm,
              ),
            ];
          })
          .catch(_ => [
            new SetSearchResultAction([]),
            new SetAsyncErrorAction(
              fs.controls.searchTerm.id,
              'exists',
              fs.value.searchTerm,
            ),
          ])
        )
    );

  constructor(private store: Store<State>, private httpClient: HttpClient) { }
}
