import { Actions, MoveArrayControlAction } from '../../actions';
import { computeArrayState, FormArrayState } from '../../state';
import { childReducer, updateIdRecursive } from './util';

export function move(array: ReadonlyArray<any>, fromIndex: number, toIndex: number) {
  const item = array[ fromIndex ];
  const length = array.length;
  if (fromIndex > toIndex) {
    return [
      ...array.slice(0, toIndex),
      item,
      ...array.slice(toIndex, fromIndex),
      ...array.slice(fromIndex + 1, length),
    ];
  } else {
    const targetIndex = toIndex + 1;
    return [
      ...array.slice(0, fromIndex),
      ...array.slice(fromIndex + 1, targetIndex),
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

  const from = action.fromIndex;
  const to = action.toIndex;

  if (from === to) {
    return state;
  }

  if (from >= state.controls.length || to >= state.controls.length) {
    throw new Error(`Index ${from >= state.controls.length ? from : to} is out of bounds for array '${state.id}' with length ${state.controls.length}!`); // `;
  }

  let controls = move(state.controls, from, to);

  controls = controls.map((c, i) => updateIdRecursive(c, `${state.id}.${i}`) );

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
