import { NgrxValidators } from './validator';

describe('NgrxValidators', () => {
  const required = NgrxValidators.required;
  const expectedErrors = { required: true };

  describe('required', () => {
    it('should return an error for undefined values', () => {
      expect(required(undefined)).toEqual(expectedErrors);
    });

    it('should return an error for null values', () => {
      expect(required(null)).toEqual(expectedErrors);
    });

    it('should return an error for empty string values', () => {
      expect(required('')).toEqual(expectedErrors);
    });

    it('should not return an error for number zero', () => {
      expect(required(0)).toEqual({});
    });

    it('should not return an error for number values', () => {
      expect(required(415)).toEqual({});
    });

    it('should not return an error for non-empty string values', () => {
      expect(required('a')).toEqual({});
    });

    it('should not return an error for date values', () => {
      expect(required(new Date())).toEqual({});
    });

    it('should not return an error for true', () => {
      expect(required(true)).toEqual({});
    });

    it('should not return an error for false', () => {
      expect(required(false)).toEqual({});
    });
  });
});
