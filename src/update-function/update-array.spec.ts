import { createFormArrayState, FormState } from '../state';
import { FORM_CONTROL_ID } from './test-util';
import { updateArray, updateArrayWithFilter } from './update-array';
import { updateGroup } from './update-group';
import { ProjectFn2 } from './util';

describe(updateArray.name, () => {
  it('should apply the provided functions to control children', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['']);
    const expected = { ...state.controls[0], value: 'A' };
    const resultState = updateArray<typeof expected.value>(() => expected)(state);
    expect(resultState.controls[0]).toBe(expected);
  });

  it('should apply the provided functions to all control children', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['', '']);
    const expected = { ...state.controls[0], value: 'A' };
    const resultState = updateArray<typeof expected.value>(() => expected)(state);
    expect(resultState.controls[0]).toBe(expected);
    expect(resultState.controls[1]).toBe(expected);
  });

  it('should apply the provided functions to group children', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, [{ inner: '' }]);
    const expected = { ...state.controls[0], value: { inner: 'A' } };
    const resultState = updateArray<typeof expected.value>(() => expected)(state);
    expect(resultState.controls[0]).toBe(expected);
  });

  it('should apply the provided functions to array children', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, [['']]);
    const expected = { ...state.controls[0], value: ['A'] };
    const resultState = updateArray<typeof expected.value>(() => expected)(state);
    expect(resultState.controls[0]).toBe(expected);
  });

  it('should apply the provided functions to control children uncurried', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['']);
    const expected = { ...state.controls[0], value: 'A' };
    const resultState = updateArray<typeof expected.value>(state, () => expected);
    expect(resultState.controls[0]).toBe(expected);
  });

  it('should apply the provided functions to all control children uncurried', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['', '']);
    const expected = { ...state.controls[0], value: 'A' };
    const resultState = updateArray<typeof expected.value>(state, () => expected);
    expect(resultState.controls[0]).toBe(expected);
    expect(resultState.controls[1]).toBe(expected);
  });

  it('should apply the provided functions to group children uncurried', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, [{ inner: '' }]);
    const expected = { ...state.controls[0], value: { inner: 'A' } };
    const resultState = updateArray<typeof expected.value>(state, () => expected);
    expect(resultState.controls[0]).toBe(expected);
  });

  it('should apply the provided functions to array children uncurried', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, [['']]);
    const expected = { ...state.controls[0], value: ['A'] };
    const resultState = updateArray<typeof expected.value>(state, () => expected);
    expect(resultState.controls[0]).toBe(expected);
  });

  it('should apply multiple provided functions one after another', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['A', 'B', 'C']);
    const expected1 = { ...state.controls[0], value: 'D' };
    const expected2 = { ...state.controls[1], value: 'E' };
    const expected3 = { ...state.controls[2], value: 'F' };
    const resultState = updateArray<typeof expected1.value>(
      s => s.value === 'A' ? expected1 : s.value === 'B' ? expected3 : s,
      s => s.value === 'F' ? expected2 : s.value === 'C' ? expected3 : s,
    )(state);
    expect(resultState.controls[0]).toBe(expected1);
    expect(resultState.controls[1]).toBe(expected2);
    expect(resultState.controls[2]).toBe(expected3);
  });

  it('should apply multiple provided functions as param array one after another', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['A', 'B', 'C']);
    const expected1 = { ...state.controls[0], value: 'D' };
    const expected2 = { ...state.controls[1], value: 'E' };
    const expected3 = { ...state.controls[2], value: 'F' };
    const updateFunction1: ProjectFn2<FormState<typeof expected1.value>, typeof state> =
      s => s.value === 'A' ? expected1 : s.value === 'B' ? expected3 : s;
    const updateFunction2: ProjectFn2<FormState<typeof expected1.value>, typeof state> =
      s => s.value === 'F' ? expected2 : s.value === 'C' ? expected3 : s;
    const resultState = updateArray<typeof expected1.value>(
      updateFunction1,
      [updateFunction2] as any,
    )(state);
    expect(resultState.controls[0]).toBe(expected1);
    expect(resultState.controls[1]).toBe(expected2);
    expect(resultState.controls[2]).toBe(expected3);
  });

  it('should apply multiple provided functions as array one after another', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['A', 'B', 'C']);
    const expected1 = { ...state.controls[0], value: 'D' };
    const expected2 = { ...state.controls[1], value: 'E' };
    const expected3 = { ...state.controls[2], value: 'F' };
    const resultState = updateArray<typeof expected1.value>([
      s => s.value === 'A' ? expected1 : s.value === 'B' ? expected3 : s,
      s => s.value === 'F' ? expected2 : s.value === 'C' ? expected3 : s,
    ])(state);
    expect(resultState.controls[0]).toBe(expected1);
    expect(resultState.controls[1]).toBe(expected2);
    expect(resultState.controls[2]).toBe(expected3);
  });

  it('should apply multiple provided functions one after another uncurried', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['A', 'B', 'C']);
    const expected1 = { ...state.controls[0], value: 'D' };
    const expected2 = { ...state.controls[1], value: 'E' };
    const expected3 = { ...state.controls[2], value: 'F' };
    const resultState = updateArray<typeof expected1.value>(
      state,
      s => s.value === 'A' ? expected1 : s.value === 'B' ? expected3 : s,
      s => s.value === 'F' ? expected2 : s.value === 'C' ? expected3 : s,
    );
    expect(resultState.controls[0]).toBe(expected1);
    expect(resultState.controls[1]).toBe(expected2);
    expect(resultState.controls[2]).toBe(expected3);
  });

  it('should apply multiple provided functions as param array one after another uncurried', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['A', 'B', 'C']);
    const expected1 = { ...state.controls[0], value: 'D' };
    const expected2 = { ...state.controls[1], value: 'E' };
    const expected3 = { ...state.controls[2], value: 'F' };
    const updateFunction1: ProjectFn2<FormState<typeof expected1.value>, typeof state> =
      s => s.value === 'A' ? expected1 : s.value === 'B' ? expected3 : s;
    const updateFunction2: ProjectFn2<FormState<typeof expected1.value>, typeof state> =
      s => s.value === 'F' ? expected2 : s.value === 'C' ? expected3 : s;
    const resultState = updateArray<typeof expected1.value>(
      state,
      updateFunction1,
      [updateFunction2] as any,
    );
    expect(resultState.controls[0]).toBe(expected1);
    expect(resultState.controls[1]).toBe(expected2);
    expect(resultState.controls[2]).toBe(expected3);
  });

  it('should apply multiple provided functions as array one after another uncurried', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['A', 'B', 'C']);
    const expected1 = { ...state.controls[0], value: 'D' };
    const expected2 = { ...state.controls[1], value: 'E' };
    const expected3 = { ...state.controls[2], value: 'F' };
    const resultState = updateArray<typeof expected1.value>(
      state,
      [
        s => s.value === 'A' ? expected1 : s.value === 'B' ? expected3 : s,
        s => s.value === 'F' ? expected2 : s.value === 'C' ? expected3 : s,
      ],
    );
    expect(resultState.controls[0]).toBe(expected1);
    expect(resultState.controls[1]).toBe(expected2);
    expect(resultState.controls[2]).toBe(expected3);
  });

  it('should not modify state if no update function is provided', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['A', 'B', 'C']);
    const resultState = updateArray<typeof state.value[0]>([])(state);
    expect(resultState).toBe(state);
  });

  it('should not modify state if no update function is provided uncurried', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['A', 'B', 'C']);
    const resultState = updateArray(state, []);
    expect(resultState).toBe(state);
  });

  it('should pass the parent array as the second parameter', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['', '']);
    updateArray<typeof state.value[0]>((c, p) => {
      expect(p).toBe(state);
      return c;
    })(state);
  });

  it('should work inside of an updateGroup', () => {
    interface Outer {
      inner: Inner[];
    }

    interface Inner {
      s: string;
    }

    // this just asserts it compiles without type error
    const validationFormGroupReducer = updateGroup<Outer>({
      inner: updateArray<Inner>(
        updateGroup<Inner>({
          s: s => s,
        }),
      ),
    });

    expect(validationFormGroupReducer).toBeDefined();
  });
});

