import {MarkAsPristineAction, NgrxFormActionTypes} from '../../actions';
import { FormControlState, FormControlValueTypes } from '../../state';

export function markAsPristineReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: NgrxFormActionTypes,
): FormControlState<TValue> {
  if (action.type !== MarkAsPristineAction.type) {
    return state;
  }

  if (state.isPristine) {
    return state;
  }

  return {
    ...state,
    isDirty: false,
    isPristine: true,
  };
}
