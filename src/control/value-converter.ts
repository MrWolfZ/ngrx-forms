
export interface NgrxValueConverter<TView, TState> {
  convertViewToStateValue(value: TView): TState;
  convertStateToViewValue(value: TState): TView;
}

// tslint:disable-next-line:variable-name
export const NgrxValueConverters = {
  default<T>() {
    return {
      convertViewToStateValue: value => value,
      convertStateToViewValue: value => value,
    } as NgrxValueConverter<T, T>;
  },
  dateToISOString: {
    convertViewToStateValue: date => date === null ? null : date.toISOString(),
    convertStateToViewValue: s => s === null ? null : new Date(Date.parse(s)),
  } as NgrxValueConverter<Date | null, string | null>,
  objectToJSON: {
    convertViewToStateValue: value => value === null ? null : JSON.stringify(value),
    convertStateToViewValue: s => s === null ? null : JSON.parse(s),
  } as NgrxValueConverter<{} | null, string | null>,
};
