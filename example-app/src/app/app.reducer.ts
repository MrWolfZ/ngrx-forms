import { Action } from '@ngrx/store';
import { groupUpdateReducer, updateGroup, setValue, validate, enable, disable, cast, compose } from 'ngrx-forms';

import { AppState, initialState, ITEM_FORM_ID } from './app.state';
import { Actions, AddTodoItemAction } from './app.actions';
import { ItemFormValue, MetaFormValue, validateText, validatePriority, validateDuedate } from './item-form/item-form.state';

const itemFormReducer = groupUpdateReducer<ItemFormValue>({
  text: validate(validateText),
  meta: updateGroup({
    priority: validate(validatePriority),
    duedate: validate(validateDuedate),
  }),
}, {
    meta: (meta, itemForm) => updateGroup<MetaFormValue>({
      priority: priority => {
        if (itemForm.value.category === 'Private') {
          return setValue<number>(0)(disable(cast(priority)));
        }

        return priority.isEnabled ? priority : setValue<number>(1)(enable(cast(priority)));
      },
    })(cast(meta)),
  });

export function appReducer(state = initialState, action: Actions): AppState {
  const itemForm = itemFormReducer(state.itemForm, action);
  if (itemForm !== state.itemForm) {
    state = { ...state, itemForm };
  }

  switch (action.type) {
    case AddTodoItemAction.TYPE:
      return {
        ...state,
        items: [...state.items, action.item],
        itemForm: itemFormReducer(initialState.itemForm, { type: '' }),
      };

    default: {
      return state;
    }
  }
}

export const reducers = {
  app: appReducer,
};
