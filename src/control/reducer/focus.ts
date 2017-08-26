import { FormControlState, FormControlValueTypes } from '../../state';
import { Actions, FocusAction } from '../../actions';

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
