import { Boxed, FormState } from 'ngrx-forms';

// $ExpectType AbstractControlState<any>
type FormState_any = FormState<any>;

// $ExpectType AbstractControlState<any>
type FormState_undefined = FormState<undefined>;

// $ExpectType AbstractControlState<any>
type FormState_null = FormState<null>;

// $ExpectType FormControlState<string>
type FormState_string = FormState<string>;

// $ExpectType FormControlState<string | undefined>
type FormState_string_or_undefined = FormState<string | undefined>;

// $ExpectType FormControlState<string | null>
type FormState_string_or_null = FormState<string | null>;

// $ExpectType FormControlState<string | null | undefined>
type FormState_string_undefined_or_null = FormState<string | null | undefined>;

// $ExpectType FormControlState<number>
type FormState_number = FormState<number>;

// $ExpectType FormControlState<number | undefined>
type FormState_number_or_undefined = FormState<number | undefined>;

// $ExpectType FormControlState<number | null>
type FormState_number_or_null = FormState<number | null>;

// $ExpectType FormControlState<boolean>
type FormState_boolean = FormState<boolean>;

// $ExpectType FormControlState<boolean | undefined>
type FormState_boolean_or_undefined = FormState<boolean | undefined>;

// $ExpectType FormControlState<boolean | null>
type FormState_boolean_or_null = FormState<boolean | null>;

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

// $ExpectType FormArrayState<string>
type FormState_readonly_array = FormState<readonly string[]>;

// $ExpectType FormArrayState<any>
type FormState_any_array = FormState<any[]>;

// $ExpectType AbstractControlState<any>
type FormState_any_array_element = FormState_any_array['controls'][number];

// $ExpectType FormControlState<Boxed<string>>
type FormState_boxed_string = FormState<Boxed<string>>;

// $ExpectType FormControlState<Boxed<string | undefined>>
type FormState_boxed_string_or_undefined_inside = FormState<Boxed<string | undefined>>;

// $ExpectType FormControlState<Boxed<string> | undefined>
type FormState_boxed_string_or_undefined = FormState<Boxed<string> | undefined>;
