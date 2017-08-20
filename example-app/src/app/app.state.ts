import { Store } from '@ngrx/store';
import { FormGroupState, createFormGroupState } from '@ngrx/forms';

import { ItemFormValue } from './item-form/item-form.state';

export class TodoItem {
  readonly category: 'Private' | 'Work';
  readonly priority: number;
  readonly duedate: string;
  readonly text: string;
}

export interface AppState {
  items: TodoItem[];
  itemForm: FormGroupState<ItemFormValue>;
}

export const ITEM_FORM_ID = 'app/ITEM_FORM';

export const initialItemFormValue: ItemFormValue = {
  category: 'Private',
  priority: 1,
  duedate: new Date().toISOString(),
  text: '',
};

export const initialState: AppState = {
  items: [],
  itemForm: createFormGroupState(ITEM_FORM_ID, initialItemFormValue),
};

export interface RootState {
  app: AppState;
}
