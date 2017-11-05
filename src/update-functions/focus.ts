import { FocusAction } from '../actions';
import { formControlReducer } from '../control/reducer';
import { FormControlState, FormControlValueTypes } from '../state';

/*
 * Marks a given form control state as focused.
 */
export function focus<TValue extends FormControlValueTypes>(state: FormControlState<TValue>) {
  return formControlReducer(state, new FocusAction(state.id));
}
