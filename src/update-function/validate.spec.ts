import { FormGroupValue, INITIAL_STATE } from './test-util';
import { updateGroup } from './update-group';
import { validate } from './validate';

describe(validate.name, () => {
  it('should call reducer for controls', () => {
    const errors = { required: true };
    const resultState = validate<string>(() => errors)(INITIAL_STATE.controls.inner);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner);
  });

  it('should call reducer for groups', () => {
    const errors = { required: true };
    const resultState = validate<FormGroupValue>(() => errors)(INITIAL_STATE);
    expect(resultState).not.toBe(INITIAL_STATE);
  });

  it('should call reducer for arrays', () => {
    const errors = { required: true };
    const resultState = validate<string[]>(() => errors)(INITIAL_STATE.controls.inner5);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner5);
  });

  it('should call reducer for controls uncurried', () => {
    const errors = { required: true };
    const resultState = validate(INITIAL_STATE.controls.inner, () => errors);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner);
  });

  it('should call reducer for groups uncurried', () => {
    const errors = { required: true };
    const resultState = validate(INITIAL_STATE, () => errors);
    expect(resultState).not.toBe(INITIAL_STATE);
  });

  it('should call reducer for arrays uncurried', () => {
    const errors = { required: true };
    const resultState = validate(INITIAL_STATE.controls.inner5, () => errors);
    expect(resultState).not.toBe(INITIAL_STATE.controls.inner5);
  });

  it('should merge errors from multiple validation functions', () => {
    const errors1 = { required: true };
    const errors2 = { min: 1 };
    const mergedErrors = { required: true, min: 1 };
    const resultState = validate<string>(() => errors1, () => errors2)(INITIAL_STATE.controls.inner);
    expect(resultState.errors).toEqual(mergedErrors);
  });

  it('should merge errors from multiple validation functions in the order they were provided', () => {
    const errors1 = { min: 1, required: true };
    const errors2 = { min: 2 };
    const mergedErrors = { required: true, min: 2 };
    const resultState = validate<string>(() => errors1, () => errors2)(INITIAL_STATE.controls.inner);
    expect(resultState.errors).toEqual(mergedErrors);
  });

  it('should merge errors from multiple validation functions as param array in the order they were provided', () => {
    const errors1 = { min: 1, required: true };
    const errors2 = { min: 2 };
    const mergedErrors = { required: true, min: 2 };
    const resultState = validate<string>(() => errors1, [() => errors2] as any)(INITIAL_STATE.controls.inner);
    expect(resultState.errors).toEqual(mergedErrors);
  });

  it('should merge errors from multiple validation functions as array in the order they were provided', () => {
    const errors1 = { min: 1, required: true };
    const errors2 = { min: 2 };
    const mergedErrors = { required: true, min: 2 };
    const resultState = validate<string>([() => errors1, () => errors2])(INITIAL_STATE.controls.inner);
    expect(resultState.errors).toEqual(mergedErrors);
  });

  it('should merge errors from multiple validation functions in the order they were provided uncurried', () => {
    const errors1 = { min: 1, required: true };
    const errors2 = { min: 2 };
    const mergedErrors = { required: true, min: 2 };
    const resultState = validate(INITIAL_STATE.controls.inner, () => errors1, () => errors2);
    expect(resultState.errors).toEqual(mergedErrors);
  });

  it('should merge errors from multiple validation functions as param array in the order they were provided uncurried', () => {
    const errors1 = { min: 1, required: true };
    const errors2 = { min: 2 };
    const mergedErrors = { required: true, min: 2 };
    const resultState = validate(INITIAL_STATE.controls.inner, () => errors1, [() => errors2] as any);
    expect(resultState.errors).toEqual(mergedErrors);
  });

  it('should merge errors from multiple validation functions as array in the order they were provided uncurried', () => {
    const errors1 = { min: 1, required: true };
    const errors2 = { min: 2 };
    const mergedErrors = { required: true, min: 2 };
    const resultState = validate(INITIAL_STATE.controls.inner, [() => errors1, () => errors2]);
    expect(resultState.errors).toEqual(mergedErrors);
  });

  it('should not modify state if no function is provided', () => {
    const resultState = validate<typeof INITIAL_STATE.value>([])(INITIAL_STATE);
    expect(resultState).toBe(INITIAL_STATE);
  });

  it('should not modify state if no function is provided uncurried', () => {
    const resultState = validate(INITIAL_STATE, []);
    expect(resultState).toBe(INITIAL_STATE);
  });

  it('should throw if curried and no state', () => {
    const errors = { required: true };
    expect(() => validate<string>(() => errors)(undefined as any)).toThrowError();
  });

  it('should work inside an updateGroup', () => {
    const errors = { required: true };
    const resultState = updateGroup(INITIAL_STATE, {
      inner: validate<string>(() => errors),
    });

    expect(resultState).not.toEqual(INITIAL_STATE);
  });

  it('should work inside an updateGroup uncurried', () => {
    const errors = { required: true };
    const resultState = updateGroup<typeof INITIAL_STATE.value>(INITIAL_STATE, {
      inner: inner => validate<string>(inner, () => errors),
    });

    expect(resultState).not.toEqual(INITIAL_STATE);
  });
});
