import { MarkAsSubmittedAction, NgrxFormActionTypes} from '../../actions';
import { computeArrayState, FormArrayState } from '../../state';
import { childReducer, dispatchActionPerChild } from './util';

export function markAsSubmittedReducer<TValue>(
  state: FormArrayState<TValue>,
  action: NgrxFormActionTypes,
): FormArrayState<TValue> {
  if (action.type !== MarkAsSubmittedAction.type) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  const controls = dispatchActionPerChild(state.controls, controlId => MarkAsSubmittedAction(controlId));

  if (controls === state.controls) {
    return state;
  }

  return computeArrayState(
    state.id,
    controls,
    state.value,
    state.errors,
    state.pendingValidations,
    state.userDefinedProperties,
    {
      wasOrShouldBeDirty: state.isDirty,
      wasOrShouldBeEnabled: state.isEnabled,
      wasOrShouldBeTouched: state.isTouched,
      wasOrShouldBeSubmitted: true,
    },
  );
}
