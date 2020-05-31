import { deepEquals } from './util';

describe(deepEquals.name, () => {
  it('should compare numbers', () => {
    expect(deepEquals(NaN, NaN)).toBe(true);
    expect(deepEquals(1, 1)).toBe(true);
    expect(deepEquals(1, 2)).toBe(false);
    // tslint:disable-next-line:no-construct
    expect(deepEquals(new Number(1), new Number(1))).toBe(true);
  });

  it('should compare strings', () => {
    expect(deepEquals('a', 'a')).toBe(true);
    expect(deepEquals('a', 'b')).toBe(false);
    // tslint:disable-next-line:no-construct
    expect(deepEquals(new String('a'), new String('a'))).toBe(true);
  });

  it('should compare functions by their string representation', () => {
    const f = () => 1;
    const f2 = () => 2;
    expect(deepEquals(f, f)).toBe(true);
    expect(deepEquals(f, f2)).toBe(false);
  });

  it('should compare dates by their string representation', () => {
    const d = new Date(1970, 1);
    const d2 = new Date(2000, 1);
    expect(deepEquals(d, d)).toBe(true);
    expect(deepEquals(d, d2)).toBe(false);
  });

  it('should compare dates by their string representation', () => {
    const r = /./;
    const r2 = /../;
    expect(deepEquals(r, r)).toBe(true);
    expect(deepEquals(r, r2)).toBe(false);
  });

  it('should compare prototypes and constructors', () => {
    // tslint:disable
    class A { }
    class B extends A { }
    class C extends B { }
    const c = new C();
    const b1 = new B();
    const b2 = new B();
    expect(deepEquals(A.prototype, c)).toBe(false);
    expect(deepEquals(c, B.prototype)).toBe(false);
    expect(deepEquals(A, B)).toBe(false);
    expect(deepEquals(A, A)).toBe(true);
    expect(deepEquals(b1, c)).toBe(false);
    expect(deepEquals(b1, b2)).toBe(true);
    // tslint:enable
  });

  it('should compare plain objects', () => {
    expect(deepEquals({}, { a: '' })).toBe(false);
    expect(deepEquals({ a: '' }, {})).toBe(false);
    expect(deepEquals({ a: 1 }, { a: '' })).toBe(false);
    expect(deepEquals({ a: '' }, { a: '' })).toBe(true);
    expect(deepEquals({ a: 'a' }, { a: '' })).toBe(false);
    expect(deepEquals({ a: { b: '' } }, { a: { b: 'a' } })).toBe(false);
  });

  it('should compare plain objects with undefined properties', () => {
    expect(deepEquals({ a: 'a', b: undefined }, { a: 'a' })).toBe(false);
    expect(deepEquals({ a: 'a' }, { a: 'a', b: undefined })).toBe(false);
    expect(deepEquals({ a: 'a', b: undefined }, { a: 'a' }, { treatUndefinedAndMissingKeyAsSame: true })).toBe(true);
    expect(deepEquals({ a: 'a' }, { a: 'a', b: undefined }, { treatUndefinedAndMissingKeyAsSame: true })).toBe(true);
  });

  it('should compare cyclic objects', () => {
    const a = { b: undefined as any };
    a.b = a;

    expect(deepEquals(a, { b: { b: '' } })).toBe(false);
  });

  it('should throw if called with less than 2 arguments', () => {
    expect(() => (deepEquals as any)()).toThrowError();
    expect(() => (deepEquals as any)(1)).toThrowError();
  });
});
