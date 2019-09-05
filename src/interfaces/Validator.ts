import { $Base } from '../utils/$';
import { Something, Provider, Result, Value } from './utils';
import ValidatorDescribed from '../descriptions/ValidatorDescribed';
import ValidatorAsync from './ValidatorAsync';

export default interface Validator<Badge extends string, $ extends $Base, Data> extends ValidatorDescribed {
  with<T = Something | Promise<Something>>(
    target: T
  ): T extends Promise<infer D> ? ValidatorAsync<Badge, $, D> : T extends boolean ? Validator<Badge, $, boolean> : Validator<Badge, $, T>;

  then<T = Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>(
    task: Provider<Data, T>
  ): T extends Promise<infer D> | ValidatorAsync<Badge, $, infer D>
    ? ValidatorAsync<Badge, $, D>
    : T extends Validator<Badge, $, infer D>
    ? Validator<Badge, $, D>
    : T extends boolean
    ? Validator<Badge, $, boolean>
    : Validator<Badge, $, T>;

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
        ? Validator<Badge, $, D>
        : T extends boolean
        ? Validator<Badge, $, boolean>
        : Validator<Badge, $, T>)
    : never;

  each<T = Something | Promise<Something> | Validator<Badge, $, Something> | ValidatorAsync<Badge, $, Something>>(
    task: Data extends readonly (infer I)[] ? (item: I, index: number, data: Data) => T : never
  ): Data extends readonly any[]
    ? (T extends Promise<infer D> | ValidatorAsync<Badge, $, infer D>
        ? ValidatorAsync<Badge, $, D[]>
        : T extends Validator<Badge, $, infer D>
        ? Validator<Badge, $, D[]>
        : T extends boolean
        ? Validator<Badge, $, boolean[]>
        : Validator<Badge, $, T[]>)
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
  ): Result<Badge, $, Data, T0> extends Promise<infer D0> ? ValidatorAsync<Badge, $, [D0]> : Validator<Badge, $, [Result<Badge, $, Data, T0>]>;
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
  ): Result<Badge, $, Data, T0> extends Promise<infer D0>
    ? ValidatorAsync<Badge, $, [D0, Value<Badge, $, Data, T1>]>
    : Result<Badge, $, Data, T1> extends Promise<infer D1>
    ? ValidatorAsync<Badge, $, [Result<Badge, $, Data, T0>, D1]>
    : Validator<Badge, $, [Result<Badge, $, Data, T0>, Result<Badge, $, Data, T1>]>;
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
  ): Result<Badge, $, Data, T0> extends Promise<infer D0>
    ? ValidatorAsync<Badge, $, [D0, Value<Badge, $, Data, T1>, Value<Badge, $, Data, T2>]>
    : Result<Badge, $, Data, T1> extends Promise<infer D1>
    ? ValidatorAsync<Badge, $, [Result<Badge, $, Data, T0>, D1, Value<Badge, $, Data, T2>]>
    : Result<Badge, $, Data, T2> extends Promise<infer D2>
    ? ValidatorAsync<Badge, $, [Result<Badge, $, Data, T0>, Result<Badge, $, Data, T1>, D2]>
    : Validator<Badge, $, [Result<Badge, $, Data, T0>, Result<Badge, $, Data, T1>, Result<Badge, $, Data, T2>]>;
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
  ): Result<Badge, $, Data, T0> extends Promise<infer D0>
    ? ValidatorAsync<Badge, $, [D0, Value<Badge, $, Data, T1>, Value<Badge, $, Data, T2>, Value<Badge, $, Data, T3>]>
    : Result<Badge, $, Data, T1> extends Promise<infer D1>
    ? ValidatorAsync<Badge, $, [Result<Badge, $, Data, T0>, D1, Value<Badge, $, Data, T2>, Value<Badge, $, Data, T3>]>
    : Result<Badge, $, Data, T2> extends Promise<infer D2>
    ? ValidatorAsync<Badge, $, [Result<Badge, $, Data, T0>, Result<Badge, $, Data, T1>, D2, Value<Badge, $, Data, T3>]>
    : Result<Badge, $, Data, T3> extends Promise<infer D3>
    ? ValidatorAsync<Badge, $, [Result<Badge, $, Data, T0>, Result<Badge, $, Data, T1>, Result<Badge, $, Data, T2>, D3]>
    : Validator<Badge, $, [Result<Badge, $, Data, T0>, Result<Badge, $, Data, T1>, Result<Badge, $, Data, T2>, Result<Badge, $, Data, T3>]>;
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
  ): Result<Badge, $, Data, T0> extends Promise<infer D0>
    ? ValidatorAsync<Badge, $, [D0, Value<Badge, $, Data, T1>, Value<Badge, $, Data, T2>, Value<Badge, $, Data, T3>, Value<Badge, $, Data, T4>]>
    : Result<Badge, $, Data, T1> extends Promise<infer D1>
    ? ValidatorAsync<Badge, $, [Result<Badge, $, Data, T0>, D1, Value<Badge, $, Data, T2>, Value<Badge, $, Data, T3>, Value<Badge, $, Data, T4>]>
    : Result<Badge, $, Data, T2> extends Promise<infer D2>
    ? ValidatorAsync<Badge, $, [Result<Badge, $, Data, T0>, Result<Badge, $, Data, T1>, D2, Value<Badge, $, Data, T3>, Value<Badge, $, Data, T4>]>
    : Result<Badge, $, Data, T3> extends Promise<infer D3>
    ? ValidatorAsync<Badge, $, [Result<Badge, $, Data, T0>, Result<Badge, $, Data, T1>, Result<Badge, $, Data, T2>, D3, Value<Badge, $, Data, T4>]>
    : Result<Badge, $, Data, T4> extends Promise<infer D4>
    ? ValidatorAsync<Badge, $, [Result<Badge, $, Data, T0>, Result<Badge, $, Data, T1>, Result<Badge, $, Data, T2>, Result<Badge, $, Data, T3>, D4]>
    : Validator<
        Badge,
        $,
        [Result<Badge, $, Data, T0>, Result<Badge, $, Data, T1>, Result<Badge, $, Data, T2>, Result<Badge, $, Data, T3>, Result<Badge, $, Data, T4>]
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
  ): Result<Badge, $, Data, T0> extends Promise<infer D0>
    ? ValidatorAsync<
        Badge,
        $,
        [D0, Value<Badge, $, Data, T1>, Value<Badge, $, Data, T2>, Value<Badge, $, Data, T3>, Value<Badge, $, Data, T4>, Value<Badge, $, Data, T5>]
      >
    : Result<Badge, $, Data, T1> extends Promise<infer D1>
    ? ValidatorAsync<
        Badge,
        $,
        [Result<Badge, $, Data, T0>, D1, Value<Badge, $, Data, T2>, Value<Badge, $, Data, T3>, Value<Badge, $, Data, T4>, Value<Badge, $, Data, T5>]
      >
    : Result<Badge, $, Data, T2> extends Promise<infer D2>
    ? ValidatorAsync<
        Badge,
        $,
        [Result<Badge, $, Data, T0>, Result<Badge, $, Data, T1>, D2, Value<Badge, $, Data, T3>, Value<Badge, $, Data, T4>, Value<Badge, $, Data, T5>]
      >
    : Result<Badge, $, Data, T3> extends Promise<infer D3>
    ? ValidatorAsync<
        Badge,
        $,
        [Result<Badge, $, Data, T0>, Result<Badge, $, Data, T1>, Result<Badge, $, Data, T2>, D3, Value<Badge, $, Data, T4>, Value<Badge, $, Data, T5>]
      >
    : Result<Badge, $, Data, T4> extends Promise<infer D4>
    ? ValidatorAsync<
        Badge,
        $,
        [Result<Badge, $, Data, T0>, Result<Badge, $, Data, T1>, Result<Badge, $, Data, T2>, Result<Badge, $, Data, T3>, D4, Value<Badge, $, Data, T5>]
      >
    : Result<Badge, $, Data, T5> extends Promise<infer D5>
    ? ValidatorAsync<
        Badge,
        $,
        [Result<Badge, $, Data, T0>, Result<Badge, $, Data, T1>, Result<Badge, $, Data, T2>, Result<Badge, $, Data, T3>, Result<Badge, $, Data, T4>, D5]
      >
    : Validator<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          Result<Badge, $, Data, T5>
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
  ): Result<Badge, $, Data, T0> extends Promise<infer D0>
    ? ValidatorAsync<
        Badge,
        $,
        [
          D0,
          Value<Badge, $, Data, T1>,
          Value<Badge, $, Data, T2>,
          Value<Badge, $, Data, T3>,
          Value<Badge, $, Data, T4>,
          Value<Badge, $, Data, T5>,
          Value<Badge, $, Data, T6>
        ]
      >
    : Result<Badge, $, Data, T1> extends Promise<infer D1>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          D1,
          Value<Badge, $, Data, T2>,
          Value<Badge, $, Data, T3>,
          Value<Badge, $, Data, T4>,
          Value<Badge, $, Data, T5>,
          Value<Badge, $, Data, T6>
        ]
      >
    : Result<Badge, $, Data, T2> extends Promise<infer D2>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          D2,
          Value<Badge, $, Data, T3>,
          Value<Badge, $, Data, T4>,
          Value<Badge, $, Data, T5>,
          Value<Badge, $, Data, T6>
        ]
      >
    : Result<Badge, $, Data, T3> extends Promise<infer D3>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          D3,
          Value<Badge, $, Data, T4>,
          Value<Badge, $, Data, T5>,
          Value<Badge, $, Data, T6>
        ]
      >
    : Result<Badge, $, Data, T4> extends Promise<infer D4>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          D4,
          Value<Badge, $, Data, T5>,
          Value<Badge, $, Data, T6>
        ]
      >
    : Result<Badge, $, Data, T5> extends Promise<infer D5>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          D5,
          Value<Badge, $, Data, T6>
        ]
      >
    : Result<Badge, $, Data, T6> extends Promise<infer D6>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          Result<Badge, $, Data, T5>,
          D6
        ]
      >
    : Validator<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          Result<Badge, $, Data, T5>,
          Result<Badge, $, Data, T6>
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
  ): Result<Badge, $, Data, T0> extends Promise<infer D0>
    ? ValidatorAsync<
        Badge,
        $,
        [
          D0,
          Value<Badge, $, Data, T1>,
          Value<Badge, $, Data, T2>,
          Value<Badge, $, Data, T3>,
          Value<Badge, $, Data, T4>,
          Value<Badge, $, Data, T5>,
          Value<Badge, $, Data, T6>,
          Value<Badge, $, Data, T7>
        ]
      >
    : Result<Badge, $, Data, T1> extends Promise<infer D1>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          D1,
          Value<Badge, $, Data, T2>,
          Value<Badge, $, Data, T3>,
          Value<Badge, $, Data, T4>,
          Value<Badge, $, Data, T5>,
          Value<Badge, $, Data, T6>,
          Value<Badge, $, Data, T7>
        ]
      >
    : Result<Badge, $, Data, T2> extends Promise<infer D2>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          D2,
          Value<Badge, $, Data, T3>,
          Value<Badge, $, Data, T4>,
          Value<Badge, $, Data, T5>,
          Value<Badge, $, Data, T6>,
          Value<Badge, $, Data, T7>
        ]
      >
    : Result<Badge, $, Data, T3> extends Promise<infer D3>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          D3,
          Value<Badge, $, Data, T4>,
          Value<Badge, $, Data, T5>,
          Value<Badge, $, Data, T6>,
          Value<Badge, $, Data, T7>
        ]
      >
    : Result<Badge, $, Data, T4> extends Promise<infer D4>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          D4,
          Value<Badge, $, Data, T5>,
          Value<Badge, $, Data, T6>,
          Value<Badge, $, Data, T7>
        ]
      >
    : Result<Badge, $, Data, T5> extends Promise<infer D5>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          D5,
          Value<Badge, $, Data, T6>,
          Value<Badge, $, Data, T7>
        ]
      >
    : Result<Badge, $, Data, T6> extends Promise<infer D6>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          Result<Badge, $, Data, T5>,
          D6,
          Value<Badge, $, Data, T7>
        ]
      >
    : Result<Badge, $, Data, T7> extends Promise<infer D7>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          Result<Badge, $, Data, T5>,
          Result<Badge, $, Data, T6>,
          D7
        ]
      >
    : Validator<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          Result<Badge, $, Data, T5>,
          Result<Badge, $, Data, T6>,
          Result<Badge, $, Data, T7>
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
  ): Result<Badge, $, Data, T0> extends Promise<infer D0>
    ? ValidatorAsync<
        Badge,
        $,
        [
          D0,
          Value<Badge, $, Data, T1>,
          Value<Badge, $, Data, T2>,
          Value<Badge, $, Data, T3>,
          Value<Badge, $, Data, T4>,
          Value<Badge, $, Data, T5>,
          Value<Badge, $, Data, T6>,
          Value<Badge, $, Data, T7>,
          Value<Badge, $, Data, T8>
        ]
      >
    : Result<Badge, $, Data, T1> extends Promise<infer D1>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          D1,
          Value<Badge, $, Data, T2>,
          Value<Badge, $, Data, T3>,
          Value<Badge, $, Data, T4>,
          Value<Badge, $, Data, T5>,
          Value<Badge, $, Data, T6>,
          Value<Badge, $, Data, T7>,
          Value<Badge, $, Data, T8>
        ]
      >
    : Result<Badge, $, Data, T2> extends Promise<infer D2>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          D2,
          Value<Badge, $, Data, T3>,
          Value<Badge, $, Data, T4>,
          Value<Badge, $, Data, T5>,
          Value<Badge, $, Data, T6>,
          Value<Badge, $, Data, T7>,
          Value<Badge, $, Data, T8>
        ]
      >
    : Result<Badge, $, Data, T3> extends Promise<infer D3>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          D3,
          Value<Badge, $, Data, T4>,
          Value<Badge, $, Data, T5>,
          Value<Badge, $, Data, T6>,
          Value<Badge, $, Data, T7>,
          Value<Badge, $, Data, T8>
        ]
      >
    : Result<Badge, $, Data, T4> extends Promise<infer D4>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          D4,
          Value<Badge, $, Data, T5>,
          Value<Badge, $, Data, T6>,
          Value<Badge, $, Data, T7>,
          Value<Badge, $, Data, T8>
        ]
      >
    : Result<Badge, $, Data, T5> extends Promise<infer D5>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          D5,
          Value<Badge, $, Data, T6>,
          Value<Badge, $, Data, T7>,
          Value<Badge, $, Data, T8>
        ]
      >
    : Result<Badge, $, Data, T6> extends Promise<infer D6>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          Result<Badge, $, Data, T5>,
          D6,
          Value<Badge, $, Data, T7>,
          Value<Badge, $, Data, T8>
        ]
      >
    : Result<Badge, $, Data, T7> extends Promise<infer D7>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          Result<Badge, $, Data, T5>,
          Result<Badge, $, Data, T6>,
          D7,
          Value<Badge, $, Data, T8>
        ]
      >
    : Result<Badge, $, Data, T8> extends Promise<infer D8>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          Result<Badge, $, Data, T5>,
          Result<Badge, $, Data, T6>,
          Result<Badge, $, Data, T7>,
          D8
        ]
      >
    : Validator<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          Result<Badge, $, Data, T5>,
          Result<Badge, $, Data, T6>,
          Result<Badge, $, Data, T7>,
          Result<Badge, $, Data, T8>
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
  ): Result<Badge, $, Data, T0> extends Promise<infer D0>
    ? ValidatorAsync<
        Badge,
        $,
        [
          D0,
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
      >
    : Result<Badge, $, Data, T1> extends Promise<infer D1>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          D1,
          Value<Badge, $, Data, T2>,
          Value<Badge, $, Data, T3>,
          Value<Badge, $, Data, T4>,
          Value<Badge, $, Data, T5>,
          Value<Badge, $, Data, T6>,
          Value<Badge, $, Data, T7>,
          Value<Badge, $, Data, T8>,
          Value<Badge, $, Data, T9>
        ]
      >
    : Result<Badge, $, Data, T2> extends Promise<infer D2>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          D2,
          Value<Badge, $, Data, T3>,
          Value<Badge, $, Data, T4>,
          Value<Badge, $, Data, T5>,
          Value<Badge, $, Data, T6>,
          Value<Badge, $, Data, T7>,
          Value<Badge, $, Data, T8>,
          Value<Badge, $, Data, T9>
        ]
      >
    : Result<Badge, $, Data, T3> extends Promise<infer D3>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          D3,
          Value<Badge, $, Data, T4>,
          Value<Badge, $, Data, T5>,
          Value<Badge, $, Data, T6>,
          Value<Badge, $, Data, T7>,
          Value<Badge, $, Data, T8>,
          Value<Badge, $, Data, T9>
        ]
      >
    : Result<Badge, $, Data, T4> extends Promise<infer D4>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          D4,
          Value<Badge, $, Data, T5>,
          Value<Badge, $, Data, T6>,
          Value<Badge, $, Data, T7>,
          Value<Badge, $, Data, T8>,
          Value<Badge, $, Data, T9>
        ]
      >
    : Result<Badge, $, Data, T5> extends Promise<infer D5>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          D5,
          Value<Badge, $, Data, T6>,
          Value<Badge, $, Data, T7>,
          Value<Badge, $, Data, T8>,
          Value<Badge, $, Data, T9>
        ]
      >
    : Result<Badge, $, Data, T6> extends Promise<infer D6>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          Result<Badge, $, Data, T5>,
          D6,
          Value<Badge, $, Data, T7>,
          Value<Badge, $, Data, T8>,
          Value<Badge, $, Data, T9>
        ]
      >
    : Result<Badge, $, Data, T7> extends Promise<infer D7>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          Result<Badge, $, Data, T5>,
          Result<Badge, $, Data, T6>,
          D7,
          Value<Badge, $, Data, T8>,
          Value<Badge, $, Data, T9>
        ]
      >
    : Result<Badge, $, Data, T8> extends Promise<infer D8>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          Result<Badge, $, Data, T5>,
          Result<Badge, $, Data, T6>,
          Result<Badge, $, Data, T7>,
          D8,
          Value<Badge, $, Data, T9>
        ]
      >
    : Result<Badge, $, Data, T9> extends Promise<infer D9>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          Result<Badge, $, Data, T5>,
          Result<Badge, $, Data, T6>,
          Result<Badge, $, Data, T7>,
          Result<Badge, $, Data, T8>,
          D9
        ]
      >
    : Validator<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          Result<Badge, $, Data, T5>,
          Result<Badge, $, Data, T6>,
          Result<Badge, $, Data, T7>,
          Result<Badge, $, Data, T8>,
          Result<Badge, $, Data, T9>
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
  ): Result<Badge, $, Data, T0> extends Promise<infer D0>
    ? ValidatorAsync<
        Badge,
        $,
        [
          D0,
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
      >
    : Result<Badge, $, Data, T1> extends Promise<infer D1>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          D1,
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
      >
    : Result<Badge, $, Data, T2> extends Promise<infer D2>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          D2,
          Value<Badge, $, Data, T3>,
          Value<Badge, $, Data, T4>,
          Value<Badge, $, Data, T5>,
          Value<Badge, $, Data, T6>,
          Value<Badge, $, Data, T7>,
          Value<Badge, $, Data, T8>,
          Value<Badge, $, Data, T9>,
          ...Value<Badge, $, Data, T>[]
        ]
      >
    : Result<Badge, $, Data, T3> extends Promise<infer D3>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          D3,
          Value<Badge, $, Data, T4>,
          Value<Badge, $, Data, T5>,
          Value<Badge, $, Data, T6>,
          Value<Badge, $, Data, T7>,
          Value<Badge, $, Data, T8>,
          Value<Badge, $, Data, T9>,
          ...Value<Badge, $, Data, T>[]
        ]
      >
    : Result<Badge, $, Data, T4> extends Promise<infer D4>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          D4,
          Value<Badge, $, Data, T5>,
          Value<Badge, $, Data, T6>,
          Value<Badge, $, Data, T7>,
          Value<Badge, $, Data, T8>,
          Value<Badge, $, Data, T9>,
          ...Value<Badge, $, Data, T>[]
        ]
      >
    : Result<Badge, $, Data, T5> extends Promise<infer D5>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          D5,
          Value<Badge, $, Data, T6>,
          Value<Badge, $, Data, T7>,
          Value<Badge, $, Data, T8>,
          Value<Badge, $, Data, T9>,
          ...Value<Badge, $, Data, T>[]
        ]
      >
    : Result<Badge, $, Data, T6> extends Promise<infer D6>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          Result<Badge, $, Data, T5>,
          D6,
          Value<Badge, $, Data, T7>,
          Value<Badge, $, Data, T8>,
          Value<Badge, $, Data, T9>,
          ...Value<Badge, $, Data, T>[]
        ]
      >
    : Result<Badge, $, Data, T7> extends Promise<infer D7>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          Result<Badge, $, Data, T5>,
          Result<Badge, $, Data, T6>,
          D7,
          Value<Badge, $, Data, T8>,
          Value<Badge, $, Data, T9>,
          ...Value<Badge, $, Data, T>[]
        ]
      >
    : Result<Badge, $, Data, T8> extends Promise<infer D8>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          Result<Badge, $, Data, T5>,
          Result<Badge, $, Data, T6>,
          Result<Badge, $, Data, T7>,
          D8,
          Value<Badge, $, Data, T9>,
          ...Value<Badge, $, Data, T>[]
        ]
      >
    : Result<Badge, $, Data, T9> extends Promise<infer D9>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          Result<Badge, $, Data, T5>,
          Result<Badge, $, Data, T6>,
          Result<Badge, $, Data, T7>,
          Result<Badge, $, Data, T8>,
          D9,
          ...Value<Badge, $, Data, T>[]
        ]
      >
    : Result<Badge, $, Data, T> extends Promise<infer D>
    ? ValidatorAsync<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          Result<Badge, $, Data, T5>,
          Result<Badge, $, Data, T6>,
          Result<Badge, $, Data, T7>,
          Result<Badge, $, Data, T8>,
          Result<Badge, $, Data, T9>,
          ...D[]
        ]
      >
    : Validator<
        Badge,
        $,
        [
          Result<Badge, $, Data, T0>,
          Result<Badge, $, Data, T1>,
          Result<Badge, $, Data, T2>,
          Result<Badge, $, Data, T3>,
          Result<Badge, $, Data, T4>,
          Result<Badge, $, Data, T5>,
          Result<Badge, $, Data, T6>,
          Result<Badge, $, Data, T7>,
          Result<Badge, $, Data, T8>,
          Result<Badge, $, Data, T9>,
          ...Result<Badge, $, Data, T>[]
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
  ): Result<Badge, $, Data, T> extends Promise<infer D> ? ValidatorAsync<Badge, $, D[]> : Validator<Badge, $, Result<Badge, $, Data, T>[]>;

  object<T = Something | Promise<Something>>(
    target: T
  ): T extends Promise<infer D> ? ValidatorAsync<Badge, $, D> : T extends boolean ? Validator<Badge, $, boolean> : Validator<Badge, $, T>;

  array<T = Something | Promise<Something>>(
    target: T
  ): T extends Promise<infer D> ? ValidatorAsync<Badge, $, D> : T extends boolean ? Validator<Badge, $, boolean> : Validator<Badge, $, T>;

  check(badge: Badge, validity: boolean | Provider<Data, boolean>, message?: string | Provider<Data, string>): Validator<Badge, $, Data>;

  when(...badges: Badge[]): Validator<Badge, $, Data>;

  must(...conditions: (boolean | Provider<Data, boolean>)[]): Validator<Badge, $, Data>;

  if(...conditions: (boolean | Provider<Data, boolean>)[]): Validator<Badge, $, Data>;

  earn(badge: Badge): Validator<Badge, $, Data>;

  fail(badge: Badge, message?: string | Provider<Data, string>): Validator<Badge, $, Data>;

  set: Data extends undefined ? (() => never) : (($path: Data) => Validator<Badge, $, Data>);

  put<T = Something, U = T | Promise<T>>(
    $path: T,
    value: U | Provider<Data, U>
  ): U extends Promise<infer T> ? ValidatorAsync<Badge, $, T> : U extends boolean ? Validator<Badge, $, boolean> : Validator<Badge, $, U>;

  get<T = Something>($path: T): Validator<Badge, $, T>;

  use<T = Something, U = Something | Promise<Something>>(
    $path: T,
    task: Data extends undefined ? ((value: T) => U) : ((value: T, data: Data) => U)
  ): U extends Promise<infer D> ? ValidatorAsync<Badge, $, D> : U extends boolean ? Validator<Badge, $, boolean> : Validator<Badge, $, U>;

  /**
   * TODO
   */
  readonly value: Data;
}
