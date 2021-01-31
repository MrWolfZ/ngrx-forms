import { isNgrxFormsAction } from './actions';

describe(isNgrxFormsAction.name, () => {
  it('should return true if type is ngrx/forms/', () => {
    expect(isNgrxFormsAction({ type: 'ngrx/forms/' } as any)).toBe(true);
  });

  it('should return true if type startsWith ngrx/forms/', () => {
    expect(isNgrxFormsAction({ type: 'ngrx/forms/test' } as any)).toBe(true);
  });

  it('should return false if type does not have ngrx/forms/', () => {
    expect(isNgrxFormsAction({ type: 'some-type' } as any)).toBe(false);
  });

  it('should return false if type is missing', () => {
    expect(isNgrxFormsAction({} as any)).toBe(false);
  });
});
