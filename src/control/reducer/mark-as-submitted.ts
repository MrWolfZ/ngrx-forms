import { MarkAsSubmittedAction, NgrxFormActionTypes} from '../../actions';
import { FormControlState, FormControlValueTypes } from '../../state';

export function markAsSubmittedReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: NgrxFormActionTypes,
): FormControlState<TValue> {
  if (action.type !== MarkAsSubmittedAction.type) {
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
