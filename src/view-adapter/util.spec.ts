import { NgrxDefaultViewAdapter } from './default';
import { NgrxNumberViewAdapter } from './number';
import { NgrxRangeViewAdapter } from './range';
import { selectViewAdapter } from './util';

describe(selectViewAdapter.name, () => {
  it('should return the default view adapter if it is the only provided', () => {
    const viewAdapter = new NgrxDefaultViewAdapter(undefined as any, undefined as any, undefined as any);
    const result = selectViewAdapter([viewAdapter]);
    expect(result).toBe(viewAdapter);
  });

  it('should throw if more than one built-in adapter is provided', () => {
    const viewAdapter1 = new NgrxNumberViewAdapter(undefined as any, undefined as any);
    const viewAdapter2 = new NgrxRangeViewAdapter(undefined as any, undefined as any);
    expect(() => selectViewAdapter([viewAdapter1, viewAdapter2])).toThrowError('More than one built-in view adapter matches!');
  });

  it('should throw if more than one custom adapter is provided', () => {
    expect(() => selectViewAdapter([{} as any, {} as any])).toThrowError('More than one custom view adapter matches!');
  });

  it('should throw if no view adapters are provided', () => {
    expect(() => selectViewAdapter(null as any)).toThrowError('No view adapter matches!');
    expect(() => selectViewAdapter([])).toThrowError('No valid view adapter!');
  });
});
