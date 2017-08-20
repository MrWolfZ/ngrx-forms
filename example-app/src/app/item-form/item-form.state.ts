export interface ItemFormValue {
  readonly category: 'Private' | 'Work';
  readonly text: string;
  readonly meta: {
    readonly priority: number;
    readonly duedate: string;
  };
}

export const initialItemFormValue: ItemFormValue = {
  category: 'Private',
  text: '',
  meta: {
    priority: 1,
    duedate: new Date().toISOString(),
  },
};

export function textValidator(text: string) {
  return !text ? { required: true } : {};
}

export function priorityValidator(priority: number) {
  if (priority === null || priority === undefined) {
    return { required: true };
  }

  if (priority <= 0) {
    return { min: 1 };
  }

  return {};
}

export function duedateValidator(duedate: string) {
  return !duedate ? { required: true } : {};
}
