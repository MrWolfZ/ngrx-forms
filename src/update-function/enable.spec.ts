import { enable } from './enable';
import { INITIAL_STATE } from './test-util';

describe(enable.name, () => {
  it('should call reducer for controls', () => {
    const state = { ...INITIAL_STATE.controls.inner, isEnabled: false, isDisabled: true };
    const resultState = enable(state);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for groups', () => {
    const state = {
      ...INITIAL_STATE,
      isEnabled: false,
      isDisabled: true,
      controls: {
        ...INITIAL_STATE.controls,
        inner: {
          ...INITIAL_STATE.controls.inner,
          isEnabled: false,
          isDisabled: true,
        },
      },
    };
    const resultState = enable(state);
    expect(resultState).not.toBe(state);
  });

  it('should call reducer for arrays', () => {
    const inner5State = INITIAL_STATE.controls.inner5;
    const state = {
      ...inner5State,
      isEnabled: false,
      isDisabled: true,
      controls: [
        ...inner5State.controls,
        {
          ...inner5State.controls[0],
          isEnabled: false,
          isDisabled: true,
        },
      ],
    };
    const resultState = enable(state);
    expect(resultState).not.toBe(state);
  });
});
