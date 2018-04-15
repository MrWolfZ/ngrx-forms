import { Actions, MarkAsUntouchedAction } from '../../actions';
import { FormControlState, FormControlValueTypes } from '../../state';

export function markAsUntouchedReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: Actions<TValue>,
): FormControlState<TValue> {
  if (action.type !== MarkAsUntouchedAction.TYPE) {
    return state;
  }

  if (state.isUntouched) {
    return state;
  }

  return {
    ...state,
    isTouched: false,
    isUntouched: true,
  };
}
