import { FormControlState, FormControlValueTypes } from '../../state';
import { Actions, SetLastKeyDownCodeAction } from '../../actions';

export function setLastKeydownCodeReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: Actions<TValue>,
): FormControlState<TValue> {
  if (action.type !== SetLastKeyDownCodeAction.TYPE) {
    return state;
  }

  if (state.lastKeyDownCode === action.payload.lastKeyDownCode) {
    return state;
  }

  return {
    ...state,
    lastKeyDownCode: action.payload.lastKeyDownCode,
  };
}
