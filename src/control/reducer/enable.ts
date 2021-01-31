import {EnableAction, NgrxFormActionTypes} from '../../actions';
import { FormControlState, FormControlValueTypes } from '../../state';

export function enableReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: NgrxFormActionTypes,
): FormControlState<TValue> {
  if (action.type !== EnableAction.type) {
    return state;
  }

  if (state.isEnabled) {
    return state;
  }

  return {
    ...state,
    isEnabled: true,
    isDisabled: false,
  };
}
