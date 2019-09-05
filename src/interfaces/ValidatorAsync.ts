import { $Base } from '../utils/$';
import { Something, Provider, Value } from './utils';
import ValidatorDescribed from '../descriptions/ValidatorDescribed';
import Validator from './Validator';

export default interface ValidatorAsync<Badge extends string, $ extends $Base, Data> extends ValidatorDescribed {
  with<T = Something | Promise<Something>>(
    target: T
  ): T extends Promise<infer D> ? ValidatorAsync<Badge, $, D> : T extends boolean ? ValidatorAsync<Badge, $, boolean> : ValidatorAsync<Badge, $, T>;

  then<T = Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>(
    task: Provider<Data, T>
  ): T extends Promise<infer D> | ValidatorAsync<Badge, $, infer D>
    ? ValidatorAsync<Badge, $, D>
    : T extends Validator<Badge, $, infer D>
    ? ValidatorAsync<Badge, $, D>
    : T extends boolean
    ? ValidatorAsync<Badge, $, boolean>
    : ValidatorAsync<Badge, $, T>;

  do<T = Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>(
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
      : Data extends readonly (infer I)[]
      ? (...portions: I[]) => T
      : never
  ): Data extends readonly any[]
    ? (T extends Promise<infer D> | ValidatorAsync<Badge, $, infer D>
        ? ValidatorAsync<Badge, $, D>
        : T extends Validator<Badge, $, infer D>
        ? ValidatorAsync<Badge, $, D>
        : T extends boolean
        ? ValidatorAsync<Badge, $, boolean>
        : ValidatorAsync<Badge, $, T>)
    : never;

  each<T = Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>(
    task: Data extends readonly (infer I)[] ? (item: I, index: number, data: Data) => T : never
  ): Data extends readonly any[]
    ? (T extends Promise<infer D> | ValidatorAsync<Badge, $, infer D>
        ? ValidatorAsync<Badge, $, D[]>
        : T extends Validator<Badge, $, infer D>
        ? ValidatorAsync<Badge, $, D[]>
        : T extends boolean
        ? ValidatorAsync<Badge, $, boolean[]>
        : ValidatorAsync<Badge, $, T[]>)
    : never;

