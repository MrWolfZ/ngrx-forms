import { RemoveControlAction } from '../actions';
import { formGroupReducer } from '../group/reducer';
import { FormGroupState, KeyValue } from '../state';

export function removeControl<TValue extends KeyValue>(name: keyof TValue) {
  return (state: FormGroupState<TValue>) => formGroupReducer(state, new RemoveControlAction<TValue>(state.id, name));
}
