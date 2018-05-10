import { Actions, SetValueAction } from '../../actions';
import { isBoxed } from '../../boxing';
import { FormControlState, FormControlValueTypes } from '../../state';

export function setValueReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: Actions<TValue>,
): FormControlState<TValue> {
  if (action.type !== SetValueAction.TYPE) {
    return state;
  }

  if (state.value === action.value) {
    return state;
  }

  const value = action.value;
  const valueType = typeof value;
  if (value !== null && ['string', 'number', 'boolean', 'undefined'].indexOf(valueType) === -1 && !isBoxed(value)) {
    const errorMsg = 'Form control states only support undefined, null, string, number, and boolean values as well as boxed values';
    throw new Error(`${errorMsg}; got ${JSON.stringify(action.value)} of type "${valueType}"`); // `;
  }

  return {
    ...state,
    value: action.value,
  };
}
