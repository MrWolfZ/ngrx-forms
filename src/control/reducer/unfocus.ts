import {NgrxFormActionTypes, UnfocusAction} from '../../actions';
import { FormControlState, FormControlValueTypes } from '../../state';

export function unfocusReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: NgrxFormActionTypes,
): FormControlState<TValue> {
  if (action.type !== UnfocusAction.type) {
    return state;
  }

  if (state.isUnfocused) {
    return state;
  }

  return {
    ...state,
    isFocused: false,
    isUnfocused: true,
  };
}
