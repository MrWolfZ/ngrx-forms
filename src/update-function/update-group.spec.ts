import { FormGroupValue, INITIAL_STATE } from './test-util';
import { StateUpdateFns, updateGroup } from './update-group';

describe(updateGroup.name, () => {
  it('should apply the provided functions to control children', () => {
    const expected = { ...INITIAL_STATE.controls.inner, value: 'A' };
    const resultState = updateGroup<FormGroupValue>({
      inner: () => expected,
    })(INITIAL_STATE);
    expect(resultState.controls.inner).toBe(expected);
  });

  it('should apply the provided functions to group children', () => {
    const expected = { ...INITIAL_STATE.controls.inner3!, value: { inner4: 'A' } };
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
    const expected = { ...INITIAL_STATE.controls.inner3!, value: { inner4: 'A' } };
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
    const expectedInner3 = { ...INITIAL_STATE.controls.inner3!, value: { inner4: 'A' } };
    const resultState = updateGroup<FormGroupValue>(
      {
        inner: () => updatedInner1,
        inner3: () => expectedInner3,
      },
      {
        inner: () => expectedInner1,
      },
    )(INITIAL_STATE);
    expect(resultState.controls.inner).toBe(expectedInner1);
    expect(resultState.controls.inner3).toBe(expectedInner3);
  });

  it('should apply multiple provided function objects as param array one after another', () => {
    const updatedInner1 = { ...INITIAL_STATE.controls.inner, value: 'A' };
    const expectedInner1 = { ...INITIAL_STATE.controls.inner, value: 'B' };
    const expectedInner3 = { ...INITIAL_STATE.controls.inner3!, value: { inner4: 'A' } };
    const updateFnArr: StateUpdateFns<FormGroupValue>[] = [{
      inner: () => expectedInner1,
    }];
    const resultState = updateGroup<FormGroupValue>({
      inner: () => updatedInner1,
      inner3: () => expectedInner3,
    }, updateFnArr as any)(INITIAL_STATE);
    expect(resultState.controls.inner).toBe(expectedInner1);
    expect(resultState.controls.inner3).toBe(expectedInner3);
  });

  it('should apply multiple provided function objects as array one after another', () => {
    const updatedInner1 = { ...INITIAL_STATE.controls.inner, value: 'A' };
    const expectedInner1 = { ...INITIAL_STATE.controls.inner, value: 'B' };
    const expectedInner3 = { ...INITIAL_STATE.controls.inner3!, value: { inner4: 'A' } };
    const updateFnArr: StateUpdateFns<FormGroupValue>[] = [
      {
        inner: () => updatedInner1,
        inner3: () => expectedInner3,
      },
      {
        inner: () => expectedInner1,
      },
    ];
    const resultState = updateGroup<FormGroupValue>(updateFnArr)(INITIAL_STATE);
    expect(resultState.controls.inner).toBe(expectedInner1);
    expect(resultState.controls.inner3).toBe(expectedInner3);
  });

  it('should apply multiple provided function objects one after another uncurried', () => {
    const updatedInner1 = { ...INITIAL_STATE.controls.inner, value: 'A' };
    const expectedInner1 = { ...INITIAL_STATE.controls.inner, value: 'B' };
    const expectedInner3 = { ...INITIAL_STATE.controls.inner3!, value: { inner4: 'A' } };
    const resultState = updateGroup(
      INITIAL_STATE,
      {
        inner: () => updatedInner1,
        inner3: () => expectedInner3,
      },
      {
        inner: () => expectedInner1,
      },
    );
    expect(resultState.controls.inner).toBe(expectedInner1);
    expect(resultState.controls.inner3).toBe(expectedInner3);
  });

  it('should apply multiple provided function objects as param array one after another uncurried', () => {
    const updatedInner1 = { ...INITIAL_STATE.controls.inner, value: 'A' };
    const expectedInner1 = { ...INITIAL_STATE.controls.inner, value: 'B' };
    const expectedInner3 = { ...INITIAL_STATE.controls.inner3!, value: { inner4: 'A' } };
    const updateFnArr: StateUpdateFns<FormGroupValue>[] = [{
      inner: () => expectedInner1,
    }];
    const resultState = updateGroup(INITIAL_STATE, {
      inner: () => updatedInner1,
      inner3: () => expectedInner3,
    }, updateFnArr as any);
    expect(resultState.controls.inner).toBe(expectedInner1);
    expect(resultState.controls.inner3).toBe(expectedInner3);
  });

  it('should apply multiple provided function objects as array one after another uncurried', () => {
    const updatedInner1 = { ...INITIAL_STATE.controls.inner, value: 'A' };
    const expectedInner1 = { ...INITIAL_STATE.controls.inner, value: 'B' };
    const expectedInner3 = { ...INITIAL_STATE.controls.inner3!, value: { inner4: 'A' } };
    const updateFnArr: StateUpdateFns<FormGroupValue>[] = [
      {
        inner: () => updatedInner1,
        inner3: () => expectedInner3,
      },
      {
        inner: () => expectedInner1,
      },
    ];
    const resultState = updateGroup(INITIAL_STATE, updateFnArr);
    expect(resultState.controls.inner).toBe(expectedInner1);
    expect(resultState.controls.inner3).toBe(expectedInner3);
  });

  it('should not modify state if no update function object is provided', () => {
    const resultState = updateGroup<typeof INITIAL_STATE.value>([])(INITIAL_STATE);
    expect(resultState).toBe(INITIAL_STATE);
  });

  it('should not modify state if no update function object is provided uncurried', () => {
    const resultState = updateGroup(INITIAL_STATE, []);
    expect(resultState).toBe(INITIAL_STATE);
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
