import { FocusAction } from '../actions';
import { formControlReducer } from '../control/reducer';
import { FormControlState, FormControlValueTypes } from '../state';

/**
 * This update function takes a form control state and marks it as focused (which
 * will also `.focus()` the form element).
 */
export function focus<TValue extends FormControlValueTypes>(state: FormControlState<TValue>) {
  return formControlReducer(state, new FocusAction(state.id));
}
