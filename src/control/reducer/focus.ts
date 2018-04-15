import { Actions, FocusAction } from '../../actions';
import { FormControlState, FormControlValueTypes } from '../../state';

export function focusReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: Actions<TValue>,
): FormControlState<TValue> {
  if (action.type !== FocusAction.TYPE) {
    return state;
  }

  if (state.isFocused) {
    return state;
  }

  return {
    ...state,
    isFocused: true,
    isUnfocused: false,
  };
}
