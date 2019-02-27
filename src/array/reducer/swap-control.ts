import { Actions, SwapArrayControlAction } from '../../actions';
import { computeArrayState, FormArrayState } from '../../state';
import { childReducer, updateIdRecursive } from './util';

function swapArrayValues(a: ReadonlyArray<any>, i: number, j: number) {
  const n = [ ...a ];
  [ n[ i ], n[ j ] ] = [ n[ j ], n[ i ] ];
  return n;
}

export function swapControlReducer<TValue>(
  state: FormArrayState<TValue>,
  action: Actions<TValue[]>,
): FormArrayState<TValue> {
  if (action.type !== SwapArrayControlAction.TYPE) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  const from = action.fromIndex;
  const to = action.toIndex;

  if (from === to) {
    return state;
  }

  if (from >= state.controls.length || to >= state.controls.length) {
    throw new Error(`Index [${from >= state.controls.length ? `from:${from}` : `to:${to}`}]
     is out of bounds for array '${state.id}' with length ${state.controls.length}!`);
  }

  let controls = swapArrayValues(state.controls, from, to);
  controls = controls.map((c, i) => (i >= from || i >= to) ? updateIdRecursive(c, `${state.id}.${i}`) : c);

  return computeArrayState(
    state.id,
    controls,
    state.value,
    state.errors,
    state.pendingValidations,
    state.userDefinedProperties,
    {
      wasOrShouldBeDirty: true,
      wasOrShouldBeEnabled: state.isEnabled,
      wasOrShouldBeTouched: state.isTouched,
      wasOrShouldBeSubmitted: state.isSubmitted,
    }
  );
}
