import { $Base } from '../utils/$';
import { Something, Provider, ResultPromise, ResultValidator, ResultProvider } from './utils';
import ValidatorDescribed from '../descriptions/ValidatorDescribed';

export default interface Validator<Badge extends string, $ extends $Base, Data> extends ValidatorDescribed {
  with<T = Something | Promise<Something>>(target: T): Validator<Badge, $, ResultPromise<T>>;

  then<T = Something | Promise<Something> | Validator<Badge, $, Something>>(task: Provider<Data, T>): Validator<Badge, $, ResultValidator<Badge, $, T>>;

  do<T = Something | Promise<Something> | Validator<Badge, $, Something>>(
    task: Data extends readonly []
      ? () => T
      : Data extends readonly [(infer D0)]
      ? (d0: D0) => T
      : Data extends readonly [(infer D0), (infer D1)]
      ? (d0: D0, d1: D1) => T
      : Data extends readonly [(infer D0), (infer D1), (infer D2)]
      ? (d0: D0, d1: D1, d2: D2) => T
      : Data extends readonly [(infer D0), (infer D1), (infer D2), (infer D3)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3) => T
      : Data extends readonly [(infer D0), (infer D1), (infer D2), (infer D3), (infer D4)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4) => T
      : Data extends readonly [(infer D0), (infer D1), (infer D2), (infer D3), (infer D4), (infer D5)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => T
      : Data extends readonly [(infer D0), (infer D1), (infer D2), (infer D3), (infer D4), (infer D5), (infer D6)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => T
      : Data extends readonly [(infer D0), (infer D1), (infer D2), (infer D3), (infer D4), (infer D5), (infer D6), (infer D7)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => T
      : Data extends readonly [(infer D0), (infer D1), (infer D2), (infer D3), (infer D4), (infer D5), (infer D6), (infer D7), (infer D8)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => T
      : Data extends readonly [(infer D0), (infer D1), (infer D2), (infer D3), (infer D4), (infer D5), (infer D6), (infer D7), (infer D8), (infer D9)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => T
      : Data extends readonly [
          (infer D0),
          (infer D1),
          (infer D2),
          (infer D3),
          (infer D4),
          (infer D5),
          (infer D6),
          (infer D7),
          (infer D8),
          (infer D9),
          ...(infer I)[]
        ]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9, ...others: I[]) => T
      : never
  ): Data extends readonly any[] ? Validator<Badge, $, ResultValidator<Badge, $, T>> : never;

  each<T = Something | Promise<Something> | Validator<Badge, $, Something>>(
    task: Data extends readonly (infer I)[] ? (item: I, index: number, data: Data) => T : never
  ): Data extends readonly any[] ? Validator<Badge, $, ResultValidator<Badge, $, T>[]> : never;

  after<T0 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>>(
    target0: T0
  ): Validator<Badge, $, [ResultProvider<Badge, $, T0>]>;
  after<
    T0 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T1 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>
  >(
    target0: T0,
    target1: T1
  ): Validator<Badge, $, [ResultProvider<Badge, $, T0>, ResultProvider<Badge, $, T1>]>;
  after<
    T0 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T1 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T2 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>
  >(
    target0: T0,
    target1: T1,
    target2: T2
  ): Validator<Badge, $, [ResultProvider<Badge, $, T0>, ResultProvider<Badge, $, T1>, ResultProvider<Badge, $, T2>]>;
  after<
    T0 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T1 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T2 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T3 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>
  >(
    target0: T0,
    target1: T1,
    target2: T2,
    target3: T3
  ): Validator<Badge, $, [ResultProvider<Badge, $, T0>, ResultProvider<Badge, $, T1>, ResultProvider<Badge, $, T2>, ResultProvider<Badge, $, T3>]>;
  after<
    T0 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T1 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T2 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T3 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T4 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>
  >(
    target0: T0,
    target1: T1,
    target2: T2,
    target3: T3,
    target4: T4
  ): Validator<
    Badge,
    $,
    [ResultProvider<Badge, $, T0>, ResultProvider<Badge, $, T1>, ResultProvider<Badge, $, T2>, ResultProvider<Badge, $, T3>, ResultProvider<Badge, $, T4>]
  >;
  after<
    T0 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T1 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T2 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T3 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T4 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T5 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>
  >(
    target0: T0,
    target1: T1,
    target2: T2,
    target3: T3,
    target4: T4,
    target5: T5
  ): Validator<
    Badge,
    $,
    [
      ResultProvider<Badge, $, T0>,
      ResultProvider<Badge, $, T1>,
      ResultProvider<Badge, $, T2>,
      ResultProvider<Badge, $, T3>,
      ResultProvider<Badge, $, T4>,
      ResultProvider<Badge, $, T5>
    ]
  >;
  after<
    T0 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T1 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T2 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T3 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T4 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T5 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T6 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>
  >(
    target0: T0,
    target1: T1,
    target2: T2,
    target3: T3,
    target4: T4,
    target5: T5,
    target6: T6
  ): Validator<
    Badge,
    $,
    [
      ResultProvider<Badge, $, T0>,
      ResultProvider<Badge, $, T1>,
      ResultProvider<Badge, $, T2>,
      ResultProvider<Badge, $, T3>,
      ResultProvider<Badge, $, T4>,
      ResultProvider<Badge, $, T5>,
      ResultProvider<Badge, $, T6>
    ]
  >;
  after<
    T0 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T1 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T2 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T3 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T4 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T5 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T6 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T7 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>
  >(
    target0: T0,
    target1: T1,
    target2: T2,
    target3: T3,
    target4: T4,
    target5: T5,
    target6: T6,
    target7: T7
  ): Validator<
    Badge,
    $,
    [
      ResultProvider<Badge, $, T0>,
      ResultProvider<Badge, $, T1>,
      ResultProvider<Badge, $, T2>,
      ResultProvider<Badge, $, T3>,
      ResultProvider<Badge, $, T4>,
      ResultProvider<Badge, $, T5>,
      ResultProvider<Badge, $, T6>,
      ResultProvider<Badge, $, T7>
    ]
  >;
  after<
    T0 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T1 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T2 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T3 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T4 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T5 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T6 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T7 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T8 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>
  >(
    target0: T0,
    target1: T1,
    target2: T2,
    target3: T3,
    target4: T4,
    target5: T5,
    target6: T6,
    target7: T7,
    target8: T8
  ): Validator<
    Badge,
    $,
    [
      ResultProvider<Badge, $, T0>,
      ResultProvider<Badge, $, T1>,
      ResultProvider<Badge, $, T2>,
      ResultProvider<Badge, $, T3>,
      ResultProvider<Badge, $, T4>,
      ResultProvider<Badge, $, T5>,
      ResultProvider<Badge, $, T6>,
      ResultProvider<Badge, $, T7>,
      ResultProvider<Badge, $, T8>
    ]
  >;
  after<
    T0 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T1 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T2 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T3 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T4 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T5 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T6 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T7 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T8 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T9 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>
  >(
    target0: T0,
    target1: T1,
    target2: T2,
    target3: T3,
    target4: T4,
    target5: T5,
    target6: T6,
    target7: T7,
    target8: T8,
    target9: T9
  ): Validator<
    Badge,
    $,
    [
      ResultProvider<Badge, $, T0>,
      ResultProvider<Badge, $, T1>,
      ResultProvider<Badge, $, T2>,
      ResultProvider<Badge, $, T3>,
      ResultProvider<Badge, $, T4>,
      ResultProvider<Badge, $, T5>,
      ResultProvider<Badge, $, T6>,
      ResultProvider<Badge, $, T7>,
      ResultProvider<Badge, $, T8>,
      ResultProvider<Badge, $, T9>
    ]
  >;
  after<
    T0 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T1 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T2 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T3 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T4 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T5 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T6 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T7 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T8 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T9 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>
  >(
    target0: T0,
    target1: T1,
    target2: T2,
    target3: T3,
    target4: T4,
    target5: T5,
    target6: T6,
    target7: T7,
    target8: T8,
    target9: T9,
    ...others: T[]
  ): Validator<
    Badge,
    $,
    [
      ResultProvider<Badge, $, T0>,
      ResultProvider<Badge, $, T1>,
      ResultProvider<Badge, $, T2>,
      ResultProvider<Badge, $, T3>,
      ResultProvider<Badge, $, T4>,
      ResultProvider<Badge, $, T5>,
      ResultProvider<Badge, $, T6>,
      ResultProvider<Badge, $, T7>,
      ResultProvider<Badge, $, T8>,
      ResultProvider<Badge, $, T9>,
      ...ResultProvider<Badge, $, T>[]
    ]
  >;

  object<T = Something | Promise<Something>>(target: T): Validator<Badge, $, ResultPromise<T>>;

  array<T = Something | Promise<Something>>(target: T): Validator<Badge, $, ResultPromise<T>>;

  check(badge: Badge, validity: boolean | Provider<Data, boolean>, message?: string | Provider<Data, string>): Validator<Badge, $, Data>;

  when(...badges: Badge[]): Validator<Badge, $, Data>;

  must(...conditions: (boolean | Provider<Data, boolean>)[]): Validator<Badge, $, Data>;

  if(...conditions: (boolean | Provider<Data, boolean>)[]): Validator<Badge, $, Data>;

  earn(badge: Badge): Validator<Badge, $, Data>;

  fail(badge: Badge, message?: string | Provider<Data, string>): Validator<Badge, $, Data>;

  set: Data extends undefined ? (() => never) : (($path: Data) => Validator<Badge, $, Data>);

  put<T = Something, U = T | Promise<T>>($path: T, value: U | Provider<Data, U>): Validator<Badge, $, ResultPromise<U>>;

  get<T = Something>($path: T): Validator<Badge, $, T>;

  use<T = Something, U = Something | Promise<Something> | Validator<Badge, $, Something>>(
    $path: T,
    task: Data extends undefined ? ((value: T) => U) : ((value: T, data: Data) => U)
  ): Validator<Badge, $, ResultValidator<Badge, $, U>>;

  readonly value: Data | Promise<Data>;
}
