import { Actions, MarkAsTouchedAction } from '../../actions';
import { FormControlState, FormControlValueTypes } from '../../state';

export function markAsTouchedReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: Actions<TValue>,
): FormControlState<TValue> {
  if (action.type !== MarkAsTouchedAction.TYPE) {
    return state;
  }

  if (state.isTouched) {
    return state;
  }

  return {
    ...state,
    isTouched: true,
    isUntouched: false,
  };
}
