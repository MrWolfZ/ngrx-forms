import { FormControlState, FormControlValueTypes } from '../../state';
import { Actions, MarkAsUnsubmittedAction } from '../../actions';

export function markAsUnsubmittedReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: Actions<TValue>,
): FormControlState<TValue> {
  if (action.type !== MarkAsUnsubmittedAction.TYPE) {
    return state;
  }

  if (state.isUnsubmitted) {
    return state;
  }

  return {
    ...state,
    isSubmitted: false,
    isUnsubmitted: true,
  };
}
