import { Action } from '@ngrx/store';
import {
  AddArrayControlAction,
  addControl,
  cast,
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
  static TYPE = 'dynamic/CREATE_GROUP_ELEMENT';
  type = CreateGroupElementAction.TYPE;
  constructor(public name: string) { }
}

export class RemoveGroupElementAction implements Action {
  static TYPE = 'dynamic/REMOVE_GROUP_ELEMENT';
  type = RemoveGroupElementAction.TYPE;
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

export const reducers = {
  formState(
    s = INITIAL_STATE,
    a: CreateGroupElementAction | RemoveGroupElementAction,
  ) {
    s = formGroupReducer(s, a);

    switch (a.type) {
      case CreateGroupElementAction.TYPE:
        return updateGroup<FormValue>({
          group: group => {
            const newGroup = addControl<typeof INITIAL_STATE.value.group, string>(a.name, false)(cast(group));

            // alternatively we can also use setValue
            // const newValue = { ...group.value, [a.name]: false };
            // const newGroup = setValue(newValue, cast(group));

            return newGroup;
          },
        })(s);

      case RemoveGroupElementAction.TYPE:
        return updateGroup<FormValue>({
          group: group => {
            const newValue = { ...group.value };
            delete newValue[a.name];
            const newGroup = setValue(newValue, cast(group));

            // alternatively we can also use removeControl
            // const newGroup = removeControl<typeof INITIAL_STATE.value.group>(a.name)(cast(group));

            return newGroup;
          },
        })(s);

      default:
        return s;
    }
  },
  array(
    s = { maxIndex: 2, options: [1, 2] },
    a: AddArrayControlAction<boolean> | RemoveArrayControlAction,
  ) {
    switch (a.type) {
      case AddArrayControlAction.TYPE: {
        const maxIndex = s.maxIndex + 1;
        const options = [...s.options];
        options.splice(a.payload.index!, 0, maxIndex);
        return {
          maxIndex,
          options,
        };
      }

      case RemoveArrayControlAction.TYPE: {
        const options = [...s.options];
        options.splice(a.payload.index!, 1);
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
    s = ['abc', 'xyz'],
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
};
