import { AbstractControlState, createFormArrayState, FormState, isArrayState, isGroupState } from '../../state';

export const FORM_CONTROL_ID = 'test ID';
export const FORM_CONTROL_0_ID = `${FORM_CONTROL_ID}.0`;
export const FORM_CONTROL_1_ID = `${FORM_CONTROL_ID}.1`;
export const INITIAL_FORM_ARRAY_VALUE = ['', ''];
export const INITIAL_FORM_ARRAY_VALUE_NESTED_GROUP = [{ inner: '' }, { inner: '' }];
export const INITIAL_FORM_ARRAY_VALUE_NESTED_ARRAY = [[''], ['']];
export const INITIAL_STATE = createFormArrayState(FORM_CONTROL_ID, INITIAL_FORM_ARRAY_VALUE);
export const INITIAL_STATE_NESTED_GROUP = createFormArrayState(FORM_CONTROL_ID, INITIAL_FORM_ARRAY_VALUE_NESTED_GROUP);
export const INITIAL_STATE_NESTED_ARRAY = createFormArrayState(FORM_CONTROL_ID, INITIAL_FORM_ARRAY_VALUE_NESTED_ARRAY);

export interface DeeplyNestedGroupFormValue {
  i: string;
  deep: {
    inners: {
      inner: string;
    }[];
  };
}

export const INITIAL_DEEPLY_NESTED_GROUPS_FORM_VALUE: DeeplyNestedGroupFormValue[] = [
  {
    i: '0',
    deep: {
      inners: [
        { inner: 'inner-0-0' },
        { inner: 'inner-0-1' },
      ],
    },
  },
  {
    i: '1',
    deep: {
      inners: [
        { inner: 'inner-1-0' },
        { inner: 'inner-1-1' },
        { inner: 'inner-1-2' },
      ],
    },
  },
  {
    i: '2',
    deep: {
      inners: [
        { inner: 'inner-2-0' },
      ],
    },
  },
];

export const INITIAL_DEEPLY_NESTED_GROUPS_FORM_STATE = createFormArrayState(FORM_CONTROL_ID, INITIAL_DEEPLY_NESTED_GROUPS_FORM_VALUE);

function setPropertyRecursively<TValue>(
  state: AbstractControlState<TValue>,
  property: keyof AbstractControlState<TValue>,
  value: any,
): AbstractControlState<TValue> {
  state = {
    ...state,
    [property]: value,
  };

  if (isArrayState(state)) {
    const controls = state.controls.map(s => setPropertyRecursively(s, property, value));
    return {
      ...state,
      controls,
    } as any;
  }

  if (isGroupState(state)) {
    let controls = state.controls;
    controls = Object.keys(controls).reduce((res, key) => {
      const s = setPropertyRecursively(controls[key], property, value);
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
): FormState<TValue> {
  return properties.reduce((s, [p, v]) => setPropertyRecursively(s, p, v), state) as FormState<TValue>;
}
