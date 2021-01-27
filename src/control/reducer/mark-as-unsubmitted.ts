import { MarkAsUnsubmittedAction, NgrxFormActionTypes} from '../../actions';
import { FormControlState, FormControlValueTypes } from '../../state';

export function markAsUnsubmittedReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: NgrxFormActionTypes,
): FormControlState<TValue> {
  if (action.type !== MarkAsUnsubmittedAction.type) {
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
