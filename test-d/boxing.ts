import { expectType } from 'tsd';
import { box, Boxed, unbox, UnboxedObject } from '../public_api';

expectType<any>(unbox('A' as any));
expectType<string>(unbox('A'));
expectType<boolean>(unbox(true));
expectType<number>(unbox(1));
expectType<undefined>(unbox(undefined));
expectType<null>(unbox(null));
expectType<string[]>(unbox(['A']));
expectType<string>(unbox(['A'])[0]);
expectType<UnboxedObject<{ inner: string }>>(unbox({ inner: 'A' }));
expectType<string>(unbox({ inner: 'A' }).inner);

expectType<any>(unbox(box('A' as any)));
expectType<string>(unbox(box('A')));
expectType<boolean>(unbox(box(true)));
expectType<number>(unbox(box(1)));
expectType<undefined>(unbox(box(undefined)));
expectType<null>(unbox(box(null)));
expectType<string | undefined>(unbox(box('A' as string | undefined)));
expectType<string[]>(unbox(box(['A'])));
expectType<string>(unbox(box(['A']))[0]);
expectType<readonly string[]>(unbox(box(['A'] as readonly string[])));
expectType<string[]>(unbox([box('A')]));
expectType<readonly string[]>(unbox([box('A')] as readonly Boxed<string>[]));
expectType<{ inner: string }>(unbox(box({ inner: 'A' })));
expectType<UnboxedObject<{ inner: Boxed<string> }>>(unbox({ inner: box('A') }));
expectType<string>(unbox({ inner: box('A') }).inner);
