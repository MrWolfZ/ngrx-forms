export function isEmpty(obj: object) {
  return Object.keys(obj).length === 0;
}

export interface DeepEqualsOptions {
  treatUndefinedAndMissingKeyAsSame?: boolean;
}

const defaultOptions: Required<DeepEqualsOptions> = {
  treatUndefinedAndMissingKeyAsSame: false,
};

export function deepEquals<T>(_1: T, _2: T, options: DeepEqualsOptions = {}) {
  const { treatUndefinedAndMissingKeyAsSame } = Object.assign({}, defaultOptions, options);

  const leftChain: any[] = [];
  const rightChain: any[] = [];

  function compare2Objects(x: any, y: any) {
    let p;

    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
      return true;
    }

    // Compare primitives and functions.
    // Check if both arguments link to the same object.
    // Especially useful on the step where we compare prototypes
    if (x === y) {
      return true;
    }

    // Works in case when functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handle functions passed across iframes
    if ((typeof x === 'function' && typeof y === 'function') ||
      (x instanceof Date && y instanceof Date) ||
      (x instanceof RegExp && y instanceof RegExp) ||
      (x instanceof String && y instanceof String) ||
      (x instanceof Number && y instanceof Number)) {
      return x.toString() === y.toString();
    }

    // At last checking prototypes as good as we can
    if (!(x instanceof Object && y instanceof Object)) {
      return false;
    }

    if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
      return false;
    }

    if (x.constructor !== y.constructor) {
      return false;
    }

    // Check for infinitive linking loops
    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
      return false;
    }

    // Quick checking of one object being a subset of another.
    for (p in y) {
      if (treatUndefinedAndMissingKeyAsSame && y.hasOwnProperty(p) && !x.hasOwnProperty(p) && y[p] === undefined) {
        continue;
      }

      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        return false;
      } else if (typeof y[p] !== typeof x[p]) {
        return false;
      }
    }

    // tslint:disable:forin
    for (p in x) {
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        if (!treatUndefinedAndMissingKeyAsSame || !x.hasOwnProperty(p) || y.hasOwnProperty(p) || x[p] !== undefined) {
          return false;
        }
      }

      switch (typeof (x[p])) {
        case 'object':
        case 'function':

          leftChain.push(x);
          rightChain.push(y);

          if (!compare2Objects(x[p], y[p])) {
            return false;
          }

          leftChain.pop();
          rightChain.pop();
          break;

        default:
          if (x[p] !== y[p]) {
            return false;
          }
          break;
      }
    }

    return true;
  }

  if (arguments.length <= 1) {
    throw new Error('Need two or more arguments to compare');
  }

  return compare2Objects(_1, _2);
}
