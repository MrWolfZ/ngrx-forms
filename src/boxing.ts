export interface Boxed<T> {
  __boxed: '';
  value: T;
}

export interface UnboxedArray<T> extends Array<T> {
  [idx: number]: Unboxed<T>;
}

export type UnboxedObject<T> = {
  [prop in keyof T]: Unboxed<T[prop]>;
};

export type Unboxed<T> =
  // (ab)use 'symbol' to catch 'any' typing
  T extends Boxed<symbol[]> ? any
  : T extends Boxed<symbol> ? any
  : T extends Boxed<undefined> ? undefined
  : T extends Boxed<null> ? null
  : T extends Boxed<string> ? string
  : T extends Boxed<string | undefined> ? string | undefined
  : T extends Boxed<string | null> ? string | null
  : T extends Boxed<string | undefined | null> ? string | undefined | null
  : T extends Boxed<number> ? number
  : T extends Boxed<number | undefined> ? number | undefined
  : T extends Boxed<number | null> ? number | null
  : T extends Boxed<number | undefined | null> ? number | undefined | null
  : T extends Boxed<boolean> ? boolean
  : T extends Boxed<boolean | undefined> ? boolean | undefined
  : T extends Boxed<boolean | null> ? boolean | null
  : T extends Boxed<boolean | undefined | null> ? boolean | undefined | null
  : T extends Boxed<(infer U)[]> ? U[]
  : T extends Boxed<(infer U)[] | undefined> ? U[] | undefined
  : T extends Boxed<(infer U)[] | null> ? U[] | null
  : T extends Boxed<(infer U)[] | undefined | null> ? U[] | undefined | null
  : T extends Boxed<infer U> ? U
  : T extends Boxed<infer U | undefined> ? U | undefined
  : T extends Boxed<infer U | null> ? U | null
  : T extends Boxed<infer U | undefined | null> ? U | undefined | null
  : T extends symbol[] ? any
  : T extends symbol ? any
  : T extends undefined ? undefined
  : T extends null ? null
  : T extends string ? string
  : T extends number ? number
  : T extends boolean ? boolean
  : T extends (infer U)[] ? UnboxedArray<U>
  : UnboxedObject<T>;

export function isBoxed<T = any>(value: any): value is Boxed<T> {
  return !!value && (value as Boxed<any>).__boxed === '';
}

export function box<T>(value: T): Boxed<T> {
  return {
    __boxed: '',
    value,
  };
}

export function unbox<T>(value: T): Unboxed<T> {
  if (['string', 'boolean', 'number', 'undefined'].indexOf(typeof value) >= 0 || value === null) {
    return value as Unboxed<T>;
  }

  if (isBoxed<T>(value)) {
    return value.value as Unboxed<T>;
  }

  if (Array.isArray(value)) {
    return value.map(unbox) as Unboxed<T>;
  }

  return Object.keys(value).reduce((a, k) => Object.assign(a, { [k]: unbox(value[k as keyof T]) }), {} as Unboxed<T>);
}
