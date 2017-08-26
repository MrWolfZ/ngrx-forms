import { FormControlState, FormControlValueTypes } from '../../state';
import { Actions, EnableAction } from '../../actions';

export function enableReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: Actions<TValue>,
): FormControlState<TValue> {
  if (action.type !== EnableAction.TYPE) {
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
