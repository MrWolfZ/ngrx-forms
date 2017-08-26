export interface MetaFormValue {
  readonly priority: number;
  readonly duedate: string;
}

export interface ItemFormValue {
  readonly category: 'Private' | 'Work';
  readonly text: string;
  readonly meta: MetaFormValue;
}

export const initialItemFormValue: ItemFormValue = {
  category: 'Work',
  text: '',
  meta: {
    priority: 1,
    duedate: new Date().toISOString(),
  },
};

export function validateText(text: string) {
  return !text ? { required: true } : {};
}

export function validatePriority(priority: number) {
  if (priority === null || priority === undefined) {
    return { required: true };
  }

  if (priority <= 0) {
    return { min: 1 };
  }

  return {};
}

export function validateDuedate(duedate: string) {
  return !duedate ? { required: true } : {};
}
