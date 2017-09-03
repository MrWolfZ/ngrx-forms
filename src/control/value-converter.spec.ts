import { NgrxValueConverters } from './value-converter';

describe('NgrxValueConverters', () => {
  describe('identity', () => {
    it('should return the same view value', () => {
      const viewValue = new Date();
      expect(NgrxValueConverters.identity<Date>().convertViewToStateValue(viewValue)).toBe(viewValue);
    });

    it('should return the same state value', () => {
      const stateValue = new Date();
      expect(NgrxValueConverters.identity<Date>().convertStateToViewValue(stateValue)).toBe(stateValue);
    });
  });

  describe('dateToISOString', () => {
    it('should return an ISO string when converting view value', () => {
      const viewValue = new Date();
      const stateValue = NgrxValueConverters.dateToISOString.convertViewToStateValue(viewValue);
      expect(stateValue).toEqual(viewValue.toISOString());
    });

    it('should pass through "null" view values', () => {
      const stateValue = NgrxValueConverters.dateToISOString.convertViewToStateValue(null);
      expect(stateValue).toEqual(null);
    });

    it('should return a date when converting state value', () => {
      const stateValue = '1970-01-01T00:00:00.000Z';
      const viewValue = NgrxValueConverters.dateToISOString.convertStateToViewValue(stateValue);
      expect(viewValue).toEqual(new Date(stateValue));
    });

    it('should pass through "null" state values', () => {
      const viewValue = NgrxValueConverters.dateToISOString.convertStateToViewValue(null);
      expect(viewValue).toEqual(null);
    });

    it('should return an equal value if converting from view to state and back', () => {
      const viewValue = new Date();
      const stateValue = NgrxValueConverters.dateToISOString.convertViewToStateValue(viewValue);
      expect(NgrxValueConverters.dateToISOString.convertStateToViewValue(stateValue)).toEqual(viewValue);
    });
  });
});
