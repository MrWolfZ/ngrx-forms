import { MarkAsTouchedAction, NgrxFormActionTypes} from '../../actions';
import { FormControlState, FormControlValueTypes } from '../../state';

export function markAsTouchedReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: NgrxFormActionTypes,
): FormControlState<TValue> {
  if (action.type !== MarkAsTouchedAction.type) {
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
