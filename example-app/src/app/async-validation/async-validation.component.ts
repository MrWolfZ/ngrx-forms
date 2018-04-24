import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import { Observable } from 'rxjs/Rx';

import { FormValue, State } from './async-validation.reducer';

@Component({
  selector: 'ngf-async-validation',
  templateUrl: './async-validation.component.html',
  styleUrls: ['./async-validation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsyncValidationPageComponent {
  formState$: Observable<FormGroupState<FormValue>>;
  searchResults$: Observable<string[]>;

  reducerCode = `
import { Action } from '@ngrx/store';
import {
  createFormGroupReducerWithUpdate,
  createFormGroupState,
  FormGroupState,
  validate,
} from 'ngrx-forms';
import { greaterThan, required } from 'ngrx-forms/validation';

export interface FormValue {
  searchTerm: string;
  numberOfResultsToShow: number;
}

export class SetSearchResultAction implements Action {
  static TYPE = 'asyncValidation/SET_SEARCH_RESULT';
  type = SetSearchResultAction.TYPE;
  constructor(public results: string[]) { }
}

export const FORM_ID = 'asyncValidation';

export const INITIAL_STATE = createFormGroupState<FormValue>(FORM_ID, {
  searchTerm: '',
  numberOfResultsToShow: 5,
});

const formGroupReducerWithUpdate = createFormGroupReducerWithUpdate<FormValue>({
  searchTerm: validate(required),
  numberOfResultsToShow: validate([required, greaterThan(0)]),
});

export const reducers = {
  formState(s = INITIAL_STATE, a: Action) {
    return formGroupReducerWithUpdate(s, a);
  },
  searchResults(s = [], a: SetSearchResultAction) {
    if (a.type === SetSearchResultAction.TYPE) {
      return a.results;
    }

    return s;
  },
};
  `;

  componentCode = `
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroupState } from 'ngrx-forms';

import { FormValue } from '../async-validation.reducer';

@Component({
  selector: 'ngf-async-validation-example',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsyncValidationFormComponent {
  @Input() formState: FormGroupState<FormValue>;
  @Input() searchResults: string[];
}
  `;

  componentHtml = `
<div>
  <label>Search Term</label>
  <div>
    <input type="text"
           [ngrxFormControlState]="formState.controls.searchTerm" />
    <span *ngIf="formState.isValidationPending">Searching...</span>
  </div>
</div>
<div>
  <label>Nr of results</label>
  <div>
    <input type="number"
           [ngrxFormControlState]="formState.controls.numberOfResultsToShow" />
  </div>
</div>

<ul *ngIf="formState.isInvalid"
    class="error-messages">
  <li *ngIf="formState.errors._searchTerm?.$exists">
    The search returned no results
  </li>
  <li *ngIf="formState.errors._numberOfResultsToShow?.required">
    The number of results must be specified
  </li>
  <li *ngIf="formState.errors._numberOfResultsToShow?.greaterThan">
    The number of results must be at least 1
  </li>
</ul>

<ul *ngIf="searchResults.length > 0">
  <li *ngFor="let r of searchResults">
    {{ r }}
  </li>
</ul>
  `;

  effectsCode = `
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
          \`https://www.googleapis.com/books/v1/volumes\`,
          {
            params: {
              q: fs.value.searchTerm,
              maxResults: \`$\{fs.value.numberOfResultsToShow\}\`,
            }
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
          .catch(resp => [
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
  `;

  constructor(store: Store<State>) {
    this.formState$ = store.select(s => s.asyncValidation.formState);
    this.searchResults$ = store.select(s => s.asyncValidation.searchResults);
  }
}
