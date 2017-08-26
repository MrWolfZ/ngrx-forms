import { FormControlState, FormControlValueTypes } from '../../state';
import { Actions, MarkAsUntouchedAction } from '../../actions';

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
