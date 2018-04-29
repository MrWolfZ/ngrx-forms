import { MarkAsTouchedAction, SetValueAction } from './actions';
import { createFormStateReducerWithUpdate, formStateReducer } from './reducer';
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
