import { AbstractControlState, isArrayState, isGroupState } from '../state';
import { updateArray, updateGroup } from './';
import { ProjectFn2 } from './util';

function updateRecursiveSingle(parent: AbstractControlState<any>, updateFn: ProjectFn2<AbstractControlState<any>, AbstractControlState<any>>) {
  return (state: AbstractControlState<any>): AbstractControlState<any> => {
    if (isGroupState(state)) {
      const updateFunctions = Object.keys(state.controls).reduce((agg, key) => Object.assign(agg, {
        [key]: (s: AbstractControlState<any>, p: AbstractControlState<any>) => updateRecursiveSingle(p, updateFn)(s),
      }), {});
      state = updateGroup<any>(updateFunctions)(state);
      return updateFn(state, parent);
    }

    if (isArrayState(state)) {
      state = updateArray<any>((s, p) => updateRecursiveSingle(p, updateFn)(s))(state);
      return updateFn(state, parent);
    }

    return updateFn(state, parent);
  };
}

/**
 * Returns a function that applies all given update functions one after another to the given form state recursively.
 */
export function updateRecursive<TValue>(...updateFnArr: Array<ProjectFn2<AbstractControlState<any>, AbstractControlState<any>>>) {
  return (state: AbstractControlState<TValue>): AbstractControlState<TValue> => {
    return updateFnArr.reduce((s, updateFn) => updateRecursiveSingle(state, updateFn)(s), state);
  };
}
