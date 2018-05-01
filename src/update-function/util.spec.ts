import { compose } from './util';

describe(compose.name, () => {
  it('should call the provided functions in order', () => {
    let firstCalled = false;
    let secondCalled = false;
    const result = compose<number>(i => {
      firstCalled = true;
      return i + 1;
    }, i => {
      secondCalled = true;
      return i + 1;
    })(0);

    expect(result).toBe(2);
    expect(firstCalled).toBe(true);
    expect(secondCalled).toBe(true);
  });
});
