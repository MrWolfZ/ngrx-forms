import { FormControlState, FormControlValueTypes } from '../../state';
import { Actions, MarkAsPristineAction } from '../../actions';

export function markAsPristineReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: Actions<TValue>,
): FormControlState<TValue> {
  if (action.type !== MarkAsPristineAction.TYPE) {
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
