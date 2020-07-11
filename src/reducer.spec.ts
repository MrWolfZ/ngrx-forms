import { Action, createReducer } from '@ngrx/store';
import { MarkAsDirtyAction, MarkAsTouchedAction, SetValueAction } from './actions';
import { formArrayReducer } from './array/reducer';
import { formControlReducer } from './control/reducer';
import { formGroupReducer } from './group/reducer';
import { createFormStateReducerWithUpdate, formStateReducer, onNgrxForms, onNgrxFormsAction, wrapReducerWithFormStateUpdate } from './reducer';
import { FormArrayState, FormControlState, FormGroupState } from './state';
import { FORM_CONTROL_ID, FORM_CONTROL_INNER5_ID, FORM_CONTROL_INNER_ID, FormGroupValue, INITIAL_STATE } from './update-function/test-util';
import { updateGroup } from './update-function/update-group';

describe(formStateReducer.name, () => {
  it('should apply the action to controls', () => {
    const resultState = formStateReducer<FormGroupValue['inner']>(INITIAL_STATE.controls.inner, new MarkAsTouchedAction(FORM_CONTROL_INNER_ID));
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner);
  });

  it('should apply the action to groups', () => {
    const resultState = formStateReducer<FormGroupValue>(INITIAL_STATE, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect(resultState).not.toBe(INITIAL_STATE);
  });

  it('should apply the action to arrays', () => {
    const resultState = formStateReducer<FormGroupValue['inner5']>(INITIAL_STATE.controls.inner5, new MarkAsTouchedAction(FORM_CONTROL_INNER5_ID));
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner5);
  });

  it('should throw if state is undefined', () => {
    expect(() => formStateReducer(undefined, { type: '' })).toThrowError();
  });

  it('should throw if state is not a form state', () => {
    expect(() => formStateReducer({} as any, { type: '' })).toThrowError();
  });
});

describe(createFormStateReducerWithUpdate.name, () => {
  it('should apply the action and the provided functions to controls', () => {
    const value = 'A';
    const resultState = createFormStateReducerWithUpdate<FormGroupValue['inner']>(s => ({ ...s, value }))(
      INITIAL_STATE.controls.inner,
      new MarkAsTouchedAction(FORM_CONTROL_INNER_ID),
    );
    expect(resultState.isTouched).toBe(true);
    expect(resultState.value).toBe(value);
  });

  it('should apply the action and the provided functions to groups', () => {
    const userDefinedProperties = { value: 'A' };
    const resultState = createFormStateReducerWithUpdate<FormGroupValue>(s => ({ ...s, userDefinedProperties }))(
      INITIAL_STATE,
      new MarkAsTouchedAction(FORM_CONTROL_ID),
    );
    expect(resultState.isTouched).toBe(true);
    expect(resultState.userDefinedProperties).toEqual(userDefinedProperties);
  });

  it('should apply the action and the provided functions to arrays', () => {
    const userDefinedProperties = { value: 'A' };
    const resultState = createFormStateReducerWithUpdate<FormGroupValue['inner5']>(s => ({ ...s, userDefinedProperties }))(
      INITIAL_STATE.controls.inner5,
      new MarkAsTouchedAction(FORM_CONTROL_INNER5_ID),
    );
    expect(resultState.isTouched).toBe(true);
    expect(resultState.userDefinedProperties).toEqual(userDefinedProperties);
  });

  it('should apply multiple update functions', () => {
    const value = 'A';
    const resultState = createFormStateReducerWithUpdate<FormGroupValue['inner']>(
      s => ({ ...s, value: `${s.value}${value}` }),
      s => ({ ...s, value: `${s.value}${value}` }),
    )(
      INITIAL_STATE.controls.inner,
      new MarkAsTouchedAction(FORM_CONTROL_INNER_ID),
    );
    expect(resultState.isTouched).toBe(true);
    expect(resultState.value).toBe(`${value}${value}`);
  });

  it('should apply an array of update functions', () => {
    const value = 'A';
    const resultState = createFormStateReducerWithUpdate<FormGroupValue['inner']>([
      s => ({ ...s, value: `${s.value}${value}` }),
      s => ({ ...s, value: `${s.value}${value}` }),
    ])(
      INITIAL_STATE.controls.inner,
      new MarkAsTouchedAction(FORM_CONTROL_INNER_ID),
    );
    expect(resultState.isTouched).toBe(true);
    expect(resultState.value).toBe(`${value}${value}`);
  });

  it('should first apply the action and then the provided functions', () => {
    const expected = { ...INITIAL_STATE.controls.inner, value: 'A' };
    const resultState = createFormStateReducerWithUpdate<FormGroupValue['inner']>(() => expected)(
      INITIAL_STATE.controls.inner,
      new MarkAsTouchedAction(FORM_CONTROL_INNER_ID),
    );
    expect(resultState).toBe(expected);
  });

  it('should apply multiple provided function objects one after another', () => {
    const updatedInner1 = { ...INITIAL_STATE.controls.inner, value: 'A' };
    const expectedInner1 = { ...INITIAL_STATE.controls.inner, value: 'B' };
    const expectedInner3 = { ...INITIAL_STATE.controls.inner3!, value: { inner4: 'A' } };
    const resultState = createFormStateReducerWithUpdate<FormGroupValue>(
      updateGroup<FormGroupValue>(
        {
          inner: () => updatedInner1,
          inner3: () => expectedInner3,
        },
      ),
      updateGroup<FormGroupValue>(
        {
          inner: () => expectedInner1,
        },
      ),
    )(INITIAL_STATE, new SetValueAction(FORM_CONTROL_INNER_ID, 'D'));
    expect(resultState.controls.inner).toBe(expectedInner1);
    expect(resultState.controls.inner3).toBe(expectedInner3);
  });

  it('should not apply the update functions if the form state did not change', () => {
    const expected = { ...INITIAL_STATE.controls.inner, value: 'A' };
    const resultState = createFormStateReducerWithUpdate<FormGroupValue['inner']>(() => expected)(INITIAL_STATE.controls.inner, { type: '' });
    expect(resultState).toBe(INITIAL_STATE.controls.inner);
  });

  it('should throw if state is undefined', () => {
    expect(() => createFormStateReducerWithUpdate<any>(s => s)(undefined, { type: '' })).toThrowError();
  });
});

