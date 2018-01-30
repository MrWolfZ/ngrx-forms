import { MarkAsTouchedAction, SetValueAction } from '../actions';
import { FormGroupState } from '../state';
import { FORM_CONTROL_ID, FORM_CONTROL_INNER_ID, FormGroupValue, INITIAL_STATE, NestedValue } from './test-util';
import { createFormGroupReducerWithUpdate, updateGroup } from './update-group';

describe(updateGroup.name, () => {
  it('should apply the provided functions to control children', () => {
    const expected = { ...INITIAL_STATE.controls.inner, value: 'A' };
    const resultState = updateGroup<FormGroupValue>({
      inner: () => expected,
    })(INITIAL_STATE);
    expect(resultState.controls.inner).toBe(expected);
  });

  it('should apply the provided functions to group children', () => {
    const expected = { ...INITIAL_STATE.controls.inner3, value: { inner4: 'A' } };
    const resultState = updateGroup<FormGroupValue>({
      inner3: () => expected,
    })(INITIAL_STATE);
    expect(resultState.controls.inner3).toBe(expected);
  });

  it('should apply the provided functions to array children', () => {
    const expected = { ...INITIAL_STATE.controls.inner5, value: ['A'] };
    const resultState = updateGroup<FormGroupValue>({
      inner5: () => expected,
    })(INITIAL_STATE);
    expect(resultState.controls.inner5).toBe(expected);
  });

  it('should not change the state with empty update object', () => {
    const resultState = updateGroup<FormGroupValue>({})(INITIAL_STATE);
    expect(resultState).toBe(resultState);
  });

  it('should apply the provided functions to control children uncurried', () => {
    const expected = { ...INITIAL_STATE.controls.inner, value: 'A' };
    const resultState = updateGroup<FormGroupValue>(
      INITIAL_STATE,
      {
        inner: () => expected,
      },
    );
    expect(resultState.controls.inner).toBe(expected);
  });

  it('should apply the provided functions to group children uncurried', () => {
    const expected = { ...INITIAL_STATE.controls.inner3, value: { inner4: 'A' } };
    const resultState = updateGroup<FormGroupValue>(
      INITIAL_STATE,
      {
        inner3: () => expected,
      },
    );
    expect(resultState.controls.inner3).toBe(expected);
  });

  it('should apply the provided functions to array children uncurried', () => {
    const expected = { ...INITIAL_STATE.controls.inner5, value: ['A'] };
    const resultState = updateGroup<FormGroupValue>(
      INITIAL_STATE,
      {
        inner5: () => expected,
      },
    );
    expect(resultState.controls.inner5).toBe(expected);
  });

  it('should not change the state with empty update object uncurried', () => {
    const resultState = updateGroup<FormGroupValue>(INITIAL_STATE, {});
    expect(resultState).toBe(resultState);
  });

  it('should apply multiple provided function objects one after another', () => {
    const updatedInner1 = { ...INITIAL_STATE.controls.inner, value: 'A' };
    const expectedInner1 = { ...INITIAL_STATE.controls.inner, value: 'B' };
    const expectedInner3 = { ...INITIAL_STATE.controls.inner3, value: { inner4: 'A' } };
    const resultState = updateGroup<FormGroupValue>({
      inner: () => updatedInner1,
      inner3: () => expectedInner3,
    }, {
        inner: () => expectedInner1,
      })(INITIAL_STATE);
    expect(resultState.controls.inner).toBe(expectedInner1);
    expect(resultState.controls.inner3).toBe(expectedInner3);
  });

  it('should pass the parent group as the second parameter', () => {
    updateGroup<FormGroupValue>({
      inner3: (c, p) => {
        expect(p).toBe(INITIAL_STATE);
        return c;
      },
    })(INITIAL_STATE);
  });
});

describe(createFormGroupReducerWithUpdate.name, () => {
  it('should apply the action and the provided functions to control children', () => {
    const value = 'A';
    const resultState = createFormGroupReducerWithUpdate<FormGroupValue>({
      inner: s => ({ ...s, value }),
    })(INITIAL_STATE, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner.isTouched).toBe(true);
    expect(resultState.controls.inner.value).toBe(value);
  });

  it('should apply the action and the provided functions to group children', () => {
    const value = { inner4: 'A' };
    const resultState = createFormGroupReducerWithUpdate<FormGroupValue>({
      inner3: s => ({ ...s, value }),
    })(INITIAL_STATE, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner3.isTouched).toBe(true);
    expect(resultState.controls.inner3.value).toBe(value);
  });

  it('should apply the action and the provided functions to nested children', () => {
    const value = 'A';
    const resultState = createFormGroupReducerWithUpdate<FormGroupValue>({
      inner3: updateGroup<NestedValue>({
        inner4: s => ({ ...s, value }),
      }),
    })(INITIAL_STATE, new MarkAsTouchedAction(FORM_CONTROL_ID));
    expect((resultState.controls.inner3 as FormGroupState<NestedValue>).controls.inner4.isTouched).toBe(true);
    expect((resultState.controls.inner3 as FormGroupState<NestedValue>).controls.inner4.value).toBe(value);
  });

  it('should first apply the action and then the provided functions', () => {
    const expected = { ...INITIAL_STATE.controls.inner, value: 'A' };
    const resultState = createFormGroupReducerWithUpdate<FormGroupValue>({
      inner: () => expected,
    })(INITIAL_STATE, new SetValueAction(FORM_CONTROL_INNER_ID, 'B'));
    expect(resultState.controls.inner).toBe(expected);
  });

  it('should apply multiple provided function objects one after another', () => {
    const updatedInner1 = { ...INITIAL_STATE.controls.inner, value: 'A' };
    const expectedInner1 = { ...INITIAL_STATE.controls.inner, value: 'B' };
    const expectedInner3 = { ...INITIAL_STATE.controls.inner3, value: { inner4: 'A' } };
    const resultState = createFormGroupReducerWithUpdate<FormGroupValue>({
      inner: () => updatedInner1,
      inner3: () => expectedInner3,
    }, {
        inner: () => expectedInner1,
      })(INITIAL_STATE, new SetValueAction(FORM_CONTROL_INNER_ID, 'D'));
    expect(resultState.controls.inner).toBe(expectedInner1);
    expect(resultState.controls.inner3).toBe(expectedInner3);
  });
});
