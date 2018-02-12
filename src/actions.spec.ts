import { isNgrxFormsAction } from './actions';

describe('action', () => {
  it('should return true if type is ngrx/forms/', () => {
    expect(isNgrxFormsAction({ type: 'ngrx/forms/' })).toBeTruthy();
  });

  it('should return true if type startsWith ngrx/forms/', () => {
    expect(isNgrxFormsAction({ type: 'ngrx/forms/test' })).toBeTruthy();
  });

  it('should return false if type does not have ngrx/forms/', () => {
    expect(isNgrxFormsAction({ type: 'some-type' })).toBeFalsy();
  });

  it('should return false if type is missing', () => {
    expect(isNgrxFormsAction({} as any)).toBeFalsy();
  });
});