describe(onNgrxForms.name, () => {
  it('should call the reducer for controls', () => {
    const state = {
      prop: 'value',
      form: INITIAL_STATE.controls.inner,
    };

    const resultState = onNgrxForms<typeof state>().reducer(state, new MarkAsTouchedAction(FORM_CONTROL_INNER_ID));
    expect(resultState.form.id).toBe(INITIAL_STATE.controls.inner.id);
    expect(resultState.form).not.toBe(INITIAL_STATE.controls.inner);
  });

  it('should call the reducer for top-level controls', () => {
    const state = INITIAL_STATE.controls.inner;

    const resultState = onNgrxForms<typeof state>().reducer(state, new MarkAsTouchedAction(FORM_CONTROL_INNER_ID));
    expect(resultState.id).toBe(INITIAL_STATE.controls.inner.id);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner);
  });

  it('should call the reducer for groups', () => {
    const state = {
      prop: 'value',
      form: INITIAL_STATE,
    };

    const resultState = onNgrxForms<typeof state>().reducer(state, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect(resultState.form).not.toBe(INITIAL_STATE);
  });

  it('should call the reducer for top-level groups', () => {
    const state = INITIAL_STATE;

    const resultState = onNgrxForms<typeof state>().reducer(state, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect(resultState.id).toBe(INITIAL_STATE.id);
    expect(resultState).not.toBe(INITIAL_STATE);
  });

  it('should call the reducer for arrays', () => {
    const state = {
      prop: 'value',
      form: INITIAL_STATE.controls.inner5,
    };

    const resultState = onNgrxForms<typeof state>().reducer(state, new MarkAsTouchedAction(FORM_CONTROL_INNER5_ID));
    expect(resultState.form).not.toBe(INITIAL_STATE.controls.inner5);
  });

  it('should call the reducer for top-level arrays', () => {
    const state = INITIAL_STATE.controls.inner5;

    const resultState = onNgrxForms<typeof state>().reducer(state, new MarkAsTouchedAction(FORM_CONTROL_INNER5_ID));
    expect(resultState.id).toBe(INITIAL_STATE.controls.inner5.id);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner5);
  });

  it('should work with createReducer', () => {
    const state = {
      prop: 'value',
      control: INITIAL_STATE.controls.inner,
      group: INITIAL_STATE,
      array: INITIAL_STATE.controls.inner5,
    };

    const reducer = createReducer(
      state,
      onNgrxForms(),
    );

    let resultState = reducer(state, new MarkAsTouchedAction(FORM_CONTROL_INNER_ID));
    expect(resultState.control).not.toBe(INITIAL_STATE.controls.inner);

    resultState = reducer(state, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect(resultState.group).not.toBe(INITIAL_STATE);

    resultState = reducer(state, new MarkAsTouchedAction(FORM_CONTROL_INNER5_ID));
    expect(resultState.array).not.toBe(INITIAL_STATE.controls.inner5);
  });

  it('should work with createReducer for top-level form state', () => {
    const state = INITIAL_STATE;

    const reducer = createReducer(
      state,
      onNgrxForms(),
    );

    const resultState = reducer(state, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect(resultState.id).toBe(INITIAL_STATE.id);
    expect(resultState).not.toBe(INITIAL_STATE);
  });
});

describe(onNgrxFormsAction.name, () => {
  const state = {
    prop: 'value',
    control: INITIAL_STATE.controls.inner,
    group: INITIAL_STATE,
    array: INITIAL_STATE.controls.inner5,
  };

  const reducer = createReducer(
    state,
    onNgrxFormsAction(MarkAsTouchedAction, s => ({ ...s })),
  );

  it('should call the reducer for the correct action type', () => {
    const resultState = reducer(state, new MarkAsTouchedAction(FORM_CONTROL_INNER_ID));
    expect(resultState).not.toBe(state);
  });

  it('should not call the reducer for the wrong action type', () => {
    const resultState = reducer(state, new MarkAsDirtyAction(FORM_CONTROL_INNER_ID));
    expect(resultState).toBe(state);
  });

  it('should provide the action of the right type to the reducer', () => {
    const reducer = createReducer(
      state,
      onNgrxFormsAction(MarkAsTouchedAction, (state, action) => {
        expect(action instanceof MarkAsTouchedAction).toBe(true);
        expect(action.controlId).toBe(FORM_CONTROL_INNER_ID);
        return state;
      }),
    );

    reducer(state, new MarkAsTouchedAction(FORM_CONTROL_INNER_ID));
  });

  it('should call the reducer in conjuction with onNgrxForms', () => {
    const reducer = createReducer(
      state,
      onNgrxForms(),
      onNgrxFormsAction(MarkAsTouchedAction, (state, action) => {
        expect(action instanceof MarkAsTouchedAction).toBe(true);
        expect(action.controlId).toBe(FORM_CONTROL_INNER_ID);
        return state;
      }),
    );

    const resultState = reducer(state, new MarkAsTouchedAction(FORM_CONTROL_INNER_ID));
    expect(resultState.control.isTouched).toBe(true);
  });
});

describe(wrapReducerWithFormStateUpdate.name, () => {
  const initialState = {
    prop: 'value',
    control: INITIAL_STATE.controls.inner,
    group: INITIAL_STATE,
    array: INITIAL_STATE.controls.inner5,
  };

  function reducer(state = initialState, _: Action) {
    return state;
  }

  it('should update a control after the reducer', () => {
    const wrappedReducer = wrapReducerWithFormStateUpdate(reducer, s => s.control, s => {
      expect(s).toBe(INITIAL_STATE.controls.inner);
      return ({ ...s });
    });

    const resultState = wrappedReducer(undefined, { type: '' });
    expect(resultState.control).not.toBe(INITIAL_STATE.controls.inner);
  });

  it('should update a non-nested control after the reducer', () => {
    const wrappedReducer = wrapReducerWithFormStateUpdate<FormControlState<string>, FormControlState<string>>(
      formControlReducer,
      s => s,
      s => {
        expect(s).toBe(INITIAL_STATE.controls.inner);
        return ({ ...s });
      },
    );

    const resultState = wrappedReducer(initialState.control, { type: '' });
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner);
  });

  it('should update a group after the reducer', () => {
    const wrappedReducer = wrapReducerWithFormStateUpdate(reducer, s => s.group, s => {
      expect(s).toBe(INITIAL_STATE);
      return ({ ...s });
    });

    const resultState = wrappedReducer(undefined, { type: '' });
    expect(resultState.group).not.toBe(INITIAL_STATE);
  });

  it('should update a non-nested group after the reducer', () => {
    const wrappedReducer = wrapReducerWithFormStateUpdate<FormGroupState<FormGroupValue>, FormGroupState<FormGroupValue>>(
      formGroupReducer,
      s => s,
      s => {
        expect(s).toBe(INITIAL_STATE);
        return ({ ...s });
      },
    );

    const resultState = wrappedReducer(initialState.group, { type: '' });
    expect(resultState).not.toBe(INITIAL_STATE);
  });

  it('should update an array after the reducer', () => {
    const wrappedReducer = wrapReducerWithFormStateUpdate(reducer, s => s.array, s => {
      expect(s).toBe(INITIAL_STATE.controls.inner5);
      return ({ ...s });
    });

    const resultState = wrappedReducer(undefined, { type: '' });
    expect(resultState.array).not.toBe(INITIAL_STATE.controls.inner5);
  });

  it('should update a non-nested array after the reducer', () => {
    const wrappedReducer = wrapReducerWithFormStateUpdate<FormArrayState<string>, FormArrayState<string>>(
      formArrayReducer,
      s => s,
      s => {
        expect(s).toBe(INITIAL_STATE.controls.inner5);
        return ({ ...s });
      },
    );

    const resultState = wrappedReducer(initialState.array, { type: '' });
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner5);
  });

  it('should set the updated form state', () => {
    const updatedControl = { ...INITIAL_STATE.controls.inner };
    const wrappedReducer = wrapReducerWithFormStateUpdate(reducer, s => s.control, () => updatedControl);
    const resultState = wrappedReducer(undefined, { type: '' });
    expect(resultState.control).toBe(updatedControl);
  });

  it('should not update the state if the form state is not updated', () => {
    const wrappedReducer = wrapReducerWithFormStateUpdate(reducer, s => s.control, s => s);
    const resultState = wrappedReducer(undefined, { type: '' });
    expect(resultState).toBe(initialState);
  });

  it('should pass the state as the second parameter to the update function', () => {
    const wrappedReducer = wrapReducerWithFormStateUpdate(reducer, s => s.control, (s, state) => {
      expect(state).toBe(initialState);
      return s;
    });

    wrappedReducer(undefined, { type: '' });
  });

  it('should call the update function after the reducer', () => {
    let reducerWasCalled = false;
    const reducer = (s = initialState) => {
      reducerWasCalled = true;
      return s;
    };

    const wrappedReducer = wrapReducerWithFormStateUpdate(reducer, s => s.group, s => {
      expect(reducerWasCalled).toBe(true);
      return s;
    });

    wrappedReducer(undefined, { type: '' });
  });

  it('should work with createReducer', () => {
    const state = {
      prop: 'value',
      control: INITIAL_STATE.controls.inner,
      group: INITIAL_STATE,
      array: INITIAL_STATE.controls.inner5,
    };

    const reducer = createReducer(
      state,
      onNgrxForms(),
    );

    const wrappedReducer = wrapReducerWithFormStateUpdate(reducer, s => s.control, s => ({ ...s }));

    let resultState = wrappedReducer(state, new MarkAsTouchedAction(FORM_CONTROL_INNER_ID));
    expect(resultState.control).not.toBe(INITIAL_STATE.controls.inner);

    resultState = wrappedReducer(state, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect(resultState.group).not.toBe(INITIAL_STATE);

    resultState = wrappedReducer(state, new MarkAsTouchedAction(FORM_CONTROL_INNER5_ID));
    expect(resultState.array).not.toBe(INITIAL_STATE.controls.inner5);
  });
});
