import { equalTo } from './equal-to';

describe('equalTo', () => {
  it('should not return an error if value is equal to comparand', () => {
    expect(equalTo(1)(1)).toEqual({});
  });

  it('should return an error if value is not equal to comparand', () => {
    expect(equalTo(1)(0)).not.toEqual({});
  });

  it('should return errors with comparand and actual properties', () => {
    const comparand = 1;
    const actualValue = 0;
    expect(equalTo(comparand)(actualValue)).toEqual({
      equalTo: {
        comparand,
        actual: actualValue,
      },
    });
  });
});
