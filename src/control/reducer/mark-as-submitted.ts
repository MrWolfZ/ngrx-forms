import { Actions, MarkAsSubmittedAction } from '../../actions';
import { FormControlState, FormControlValueTypes } from '../../state';

export function markAsSubmittedReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: Actions<TValue>,
): FormControlState<TValue> {
  if (action.type !== MarkAsSubmittedAction.TYPE) {
    return state;
  }

  if (state.isSubmitted) {
    return state;
  }

  return {
    ...state,
    isSubmitted: true,
    isUnsubmitted: false,
  };
}
