import { expectType } from 'tsd';
import { AbstractControlState, FormArrayState, FormControlState, FormGroupState, FormState } from '../public_api';

expectType<AbstractControlState<any>>(undefined! as FormState<any>);
expectType<AbstractControlState<any>>(undefined! as FormState<undefined>);
expectType<AbstractControlState<any>>(undefined! as FormState<null>);

expectType<FormControlState<string>>(undefined! as FormState<string>);
expectType<FormControlState<string | undefined>>(undefined! as FormState<string | undefined>);
expectType<FormControlState<string | null>>(undefined! as FormState<string | null>);
expectType<FormControlState<string | null | undefined>>(undefined! as FormState<string | null | undefined>);

expectType<FormControlState<number>>(undefined! as FormState<number>);
expectType<FormControlState<number | undefined>>(undefined! as FormState<number | undefined>);
expectType<FormControlState<number | null>>(undefined! as FormState<number | null>);
expectType<FormControlState<number | null | undefined>>(undefined! as FormState<number | null | undefined>);

expectType<FormControlState<boolean>>(undefined! as FormState<boolean>);
expectType<FormControlState<boolean | undefined>>(undefined! as FormState<boolean | undefined>);
expectType<FormControlState<boolean | null>>(undefined! as FormState<boolean | null>);
expectType<FormControlState<boolean | null | undefined>>(undefined! as FormState<boolean | null | undefined>);

expectType<FormGroupState<{ inner: string }>>(undefined! as FormState<{ inner: string }>);
expectType<FormGroupState<{ inner: string }>>(undefined! as FormState<{ inner: string } | undefined>);
expectType<FormGroupState<{ inner?: string }>>(undefined! as FormState<{ inner?: string }>);
expectType<FormControlState<string>>((undefined! as FormState<{ inner: string }>).controls.inner);
expectType<FormControlState<string | undefined> | undefined>((undefined! as FormState<{ inner?: string }>).controls.inner);

expectType<FormGroupState<{ inner?: {} }>>(undefined! as FormState<{ inner?: {} }>);
expectType<FormGroupState<{}> | undefined>((undefined! as FormState<{ inner?: {} }>).controls.inner);

expectType<FormArrayState<string>>(undefined! as FormState<string[]>);
expectType<FormArrayState<string>>(undefined! as FormState<string[] | undefined>);
expectType<FormArrayState<string>>(undefined! as FormState<readonly string[]>);
expectType<FormArrayState<any>>(undefined! as FormState<any[]>);
expectType<AbstractControlState<any>>((undefined! as FormState<any[]>).controls[0]);
