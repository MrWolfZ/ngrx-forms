import { Action } from '@ngrx/store';
import { AbstractControlState, FormGroupState, formGroupReducer, createFormGroupState, SetErrorsAction } from '@ngrx/forms';

import { AppState, initialState, ITEM_FORM_ID } from './app.state';
import { Actions, AddTodoItemAction } from './app.actions';
import { ItemFormValue, textValidator, priorityValidator, duedateValidator, initialItemFormValue } from './item-form/item-form.state';

function formGroupValidatorReducer<TValue extends object, TValidateValue = TValue>(
  validatorFn: (value: TValidateValue) => any,
  controlSelector: (state: FormGroupState<TValue>) => AbstractControlState<TValidateValue> = state => state as any,
) {
  return (state: FormGroupState<TValue>, action: Action) => {
    const newState = formGroupReducer(state, action);
    const validateState = controlSelector(state);
    const newValidateState = controlSelector(newState);
    return formGroupReducer(newState, new SetErrorsAction(newValidateState.id, validatorFn(newValidateState.value)));
  };
}

function composeReducers<TState>(...reducers: ((state: TState, action: Action) => TState)[]) {
  return (state: TState, action: Action) => {
    return reducers.reduce((agg, reducer) => reducer(agg, action), state);
  };
}

const meta = (state: FormGroupState<ItemFormValue>) => state.controls.meta as FormGroupState<any>;
const textValidatorReducer = formGroupValidatorReducer<ItemFormValue, string>(textValidator, s => s.controls.text);
const priorityValidatorReducer = formGroupValidatorReducer<ItemFormValue, number>(priorityValidator, s => meta(s).controls.priority);
const duedateValidatorReducer = formGroupValidatorReducer<ItemFormValue, string>(duedateValidator, s => meta(s).controls.duedate);
const itemFormValidatorReducer = composeReducers(textValidatorReducer, priorityValidatorReducer, duedateValidatorReducer);

const initialItemFormState = itemFormValidatorReducer(initialState.itemForm, { type: '' });

export function appReducer(state = { ...initialState, itemForm: initialItemFormState }, action: Actions): AppState {
  const itemForm = itemFormValidatorReducer(state.itemForm, action);
  if (itemForm !== state.itemForm) {
    state = { ...state, itemForm };
  }

  switch (action.type) {
    case AddTodoItemAction.TYPE:
      return {
        ...state,
        items: [...state.items, action.item],
        itemForm: initialItemFormState,
      };

    default: {
      return state;
    }
  }
}

export const reducers = {
  app: appReducer,
};
