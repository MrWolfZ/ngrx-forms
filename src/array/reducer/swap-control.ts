import { Actions, SwapArrayControlAction } from '../../actions';
import { computeArrayState, FormArrayState } from '../../state';
import { childReducer, updateIdRecursive } from './util';

function swapArrayValues(a: readonly any[], i: number, j: number) {
  const n = [...a];
  [n[i], n[j]] = [n[j], n[i]];
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

  const fromIndex = action.fromIndex;
  const toIndex = action.toIndex;

  if (fromIndex === toIndex) {
    return state;
  }

  if (fromIndex < 0 || toIndex < 0) {
    throw new Error(`fromIndex ${fromIndex} or toIndex ${fromIndex} was negative`);
  }

  if (fromIndex >= state.controls.length || toIndex >= state.controls.length) {
    throw new Error(`fromIndex ${fromIndex} or toIndex ${toIndex} is out of bounds with the length of the controls ${state.controls.length}`);
  }

  let controls = swapArrayValues(state.controls, fromIndex, toIndex);
  controls = controls.map((c, i) => (i >= fromIndex || i >= toIndex) ? updateIdRecursive<any>(c, `${state.id}.${i}`) : c);

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
