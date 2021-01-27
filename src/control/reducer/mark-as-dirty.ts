import { MarkAsDirtyAction, NgrxFormActionTypes} from '../../actions';
import { FormControlState, FormControlValueTypes } from '../../state';

export function markAsDirtyReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: NgrxFormActionTypes,
): FormControlState<TValue> {
  if (action.type !== MarkAsDirtyAction.type) {
    return state;
  }

  if (state.isDirty) {
    return state;
  }

  return {
    ...state,
    isDirty: true,
    isPristine: false,
  };
}
