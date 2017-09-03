export interface MetaFormValue {
  readonly priority: number | null;
  readonly duedate: string | null;
}

export interface ItemFormValue {
  readonly category: 'Private' | 'Work';
  readonly text: string | null;
  readonly meta: MetaFormValue;
}

const now = new Date();
const nowUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
export const initialItemFormValue: ItemFormValue = {
  category: 'Work',
  text: '',
  meta: {
    priority: 1,
    duedate: new Date(nowUtc).toISOString(),
  },
};

export function validateText(text: string | null) {
  if (!text) {
    return { required: true };
  }

  if (text.length > 50) {
    return { maxLength: [text.length, 50] };
  }

  return {};
}

export function validatePriority(priority: number | null) {
  if (priority === null || priority === undefined) {
    return { required: true };
  }

  if (priority <= 0) {
    return { min: 1 };
  }

  return {};
}

export function validateDuedate(duedate: string | null) {
  return !duedate ? { required: true } : {};
}
