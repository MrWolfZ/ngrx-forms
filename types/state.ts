import { FormState } from 'ngrx-forms';

// $ExpectType AbstractControlState<any>
type FormState_any = FormState<any>;

// $ExpectType FormControlState<string>
type FormState_string = FormState<string>;

// $ExpectType FormControlState<string | undefined>
type FormState_string_or_undefined = FormState<string | undefined>;

// $ExpectType FormControlState<string | null>
type FormState_string_or_null = FormState<string | null>;

// $ExpectType FormGroupState<{ inner: string; }>
type FormState_object = FormState<{ inner: string }>;

// $ExpectType FormControlState<string>
type FormState_object_inner = FormState_object['controls']['inner'];

// $ExpectType FormGroupState<{ inner: string; }>
type FormState_object_or_undefined = FormState<{ inner: string } | undefined>;

// $ExpectType FormGroupState<{ inner?: string | undefined; }>
type FormState_object_optional_inner = FormState<{ inner?: string }>;

// $ExpectType FormControlState<string | undefined> | undefined
type FormState_object_optional_inner_inner = FormState_object_optional_inner['controls']['inner'];

// $ExpectType FormGroupState<{ inner?: {} | undefined; }>
type FormState_object_optional_inner_object = FormState<{ inner?: {} }>;

// $ExpectType FormGroupState<{}> | undefined
type FormState_object_optional_inner_object_inner = FormState_object_optional_inner_object['controls']['inner'];

// $ExpectType FormArrayState<string>
type FormState_array = FormState<string[]>;

// $ExpectType FormArrayState<string>
type FormState_array_or_undefined = FormState<string[] | undefined>;
