import { UnfocusAction } from '../actions';
import { formControlReducer } from '../control/reducer';
import { FormControlState, FormControlValueTypes } from '../state';

/**
 * This update function takes a form control state and marks it as not focused (which
 * will also `.blur()` the form element).
 */
export function unfocus<TValue extends FormControlValueTypes>(state: FormControlState<TValue>) {
  return formControlReducer(state, new UnfocusAction(state.id));
}
