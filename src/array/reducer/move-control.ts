import { Actions, MoveArrayControlAction } from '../../actions';
import { computeArrayState, FormArrayState } from '../../state';
import { childReducer, updateIdRecursive } from './util';

export function move(array: readonly any[], fromIndex: number, toIndex: number) {
  const item = array[fromIndex];
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

  let controls = move(state.controls, fromIndex, toIndex);

  controls = controls.map((c, i) => updateIdRecursive<any>(c, `${state.id}.${i}`));

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
