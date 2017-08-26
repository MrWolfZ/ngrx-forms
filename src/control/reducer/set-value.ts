import { FormControlState, FormControlValueTypes } from '../../state';
import { Actions, SetValueAction } from '../../actions';

export function setValueReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: Actions<TValue>,
): FormControlState<TValue> {
  if (action.type !== SetValueAction.TYPE) {
    return state;
  }

  if (state.value === action.payload.value) {
    return state;
  }

  const value = action.payload.value;
  const valueType = typeof value;
  if (value !== null && ['string', 'number', 'boolean', 'undefined'].indexOf(valueType) === -1) {
    const errorMsg = 'Form control states only support undefined, null, string, number, and boolean values';
    throw new Error(`${errorMsg}; got ${JSON.stringify(action.payload.value)} of type "${valueType}"`); // `;
  }

  return {
    ...state,
    value: action.payload.value,
    isDirty: true,
    isPristine: false,
  };
}