describe(updateArrayWithFilter.name, () => {
  it('should apply the provided functions to control children', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['']);
    const expected = { ...state.controls[0], value: 'A' };
    const resultState = updateArrayWithFilter<typeof expected.value>(() => true, () => expected)(state);
    expect(resultState.controls[0]).toBe(expected);
  });

  it('should apply the provided functions to all control children', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['', '']);
    const expected = { ...state.controls[0], value: 'A' };
    const resultState = updateArrayWithFilter<typeof expected.value>(() => true, () => expected)(state);
    expect(resultState.controls[0]).toBe(expected);
    expect(resultState.controls[1]).toBe(expected);
  });

  it('should apply the provided functions to group children', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, [{ inner: '' }]);
    const expected = { ...state.controls[0], value: { inner: 'A' } };
    const resultState = updateArrayWithFilter<typeof expected.value>(() => true, () => expected)(state);
    expect(resultState.controls[0]).toBe(expected);
  });

  it('should apply the provided functions to array children', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, [['']]);
    const expected = { ...state.controls[0], value: ['A'] };
    const resultState = updateArrayWithFilter<typeof expected.value>(() => true, () => expected)(state);
    expect(resultState.controls[0]).toBe(expected);
  });

  it('should apply the provided functions to control children uncurried', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['']);
    const expected = { ...state.controls[0], value: 'A' };
    const resultState = updateArrayWithFilter<typeof expected.value>(state, () => true, () => expected);
    expect(resultState.controls[0]).toBe(expected);
  });

  it('should apply the provided functions to all control children uncurried', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['', '']);
    const expected = { ...state.controls[0], value: 'A' };
    const resultState = updateArrayWithFilter<typeof expected.value>(state, () => true, () => expected);
    expect(resultState.controls[0]).toBe(expected);
    expect(resultState.controls[1]).toBe(expected);
  });

  it('should apply the provided functions to group children uncurried', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, [{ inner: '' }]);
    const expected = { ...state.controls[0], value: { inner: 'A' } };
    const resultState = updateArrayWithFilter<typeof expected.value>(state, () => true, () => expected);
    expect(resultState.controls[0]).toBe(expected);
  });

  it('should apply the provided functions to array children uncurried', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, [['']]);
    const expected = { ...state.controls[0], value: ['A'] };
    const resultState = updateArrayWithFilter<typeof expected.value>(state, () => true, () => expected);
    expect(resultState.controls[0]).toBe(expected);
  });

  it('should apply multiple provided functions one after another', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['A', 'B', 'C']);
    const expected1 = { ...state.controls[0], value: 'D' };
    const expected2 = { ...state.controls[1], value: 'E' };
    const expected3 = { ...state.controls[2], value: 'F' };
    const resultState = updateArrayWithFilter<typeof expected1.value>(
      () => true,
      s => s.value === 'A' ? expected1 : s.value === 'B' ? expected3 : s,
      s => s.value === 'F' ? expected2 : s.value === 'C' ? expected3 : s,
    )(state);
    expect(resultState.controls[0]).toBe(expected1);
    expect(resultState.controls[1]).toBe(expected2);
    expect(resultState.controls[2]).toBe(expected3);
  });

  it('should apply multiple provided functions as param array one after another', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['A', 'B', 'C']);
    const expected1 = { ...state.controls[0], value: 'D' };
    const expected2 = { ...state.controls[1], value: 'E' };
    const expected3 = { ...state.controls[2], value: 'F' };
    const updateFunction1: ProjectFn2<FormState<typeof expected1.value>, typeof state> =
      s => s.value === 'A' ? expected1 : s.value === 'B' ? expected3 : s;
    const updateFunction2: ProjectFn2<FormState<typeof expected1.value>, typeof state> =
      s => s.value === 'F' ? expected2 : s.value === 'C' ? expected3 : s;
    const resultState = updateArrayWithFilter<typeof expected1.value>(
      () => true,
      updateFunction1,
      [updateFunction2] as any,
    )(state);
    expect(resultState.controls[0]).toBe(expected1);
    expect(resultState.controls[1]).toBe(expected2);
    expect(resultState.controls[2]).toBe(expected3);
  });

  it('should apply multiple provided functions as array one after another', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['A', 'B', 'C']);
    const expected1 = { ...state.controls[0], value: 'D' };
    const expected2 = { ...state.controls[1], value: 'E' };
    const expected3 = { ...state.controls[2], value: 'F' };
    const resultState = updateArrayWithFilter<typeof expected1.value>(
      () => true,
      [
        s => s.value === 'A' ? expected1 : s.value === 'B' ? expected3 : s,
        s => s.value === 'F' ? expected2 : s.value === 'C' ? expected3 : s,
      ],
    )(state);
    expect(resultState.controls[0]).toBe(expected1);
    expect(resultState.controls[1]).toBe(expected2);
    expect(resultState.controls[2]).toBe(expected3);
  });

  it('should apply multiple provided functions one after another uncurried', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['A', 'B', 'C']);
    const expected1 = { ...state.controls[0], value: 'D' };
    const expected2 = { ...state.controls[1], value: 'E' };
    const expected3 = { ...state.controls[2], value: 'F' };
    const resultState = updateArrayWithFilter<typeof expected1.value>(
      state,
      () => true,
      s => s.value === 'A' ? expected1 : s.value === 'B' ? expected3 : s,
      s => s.value === 'F' ? expected2 : s.value === 'C' ? expected3 : s,
    );
    expect(resultState.controls[0]).toBe(expected1);
    expect(resultState.controls[1]).toBe(expected2);
    expect(resultState.controls[2]).toBe(expected3);
  });

  it('should apply multiple provided functions as param array one after another uncurried', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['A', 'B', 'C']);
    const expected1 = { ...state.controls[0], value: 'D' };
    const expected2 = { ...state.controls[1], value: 'E' };
    const expected3 = { ...state.controls[2], value: 'F' };
    const updateFunction1: ProjectFn2<FormState<typeof expected1.value>, typeof state> =
      s => s.value === 'A' ? expected1 : s.value === 'B' ? expected3 : s;
    const updateFunction2: ProjectFn2<FormState<typeof expected1.value>, typeof state> =
      s => s.value === 'F' ? expected2 : s.value === 'C' ? expected3 : s;
    const resultState = updateArrayWithFilter<typeof expected1.value>(
      state,
      () => true,
      updateFunction1,
      [updateFunction2] as any,
    );
    expect(resultState.controls[0]).toBe(expected1);
    expect(resultState.controls[1]).toBe(expected2);
    expect(resultState.controls[2]).toBe(expected3);
  });

  it('should apply multiple provided functions as array one after another uncurried', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['A', 'B', 'C']);
    const expected1 = { ...state.controls[0], value: 'D' };
    const expected2 = { ...state.controls[1], value: 'E' };
    const expected3 = { ...state.controls[2], value: 'F' };
    const resultState = updateArrayWithFilter<typeof expected1.value>(
      state,
      () => true,
      [
        s => s.value === 'A' ? expected1 : s.value === 'B' ? expected3 : s,
        s => s.value === 'F' ? expected2 : s.value === 'C' ? expected3 : s,
      ],
    );
    expect(resultState.controls[0]).toBe(expected1);
    expect(resultState.controls[1]).toBe(expected2);
    expect(resultState.controls[2]).toBe(expected3);
  });

  it('should not modify state if no update function is provided', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['A', 'B', 'C']);
    const resultState = updateArrayWithFilter<typeof state.value[0]>(() => true, [])(state);
    expect(resultState).toBe(state);
  });

  it('should not modify state if no update function is provided uncurried', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['A', 'B', 'C']);
    const resultState = updateArrayWithFilter(state, () => true, []);
    expect(resultState).toBe(state);
  });

  it('should apply the provided functions only to children that match the filter', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['', '']);
    const expected = { ...state.controls[0], value: 'A' };
    const resultState = updateArrayWithFilter<typeof expected.value>((_, idx) => idx > 0, () => expected)(state);
    expect(resultState.controls[0]).toBe(state.controls[0]);
    expect(resultState.controls[1]).toBe(expected);
  });

  it('should apply the provided functions only to children that match the filter uncurried', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['', '']);
    const expected = { ...state.controls[0], value: 'A' };
    const resultState = updateArrayWithFilter<typeof expected.value>(state, (_, idx) => idx > 0, () => expected);
    expect(resultState.controls[0]).toBe(state.controls[0]);
    expect(resultState.controls[1]).toBe(expected);
  });

  it('should pass the state as the first parameter', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['', '']);
    let idx = -1;
    updateArrayWithFilter<typeof state.value[0]>(c => {
      expect(c).toBe(state.controls[idx += 1]);
      return true;
    }, c => c)(state);
  });

  it('should pass the index as the second parameter', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['', '']);
    let idx = -1;
    updateArrayWithFilter<typeof state.value[0]>((_, i) => {
      expect(i).toBe(idx += 1);
      return true;
    }, c => c)(state);
  });

  it('should not modify state if no child matches the filter', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['A', 'B', 'C']);
    const resultState = updateArrayWithFilter<typeof state.value[0]>((_, idx) => idx === -1, s => ({ ...s }))(state);
    expect(resultState).toBe(state);
  });

  it('should not modify state if no child matches the filter uncurried', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['A', 'B', 'C']);
    const resultState = updateArrayWithFilter(state, (_, idx) => idx === -1, s => ({ ...s }));
    expect(resultState).toBe(state);
  });

  it('should pass the parent array as the second parameter', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['', '']);
    updateArrayWithFilter<typeof state.value[0]>(() => true, (c, p) => {
      expect(p).toBe(state);
      return c;
    })(state);
  });

  it('should work inside of an updateGroup', () => {
    interface Outer {
      inner: Inner[];
    }

    interface Inner {
      s: string;
    }

    // this just asserts it compiles without type error
    const validationFormGroupReducer = updateGroup<Outer>({
      inner: updateArrayWithFilter<Inner>(
        () => true,
        updateGroup<Inner>({
          s: s => s,
        }),
      ),
    });

    expect(validationFormGroupReducer).toBeDefined();
  });
});
