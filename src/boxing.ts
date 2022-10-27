export interface Boxed<T> {
  __boxed: '';
  value: T;
}

export type UnboxedObject<T> = {
  [prop in keyof T]: Unboxed<T[prop]>;
};

export type Unboxed<T> =
  // (ab)use 'symbol' to catch 'any' typing
  T extends Boxed<symbol> ? any
  : T extends Boxed<infer U> ? U
  : T extends symbol[] ? any
  : T extends symbol ? any
  : T extends undefined ? undefined
  : T extends null ? null
  : T extends string ? string
  : T extends number ? number
  : T extends boolean ? boolean
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
  if (['string', 'boolean', 'number', 'undefined'].indexOf(typeof value) >= 0 || value === null || value === undefined) {
    return value as unknown as Unboxed<T>;
  }

  if (isBoxed<T>(value)) {
    return value.value as unknown as Unboxed<T>;
  }

  if (Array.isArray(value)) {
    return (value as any).map(unbox) as Unboxed<T>;
  }

  return Object.keys(value as any).reduce(
    (a, k) => Object.assign(a, { [k]: unbox(value[k as keyof T] as any) }),
    {} as any,
  ) as Unboxed<T>;
}