  after<
    T0 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>
  >(
    target0: T0
  ): ValidatorAsync<Badge, $, [Value<Badge, $, Data, T0>]>;
  after<
    T0 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T1 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>
  >(
    target0: T0,
    target1: T1
  ): ValidatorAsync<Badge, $, [Value<Badge, $, Data, T0>, Value<Badge, $, Data, T1>]>;
  after<
    T0 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T1 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T2 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>
  >(
    target0: T0,
    target1: T1,
    target2: T2
  ): ValidatorAsync<Badge, $, [Value<Badge, $, Data, T0>, Value<Badge, $, Data, T1>, Value<Badge, $, Data, T2>]>;
  after<
    T0 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T1 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T2 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T3 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>
  >(
    target0: T0,
    target1: T1,
    target2: T2,
    target3: T3
  ): ValidatorAsync<Badge, $, [Value<Badge, $, Data, T0>, Value<Badge, $, Data, T1>, Value<Badge, $, Data, T2>, Value<Badge, $, Data, T3>]>;
  after<
    T0 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T1 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T2 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T3 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T4 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>
  >(
    target0: T0,
    target1: T1,
    target2: T2,
    target3: T3,
    target4: T4
  ): ValidatorAsync<
    Badge,
    $,
    [Value<Badge, $, Data, T0>, Value<Badge, $, Data, T1>, Value<Badge, $, Data, T2>, Value<Badge, $, Data, T3>, Value<Badge, $, Data, T4>]
  >;
  after<
    T0 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T1 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T2 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T3 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T4 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T5 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>
  >(
    target0: T0,
    target1: T1,
    target2: T2,
    target3: T3,
    target4: T4,
    target5: T5
  ): ValidatorAsync<
    Badge,
    $,
    [
      Value<Badge, $, Data, T0>,
      Value<Badge, $, Data, T1>,
      Value<Badge, $, Data, T2>,
      Value<Badge, $, Data, T3>,
      Value<Badge, $, Data, T4>,
      Value<Badge, $, Data, T5>
    ]
  >;
  after<
    T0 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T1 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T2 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T3 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T4 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T5 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T6 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>
  >(
    target0: T0,
    target1: T1,
    target2: T2,
    target3: T3,
    target4: T4,
    target5: T5,
    target6: T6
  ): ValidatorAsync<
    Badge,
    $,
    [
      Value<Badge, $, Data, T0>,
      Value<Badge, $, Data, T1>,
      Value<Badge, $, Data, T2>,
      Value<Badge, $, Data, T3>,
      Value<Badge, $, Data, T4>,
      Value<Badge, $, Data, T5>,
      Value<Badge, $, Data, T6>
    ]
  >;
  after<
    T0 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T1 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T2 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T3 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T4 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T5 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T6 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T7 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>
  >(
    target0: T0,
    target1: T1,
    target2: T2,
    target3: T3,
    target4: T4,
    target5: T5,
    target6: T6,
    target7: T7
  ): ValidatorAsync<
    Badge,
    $,
    [
      Value<Badge, $, Data, T0>,
      Value<Badge, $, Data, T1>,
      Value<Badge, $, Data, T2>,
      Value<Badge, $, Data, T3>,
      Value<Badge, $, Data, T4>,
      Value<Badge, $, Data, T5>,
      Value<Badge, $, Data, T6>,
      Value<Badge, $, Data, T7>
    ]
  >;
  after<
    T0 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T1 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T2 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T3 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T4 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T5 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T6 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T7 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T8 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>
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
  ): ValidatorAsync<
    Badge,
    $,
    [
      Value<Badge, $, Data, T0>,
      Value<Badge, $, Data, T1>,
      Value<Badge, $, Data, T2>,
      Value<Badge, $, Data, T3>,
      Value<Badge, $, Data, T4>,
      Value<Badge, $, Data, T5>,
      Value<Badge, $, Data, T6>,
      Value<Badge, $, Data, T7>,
      Value<Badge, $, Data, T8>
    ]
  >;
  after<
    T0 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T1 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T2 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T3 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T4 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T5 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T6 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T7 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T8 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T9 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>
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
  ): ValidatorAsync<
    Badge,
    $,
    [
      Value<Badge, $, Data, T0>,
      Value<Badge, $, Data, T1>,
      Value<Badge, $, Data, T2>,
      Value<Badge, $, Data, T3>,
      Value<Badge, $, Data, T4>,
      Value<Badge, $, Data, T5>,
      Value<Badge, $, Data, T6>,
      Value<Badge, $, Data, T7>,
      Value<Badge, $, Data, T8>,
      Value<Badge, $, Data, T9>
    ]
  >;
  after<
    T0 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T1 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T2 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T3 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T4 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T5 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T6 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T7 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T8 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T9 =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>,
    T =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>
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
  ): ValidatorAsync<
    Badge,
    $,
    [
      Value<Badge, $, Data, T0>,
      Value<Badge, $, Data, T1>,
      Value<Badge, $, Data, T2>,
      Value<Badge, $, Data, T3>,
      Value<Badge, $, Data, T4>,
      Value<Badge, $, Data, T5>,
      Value<Badge, $, Data, T6>,
      Value<Badge, $, Data, T7>,
      Value<Badge, $, Data, T8>,
      Value<Badge, $, Data, T9>,
      ...Value<Badge, $, Data, T>[]
    ]
  >;
  after<
    T =
      | Something
      | Promise<Something>
      | Validator<Badge, $, Something>
      | ValidatorAsync<Badge, $, Something>
      | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>
  >(
    ...targets: T[]
  ): ValidatorAsync<Badge, $, Value<Badge, $, Data, T>[]>;

  object<T = Something | Promise<Something>>(
    target: T
  ): T extends Promise<infer D> ? ValidatorAsync<Badge, $, D> : T extends boolean ? ValidatorAsync<Badge, $, boolean> : ValidatorAsync<Badge, $, T>;

  array<T = Something | Promise<Something>>(
    target: T
  ): T extends Promise<infer D> ? ValidatorAsync<Badge, $, D> : T extends boolean ? ValidatorAsync<Badge, $, boolean> : ValidatorAsync<Badge, $, T>;

  check(badge: Badge, validity: boolean | Provider<Data, boolean>, message?: string | Provider<Data, string>): ValidatorAsync<Badge, $, Data>;

  when(...badges: Badge[]): ValidatorAsync<Badge, $, Data>;

  must(...conditions: (boolean | Provider<Data, boolean>)[]): ValidatorAsync<Badge, $, Data>;

  if(...conditions: (boolean | Provider<Data, boolean>)[]): ValidatorAsync<Badge, $, Data>;

  earn(badge: Badge): ValidatorAsync<Badge, $, Data>;

  fail(badge: Badge, message?: string | Provider<Data, string>): ValidatorAsync<Badge, $, Data>;

  set: Data extends undefined ? (() => never) : (($path: Data) => ValidatorAsync<Badge, $, Data>);

  put<T = Something, U = T | Promise<T>>(
    $path: T,
    value: U | Provider<Data, U>
  ): U extends Promise<infer T> ? ValidatorAsync<Badge, $, T> : U extends boolean ? ValidatorAsync<Badge, $, boolean> : ValidatorAsync<Badge, $, U>;

  get<T = Something>($path: T): ValidatorAsync<Badge, $, T>;

  use<T = Something, U = Something | Promise<Something>>(
    $path: T,
    task: Data extends undefined ? ((value: T) => U) : ((value: T, data: Data) => U)
  ): U extends Promise<infer D> ? ValidatorAsync<Badge, $, D> : U extends boolean ? ValidatorAsync<Badge, $, boolean> : ValidatorAsync<Badge, $, U>;

  /**
   * TODO
   */
  readonly value: Promise<Data>;
}
