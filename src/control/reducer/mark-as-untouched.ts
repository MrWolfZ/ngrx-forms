import { MarkAsUntouchedAction, NgrxFormActionTypes} from '../../actions';
import { FormControlState, FormControlValueTypes } from '../../state';

export function markAsUntouchedReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: NgrxFormActionTypes,
): FormControlState<TValue> {
  if (action.type !== MarkAsUntouchedAction.type) {
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
