import { NgrxFormActionTypes, SetUserDefinedPropertyAction} from '../../actions';
import { FormArrayState } from '../../state';
import { childReducer } from './util';

export function setUserDefinedPropertyReducer<TValue>(
  state: FormArrayState<TValue>,
  action: NgrxFormActionTypes,
): FormArrayState<TValue> {
  if (action.type !== SetUserDefinedPropertyAction.type) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  if (state.userDefinedProperties[action.name] === action.value) {
    return state;
  }

  return {
    ...state,
    userDefinedProperties: {
      ...state.userDefinedProperties,
      [action.name]: action.value,
    },
  };
}
