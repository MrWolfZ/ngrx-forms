import { AbstractControlState, createFormArrayState, createFormControlState, createFormGroupState } from '../state';
import { FORM_CONTROL_ID, FORM_CONTROL_INNER2_ID, FORM_CONTROL_INNER_ID } from './test-util';
import { updateRecursive } from './update-recursive';
import { ProjectFn2 } from './util';

describe(updateRecursive.name, () => {
  it('should apply the provided functions to controls', () => {
    const state = createFormControlState(FORM_CONTROL_ID, '');
    const expected = { ...state, value: 'A' };
    const resultState = updateRecursive(() => expected)(state);
    expect(resultState).toBe(expected);
  });

  it('should apply the provided functions to controls uncurried', () => {
    const state = createFormControlState<string>(FORM_CONTROL_ID, '');
    const expected = { ...state, value: 'A' };
    const resultState = updateRecursive(state, () => expected);
    expect(resultState).toBe(expected);
  });

  it('should apply the provided functions to arrays', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['']);
    const expected = { ...state, value: ['A'] };
    const resultState = updateRecursive(() => expected)(state);
    expect(resultState).toBe(expected);
  });

  it('should apply the provided functions to arrays uncurried', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['']);
    const expected = { ...state, value: ['A'] };
    const resultState = updateRecursive(state, () => expected);
    expect(resultState).toBe(expected);
  });

  it('should apply the provided functions to children in an array', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['']);
    const expected = { ...state.controls[0], value: 'A' };
    const resultState = updateRecursive(s => s.id === `${FORM_CONTROL_ID}.0` ? expected : s)(state);
    expect(resultState.controls[0]).toBe(expected);
  });

  it('should apply the provided functions to multiple children in an array', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['', '']);
    const expected = { ...state.controls[1], value: 'A' };
    const resultState = updateRecursive(s => s.id === `${FORM_CONTROL_ID}.1` ? expected : s)(state);
    expect(resultState.controls[1]).toBe(expected);
  });

  it('should apply the provided functions to groups', () => {
    const state = createFormGroupState(FORM_CONTROL_ID, { inner: '' });
    const expected = { ...state, value: { inner: 'A' } };
    const resultState = updateRecursive(() => expected)(state);
    expect(resultState).toBe(expected);
  });

  it('should apply the provided functions to groups uncurried', () => {
    const state = createFormGroupState(FORM_CONTROL_ID, { inner: '' });
    const expected = { ...state, value: { inner: 'A' } };
    const resultState = updateRecursive(state, () => expected);
    expect(resultState).toBe(expected);
  });

  it('should apply the provided functions to children in a group', () => {
    const state = createFormGroupState(FORM_CONTROL_ID, { inner: '' });
    const expected = { ...state.controls.inner, value: 'A' };
    const resultState = updateRecursive(s => s.id === FORM_CONTROL_INNER_ID ? expected : s)(state);
    expect(resultState.controls.inner).toBe(expected);
  });

  it('should apply the provided functions to multiple children in a group', () => {
    const state = createFormGroupState(FORM_CONTROL_ID, { inner: '', inner2: '' });
    const expected = { ...state.controls.inner2, value: 'A' };
    const resultState = updateRecursive(s => s.id === FORM_CONTROL_INNER2_ID ? expected : s)(state);
    expect(resultState.controls.inner2).toBe(expected);
  });

  it('should apply multiple provided functions one after another', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['A', 'B', 'C']);
    const expected1 = { ...state.controls[0], value: 'D' };
    const expected2 = { ...state.controls[1], value: 'E' };
    const expected3 = { ...state.controls[2], value: 'F' };
    const resultState = updateRecursive(
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
    const updateFunction1: ProjectFn2<AbstractControlState<any>, AbstractControlState<any>> =
      s => s.value === 'A' ? expected1 : s.value === 'B' ? expected3 : s;
    const updateFunction2: ProjectFn2<AbstractControlState<any>, AbstractControlState<any>> =
      s => s.value === 'F' ? expected2 : s.value === 'C' ? expected3 : s;
    const resultState = updateRecursive(
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
    const resultState = updateRecursive([
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
    const resultState = updateRecursive<typeof state.value>(
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
    const updateFunction1: ProjectFn2<AbstractControlState<any>, AbstractControlState<any>> =
      s => s.value === 'A' ? expected1 : s.value === 'B' ? expected3 : s;
    const updateFunction2: ProjectFn2<AbstractControlState<any>, AbstractControlState<any>> =
      s => s.value === 'F' ? expected2 : s.value === 'C' ? expected3 : s;
    const resultState = updateRecursive<typeof state.value>(
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
    const resultState = updateRecursive<typeof state.value>(
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
    const resultState = updateRecursive([])(state);
    expect(resultState).toBe(state);
  });

  it('should not modify state if no update function is provided uncurried', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['A', 'B', 'C']);
    const resultState = updateRecursive(state, []);
    expect(resultState).toBe(state);
  });

  it('should pass top level state itself as the second parameter for top level state', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['', '']);
    updateRecursive((c, p) => {
      if (c === state) {
        expect(p).toBe(state);
      }

      return c;
    })(state);
  });

  it('should pass the parent state as the second parameter for child states', () => {
    const state = createFormArrayState(FORM_CONTROL_ID, ['', '']);
    updateRecursive((c, p) => {
      if (c !== state) {
        expect(p).toBe(state);
      }

      return c;
    })(state);
  });
});
