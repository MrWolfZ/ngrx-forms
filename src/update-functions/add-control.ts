import { AddControlAction } from '../actions';
import { formGroupReducer } from '../group/reducer';
import { FormGroupState, KeyValue } from '../state';

export function addControl<TValue extends KeyValue, TControlKey extends keyof TValue>(
  name: keyof TValue,
  value: TValue[TControlKey],
) {
  return (state: FormGroupState<TValue>) => formGroupReducer(state, new AddControlAction<TValue, TControlKey>(state.id, name, value));
}
