import { FocusAction, NgrxFormActionTypes} from '../../actions';
import { FormControlState, FormControlValueTypes } from '../../state';

export function focusReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: NgrxFormActionTypes,
): FormControlState<TValue> {
  if (action.type !== FocusAction.type) {
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
