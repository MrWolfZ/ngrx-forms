import { AbstractControlState, createFormArrayState, InferredControlState, isArrayState, isGroupState } from '../../state';

export const FORM_CONTROL_ID = 'test ID';
export const FORM_CONTROL_0_ID = `${FORM_CONTROL_ID}.0`;
export const FORM_CONTROL_1_ID = `${FORM_CONTROL_ID}.1`;
export const INITIAL_FORM_ARRAY_VALUE = ['', ''];
export const INITIAL_FORM_ARRAY_VALUE_NESTED_GROUP = [{ inner: '' }, { inner: '' }];
export const INITIAL_FORM_ARRAY_VALUE_NESTED_ARRAY = [[''], ['']];
export const INITIAL_STATE = createFormArrayState(FORM_CONTROL_ID, INITIAL_FORM_ARRAY_VALUE);
export const INITIAL_STATE_NESTED_GROUP = createFormArrayState(FORM_CONTROL_ID, INITIAL_FORM_ARRAY_VALUE_NESTED_GROUP);
export const INITIAL_STATE_NESTED_ARRAY = createFormArrayState(FORM_CONTROL_ID, INITIAL_FORM_ARRAY_VALUE_NESTED_ARRAY);

function setPropertyRecursively<TValue>(
  state: AbstractControlState<TValue>,
  property: keyof AbstractControlState<TValue>,
  value: any,
  ...excludeIds: string[]
): AbstractControlState<TValue> {
  if (excludeIds.indexOf(state.id) >= 0) {
    return state;
  }

  state = {
    ...state,
    [property]: value,
  };

  if (isArrayState(state)) {
    const controls = state.controls.map(s => setPropertyRecursively(s, property, value, ...excludeIds));
    return {
      ...state,
      controls,
    } as any;
  }

  if (isGroupState(state)) {
    let controls = state.controls;
    controls = Object.keys(controls).reduce((res, key) => {
      const s = setPropertyRecursively(controls[key], property, value, ...excludeIds);
      res[key] = s;
      return res;
    }, {} as any);

    return {
      ...state,
      controls,
    } as any;
  }

  return state;
}

export function setPropertiesRecursively<TValue>(
  state: AbstractControlState<TValue>,
  properties: [keyof AbstractControlState<TValue>, any][],
  ...excludeIds: string[]
): InferredControlState<TValue> {
  return properties.reduce((s, [p, v]) => setPropertyRecursively(s, p, v, ...excludeIds), state) as InferredControlState<TValue>;
}
