import { SetValueAction } from '../actions';
import { FormArrayState, FormControlState, FormControlValueTypes, FormGroupState, InferredControlState } from '../state';
import { abstractControlReducer, ensureState } from './util';

/**
 * This update function takes a value and returns a projection function that
 * sets the value of a form state. Setting the value of a group or array will
 * also update the values of all children including adding and removing
 * children on the fly for added/removed properties/items.
 */
export function setValue<TValue>(value: TValue): (state: InferredControlState<TValue>) => InferredControlState<TValue>;

/**
 * This update function takes a value and a form control state and sets the
 * value of the state.
 */
export function setValue<TValue extends FormControlValueTypes>(value: TValue, state: FormControlState<TValue>): FormControlState<TValue>;

/**
 * This update function takes a value and a form array state and sets the
 * value of the state. This will also update the values of all children
 * including adding and removing children on the fly for added/removed
 * items.
 */
export function setValue<TValue>(value: TValue, state: FormArrayState<TValue>): FormArrayState<TValue>;

/**
 * This update function takes a value and a form group state and sets the
 * value of the state. This will also update the values of all children
 * including adding and removing children on the fly for added/removed
 * properties.
 */
export function setValue<TValue>(value: TValue, state: FormGroupState<TValue>): FormGroupState<TValue>;

/**
 * This update function takes a value and a form state and sets the value
 * of the state. Setting the value of a group or array will also update the
 * values of all children including adding and removing children on the fly
 * for added/removed properties/items.
 */
export function setValue<TValue>(value: TValue, state: InferredControlState<TValue>): InferredControlState<TValue>;

export function setValue<TValue>(value: TValue, state?: InferredControlState<TValue>) {
  if (!!state) {
    return abstractControlReducer(state, new SetValueAction(state.id, value));
  }

  return (s: InferredControlState<TValue>) => setValue(value, ensureState(s));
}
