import { Action, combineReducers } from '@ngrx/store';
import {
  AddArrayControlAction,
  addGroupControl,
  createFormGroupState,
  formGroupReducer,
  FormGroupState,
  RemoveArrayControlAction,
  setValue,
  updateGroup,
} from 'ngrx-forms';

import { State as RootState } from '../app.reducer';

export interface FormValue {
  array: boolean[];
  group: { [id: string]: boolean };
}

export interface State extends RootState {
  dynamic: {
    formState: FormGroupState<FormValue>;
    array: {
      maxIndex: number;
      options: number[];
    };
    groupOptions: string[];
  };
}

export class CreateGroupElementAction implements Action {
  static readonly TYPE = 'dynamic/CREATE_GROUP_ELEMENT';
  readonly type = CreateGroupElementAction.TYPE;
  constructor(public name: string) { }
}

export class RemoveGroupElementAction implements Action {
  static readonly TYPE = 'dynamic/REMOVE_GROUP_ELEMENT';
  readonly type = RemoveGroupElementAction.TYPE;
  constructor(public name: string) { }
}

export const FORM_ID = 'dynamic';

export const INITIAL_STATE = createFormGroupState<FormValue>(FORM_ID, {
  array: [false, false],
  group: {
    abc: false,
    xyz: false,
  },
});

export function formStateReducer(
  s = INITIAL_STATE,
  a: CreateGroupElementAction | RemoveGroupElementAction,
) {
  s = formGroupReducer(s, a);

  switch (a.type) {
    case CreateGroupElementAction.TYPE:
      return updateGroup<FormValue>({
        group: group => {
          const newGroup = addGroupControl(group, a.name, false);

          // alternatively we can also use setValue
          // const newValue = { ...group.value, [a.name]: false };
          // const newGroup = setValue(group, newValue);

          return newGroup;
        },
      })(s);

    case RemoveGroupElementAction.TYPE:
      return updateGroup<FormValue>({
        group: group => {
          const newValue = { ...group.value };
          delete newValue[a.name];
          const newGroup = setValue(group, newValue);

          // alternatively we can also use removeGroupControl
          // const newGroup = removeGroupControl(group, a.name);

          return newGroup;
        },
      })(s);

    default:
      return s;
  }
}

const reducers = combineReducers<State['dynamic'], any>({
  formState: formStateReducer,
  array(
    s = { maxIndex: 2, options: [1, 2] },
    a: AddArrayControlAction<boolean> | RemoveArrayControlAction,
  ) {
    switch (a.type) {
      case AddArrayControlAction.TYPE: {
        const maxIndex = s.maxIndex + 1;
        const options = [...s.options];
        // tslint:disable-next-line:no-unnecessary-type-assertion
        options.splice(a.index!, 0, maxIndex);
        return {
          maxIndex,
          options,
        };
      }

      case RemoveArrayControlAction.TYPE: {
        const options = [...s.options];
        // tslint:disable-next-line:no-unnecessary-type-assertion
        options.splice(a.index!, 1);
        return {
          ...s,
          options,
        };
      }

      default:
        return s;
    }
  },
  groupOptions(
    s: string[] = ['abc', 'xyz'],
    a: CreateGroupElementAction | RemoveGroupElementAction,
  ) {
    switch (a.type) {
      case CreateGroupElementAction.TYPE:
        return [...s, a.name];

      case RemoveGroupElementAction.TYPE:
        return s.filter(i => i !== a.name);

      default:
        return s;
    }
  },
});

export function reducer(s: State['dynamic'], a: Action) {
  return reducers(s, a);
}
