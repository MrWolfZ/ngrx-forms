import { Action } from '@ngrx/store';

import { TodoItem } from './app.state';

export class AddTodoItemAction implements Action {
  static readonly TYPE = 'app/ADD_TODO_ITEM';
  readonly type = AddTodoItemAction.TYPE;

  constructor(public readonly item: TodoItem) { }
}

export type Actions =
  | AddTodoItemAction
  ;
