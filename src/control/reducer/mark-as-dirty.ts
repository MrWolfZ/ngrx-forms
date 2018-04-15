import { Actions, MarkAsDirtyAction } from '../../actions';
import { FormControlState, FormControlValueTypes } from '../../state';

export function markAsDirtyReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: Actions<TValue>,
): FormControlState<TValue> {
  if (action.type !== MarkAsDirtyAction.TYPE) {
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
