import { Actions, MoveArrayControlAction } from '../../actions';
import { computeArrayState, FormArrayState } from '../../state';
import { childReducer, updateIdRecursive } from './util';

export function move(array: ReadonlyArray<any>, from: number, to: number) {
  const item = array[ from ];
  const length = array.length;
  const diff = from - to;
  if (diff > 0) {
    return [
      ...array.slice(0, to),
      item,
      ...array.slice(to, from),
      ...array.slice(from + 1, length),
    ];
  } else {
    const targetIndex = to + 1;
    return [
      ...array.slice(0, from),
      ...array.slice(from + 1, targetIndex),
      item,
      ...array.slice(targetIndex, length),
    ];
  }
}

export function moveControlReducer<TValue>(
  state: FormArrayState<TValue>,
  action: Actions<TValue[]>,
): FormArrayState<TValue> {
  if (action.type !== MoveArrayControlAction.TYPE) {
    return state;
  }
  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  const from = action.from;
  const to = action.to;

  if (from === to) {
    return state;
  }

  if (from >= state.controls.length || to >= state.controls.length) {
    throw new Error(`Index ${from >= state.controls.length ? from : to} is out of bounds for array '${state.id}' with length ${state.controls.length}!`); // `;
  }

  let controls = move(state.controls, from, to);

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
