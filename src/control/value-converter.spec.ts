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

    it('should return an equal value if converting from state to view and back', () => {
      const stateValue = '1970-01-01T00:00:00.000Z';
      const viewValue = NgrxValueConverters.dateToISOString.convertStateToViewValue(stateValue);
      expect(NgrxValueConverters.dateToISOString.convertViewToStateValue(viewValue)).toEqual(stateValue);
    });
  });

  describe('objectToJSON', () => {
    const testObject = {
      a: [1, 2, 3],
      b: {
        c: '456'
      },
    };
    const testJSON = '{"a":[1,2,3],"b":{"c":"456"}}';

    it('should return an object when converting a view value', () => {
      const stateValue = NgrxValueConverters.objectToJSON.convertViewToStateValue(testObject);
      expect(stateValue).toEqual(testJSON);
    });

    it('should pass through a "null" view value', () => {
      const stateValue = NgrxValueConverters.objectToJSON.convertViewToStateValue(null);
      expect(stateValue).toEqual(null);
    });

    it('should return a JSON string when converting state value', () => {
      const viewValue = NgrxValueConverters.objectToJSON.convertStateToViewValue(testJSON);
      expect(viewValue).toEqual(testObject);
    });

    it('should pass through a "null" state value', () => {
      const stateValue = NgrxValueConverters.objectToJSON.convertStateToViewValue(null);
      expect(stateValue).toEqual(null);
    });

    it('should return an equal value if converting from view to state and back', () => {
      const stateValue = NgrxValueConverters.objectToJSON.convertViewToStateValue(testJSON);
      expect(NgrxValueConverters.objectToJSON.convertStateToViewValue(stateValue)).toEqual(testJSON);
    });
  });
});
