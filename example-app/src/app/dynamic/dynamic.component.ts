import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AddArrayControlAction, FormGroupState, RemoveArrayControlAction } from 'ngrx-forms';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CreateGroupElementAction, FormValue, RemoveGroupElementAction, State } from './dynamic.reducer';

@Component({
  selector: 'ngf-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicPageComponent {
  formState$: Observable<FormGroupState<FormValue>>;
  arrayOptions$: Observable<number[]>;
  groupOptions$: Observable<string[]>;

  constructor(private store: Store<State>) {
    this.formState$ = store.pipe(select(s => s.dynamic.formState));
    this.arrayOptions$ = store.pipe(select(s => s.dynamic.array.options));
    this.groupOptions$ = store.pipe(select(s => s.dynamic.groupOptions));
  }

  addGroupOption() {
    const name = Math.random().toString(36).substr(2, 3);
    this.store.dispatch(new CreateGroupElementAction(name));
  }

  removeGroupOption(name: string) {
    this.store.dispatch(new RemoveGroupElementAction(name));
  }

  addArrayOption(index: number) {
    this.formState$.pipe(
      take(1),
      map(s => s.controls.array.id),
      map(id => new AddArrayControlAction(id, false, index)),
    ).subscribe(this.store);
  }

  removeArrayOption(index: number) {
    this.formState$.pipe(
      take(1),
      map(s => s.controls.array.id),
      map(id => new RemoveArrayControlAction(id, index)),
    ).subscribe(this.store);
  }

  trackByIndex(index: number) {
    return index;
  }

  trackById(_: number, id: string) {
    return id;
  }
}
