import { UnfocusAction } from '../actions';
import { formControlReducer } from '../control/reducer';
import { FormControlState, FormControlValueTypes } from '../state';

export function unfocus<TValue extends FormControlValueTypes>(state: FormControlState<TValue>) {
  return formControlReducer(state, new UnfocusAction(state.id));
}
