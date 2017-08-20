import { Store } from '@ngrx/store';
import { FormGroupState, createFormGroupState } from '@ngrx/forms';

import { ItemFormValue, initialItemFormValue } from './item-form/item-form.state';

export class TodoItem {
  readonly category: 'Private' | 'Work';
  readonly text: string;
  readonly meta: {
    readonly priority: number;
    readonly duedate: string;
  };
}

export interface AppState {
  items: TodoItem[];
  itemForm: FormGroupState<ItemFormValue>;
}

export const ITEM_FORM_ID = 'app/ITEM_FORM';

export const initialState: AppState = {
  items: [],
  itemForm: createFormGroupState(ITEM_FORM_ID, initialItemFormValue),
};

export interface RootState {
  app: AppState;
}
