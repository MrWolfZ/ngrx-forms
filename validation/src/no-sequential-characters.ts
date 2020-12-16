import { Boxed, unbox, ValidationErrors } from 'ngrx-forms';

export interface SequentialCharacterValidationError {
  value: string;
  detectedSequence: string;
}

// @ts-ignore
declare module 'ngrx-forms/src/state' {
  export interface ValidationErrors {
    noSequentialCharacters?: SequentialCharacterValidationError;
  }
}

/**
 * A validation function that invalidates input if `maxLength` number of sequential
 * characters (e.g. 'abc' or '123') are detected.
 *
 * The validation error returned by this validation function has the following shape:
 *
```typescript
{
  noSequentialCharacters: {
    value: string;
    detectedSequence: string;
  };
}
```
 *
 * Usually you would use this validation function in conjunction with the `validate`
 * update function to perform synchronous validation in your reducer:
 *
```typescript
updateGroup<MyFormValue>({
  name: validate(noSequentialCharacters(3)),
})
```
 */
export function noSequentialCharacters(maxLengthParam: number) {
  // tslint:disable-next-line:strict-type-predicates (guard for users without strict type checking)
  if (maxLengthParam === null || maxLengthParam === undefined) {
    throw new Error(`The maxLength Validation function requires the maxLength parameter to be a non-null number, got ${maxLengthParam}!`);
  }

  return <T extends string | Boxed<string> | any[] | Boxed<any[]> | null | undefined>(value: T): ValidationErrors => {
    if (value === null || value === undefined) {
      return {};
    }

    value = unbox(value);
    let foundSequence = detectedSequence(value, maxLengthParam);

    return foundSequence ? {
      noSequentialCharacters: {
        value: value as string,
        detectedSequence: foundSequence as string,
      }
    } : {};
  };
}

function detectedSequence(value: any, maxLength: number) {
  if (value.length < maxLength) {
    return false;
  }

  let foundSequence;
  let sequentialChars = 1;
  let lastCharCode = value.charCodeAt(0);

  for(let i = 1; i < value.length; i++) {
    let currentCharCode = value.charCodeAt(i);
    // special cases - 'z', 'Z' and '9' - set counter to 0 & move on to next iteration of the loop
    if ([122, 90, 57].indexOf(currentCharCode) !== -1) {
      sequentialChars = 1;
      continue;
    }

    // compare to previous character, increment or reset counter
    if (currentCharCode === lastCharCode + 1) {
      sequentialChars++;
    } else {
      sequentialChars = 1;
    }

    // break out of a loop as soon as maxLength of sequential characters detected
    if (sequentialChars === maxLength) {
      foundSequence = value.substr(i + 1 - maxLength, maxLength);
      break;
    }

    lastCharCode = currentCharCode;
  }

  if (sequentialChars >= maxLength) {
    return foundSequence;
  } else {
    return false;
  }
}
