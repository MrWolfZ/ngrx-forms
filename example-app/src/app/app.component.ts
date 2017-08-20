import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroupState } from '@ngrx/forms';
import { Observable } from 'rxjs/Observable';

import { RootState, TodoItem } from './app.state';
import { AddTodoItemAction } from './app.actions';
import { ItemFormValue } from './item-form/item-form.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  formState$: Observable<FormGroupState<ItemFormValue>>;
  items$: Observable<TodoItem[]>;

  constructor(private store: Store<RootState>) {
    this.formState$ = store.select(s => s.app.itemForm);
    this.items$ = store.select(s => s.app.items);
  }

  formatDate(date: Date) {
    const curr_date = date.getDate();
    const curr_month = date.getMonth() + 1; // Months are zero based
    const curr_year = date.getFullYear();
    return curr_year + '-' + curr_month + '-' + curr_date;
  }

  addTodoItem(item: TodoItem) {
    this.store.dispatch(new AddTodoItemAction(item));
  }
}
