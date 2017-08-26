import { FormControlState, FormControlValueTypes } from '../../state';
import { Actions, MarkAsDirtyAction } from '../../actions';

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
