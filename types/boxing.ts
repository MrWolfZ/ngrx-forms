import { box, Boxed, unbox } from 'ngrx-forms';

unbox('A' as any); // $ExpectType any
unbox('A'); // $ExpectType string
unbox(true); // $ExpectType boolean
unbox(1); // $ExpectType number
unbox(undefined); // $ExpectType undefined
unbox(null); // $ExpectType null
unbox(['A']); // $ExpectType string[]
unbox(['A'])[0]; // $ExpectType string
unbox({ inner: 'A' }); // $ExpectType UnboxedObject<{ inner: string; }>
unbox({ inner: 'A' }).inner; // $ExpectType string

unbox(box('A' as any)); // $ExpectType any
unbox(box('A')); // $ExpectType string
unbox(box(true)); // $ExpectType boolean
unbox(box(1)); // $ExpectType number
unbox(box(undefined)); // $ExpectType undefined
unbox(box(null)); // $ExpectType null
unbox(box('A' as string | undefined)); // $ExpectType string | undefined
unbox(box(['A'])); // $ExpectType string[]
unbox(box(['A']))[0]; // $ExpectType string
unbox(box(['A'] as readonly string[])); // $ExpectType readonly string[]
unbox([box('A')]); // $ExpectType string[]
unbox([box('A')] as readonly Boxed<string>[]); // $ExpectType readonly string[]
unbox(box({ inner: 'A' })); // $ExpectType { inner: string; }
unbox({ inner: box('A') }); // $ExpectType UnboxedObject<{ inner: Boxed<string>; }>
unbox({ inner: box('A') }).inner; // $ExpectType string
