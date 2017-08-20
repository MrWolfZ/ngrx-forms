export interface ItemFormValue {
  readonly category: 'Private' | 'Work';
  readonly priority: number;
  readonly duedate: Date;
  readonly text: string;
}

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

export function duedateValidator(duedate: Date) {
  return !duedate ? { required: true } : {};
}
