import { $Base } from './general';

export default interface IValidator<Badge extends string, $ extends $Base, Data> {
  with<T>(target: T | PromiseLike<T> | IValidator<Badge, $, T>): IValidator<Badge, $, T>;
  object<T = Data>(target?: T | PromiseLike<T> | IValidator<Badge, $, T>): IValidator<Badge, $, T>;
  array<T = Data>(target?: T | PromiseLike<T> | IValidator<Badge, $, T>): IValidator<Badge, $, T>;
  then<T>(task: (data: Data) => T | PromiseLike<T> | IValidator<Badge, $, T>): IValidator<Badge, $, T>;
  do<T>(
    task: Data extends []
      ? () => T | PromiseLike<T> | IValidator<Badge, $, T>
      : Data extends [(infer D0)]
      ? (d0: D0) => T | PromiseLike<T> | IValidator<Badge, $, T>
      : Data extends [(infer D0), (infer D1)]
      ? (d0: D0, d1: D1) => T | PromiseLike<T> | IValidator<Badge, $, T>
      : Data extends [(infer D0), (infer D1), (infer D2)]
      ? (d0: D0, d1: D1, d2: D2) => T | PromiseLike<T> | IValidator<Badge, $, T>
      : Data extends [(infer D0), (infer D1), (infer D2), (infer D3)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3) => T | PromiseLike<T> | IValidator<Badge, $, T>
      : Data extends [(infer D0), (infer D1), (infer D2), (infer D3), (infer D4)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4) => T | PromiseLike<T> | IValidator<Badge, $, T>
      : Data extends [(infer D0), (infer D1), (infer D2), (infer D3), (infer D4), (infer D5)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => T | PromiseLike<T> | IValidator<Badge, $, T>
      : Data extends [(infer D0), (infer D1), (infer D2), (infer D3), (infer D4), (infer D5), (infer D6)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => T | PromiseLike<T> | IValidator<Badge, $, T>
      : Data extends [(infer D0), (infer D1), (infer D2), (infer D3), (infer D4), (infer D5), (infer D6), (infer D7)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => T | PromiseLike<T> | IValidator<Badge, $, T>
      : Data extends [(infer D0), (infer D1), (infer D2), (infer D3), (infer D4), (infer D5), (infer D6), (infer D7), (infer D8)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => T | PromiseLike<T> | IValidator<Badge, $, T>
      : Data extends [(infer D0), (infer D1), (infer D2), (infer D3), (infer D4), (infer D5), (infer D6), (infer D7), (infer D8), (infer D9)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => T | PromiseLike<T> | IValidator<Badge, $, T>
      : never
  ): IValidator<Badge, $, T>;
  each<T>(task: Data extends readonly (infer I)[] ? (item: I, index: number) => T : never): IValidator<Badge, $, readonly T[]>;
  after<T0>(
    target0: T0 | PromiseLike<T0> | IValidator<Badge, $, T0> | ((data: Data) => T0 | PromiseLike<T0> | IValidator<Badge, $, T0>)
  ): IValidator<Badge, $, [T0]>;
  after<T0, T1>(
    target0: T0 | PromiseLike<T0> | IValidator<Badge, $, T0> | ((data: Data) => T0 | PromiseLike<T0> | IValidator<Badge, $, T0>),
    target1: T1 | PromiseLike<T1> | IValidator<Badge, $, T1> | ((data: Data) => T1 | PromiseLike<T1> | IValidator<Badge, $, T1>)
  ): IValidator<Badge, $, [T0, T1]>;
  after<T0, T1, T2>(
    target0: T0 | PromiseLike<T0> | IValidator<Badge, $, T0> | ((data: Data) => T0 | PromiseLike<T0> | IValidator<Badge, $, T0>),
    target1: T1 | PromiseLike<T1> | IValidator<Badge, $, T1> | ((data: Data) => T1 | PromiseLike<T1> | IValidator<Badge, $, T1>),
    target2: T2 | PromiseLike<T2> | IValidator<Badge, $, T2> | ((data: Data) => T2 | PromiseLike<T2> | IValidator<Badge, $, T2>)
  ): IValidator<Badge, $, [T0, T1, T2]>;
  after<T0, T1, T2, T3>(
    target0: T0 | PromiseLike<T0> | IValidator<Badge, $, T0> | ((data: Data) => T0 | PromiseLike<T0> | IValidator<Badge, $, T0>),
    target1: T1 | PromiseLike<T1> | IValidator<Badge, $, T1> | ((data: Data) => T1 | PromiseLike<T1> | IValidator<Badge, $, T1>),
    target2: T2 | PromiseLike<T2> | IValidator<Badge, $, T2> | ((data: Data) => T2 | PromiseLike<T2> | IValidator<Badge, $, T2>),
    target3: T3 | PromiseLike<T3> | IValidator<Badge, $, T3> | ((data: Data) => T3 | PromiseLike<T3> | IValidator<Badge, $, T3>)
  ): IValidator<Badge, $, [T0, T1, T2, T3]>;
  after<T0, T1, T2, T3, T4>(
    target0: T0 | PromiseLike<T0> | IValidator<Badge, $, T0> | ((data: Data) => T0 | PromiseLike<T0> | IValidator<Badge, $, T0>),
    target1: T1 | PromiseLike<T1> | IValidator<Badge, $, T1> | ((data: Data) => T1 | PromiseLike<T1> | IValidator<Badge, $, T1>),
    target2: T2 | PromiseLike<T2> | IValidator<Badge, $, T2> | ((data: Data) => T2 | PromiseLike<T2> | IValidator<Badge, $, T2>),
    target3: T3 | PromiseLike<T3> | IValidator<Badge, $, T3> | ((data: Data) => T3 | PromiseLike<T3> | IValidator<Badge, $, T3>),
    target4: T4 | PromiseLike<T4> | IValidator<Badge, $, T4> | ((data: Data) => T4 | PromiseLike<T4> | IValidator<Badge, $, T4>)
  ): IValidator<Badge, $, [T0, T1, T2, T3, T4]>;
  after<T0, T1, T2, T3, T4, T5>(
    target0: T0 | PromiseLike<T0> | IValidator<Badge, $, T0> | ((data: Data) => T0 | PromiseLike<T0> | IValidator<Badge, $, T0>),
    target1: T1 | PromiseLike<T1> | IValidator<Badge, $, T1> | ((data: Data) => T1 | PromiseLike<T1> | IValidator<Badge, $, T1>),
    target2: T2 | PromiseLike<T2> | IValidator<Badge, $, T2> | ((data: Data) => T2 | PromiseLike<T2> | IValidator<Badge, $, T2>),
    target3: T3 | PromiseLike<T3> | IValidator<Badge, $, T3> | ((data: Data) => T3 | PromiseLike<T3> | IValidator<Badge, $, T3>),
    target4: T4 | PromiseLike<T4> | IValidator<Badge, $, T4> | ((data: Data) => T4 | PromiseLike<T4> | IValidator<Badge, $, T4>),
    target5: T5 | PromiseLike<T5> | IValidator<Badge, $, T5> | ((data: Data) => T5 | PromiseLike<T5> | IValidator<Badge, $, T5>)
  ): IValidator<Badge, $, [T0, T1, T2, T3, T4, T5]>;
  after<T0, T1, T2, T3, T4, T5, T6>(
    target0: T0 | PromiseLike<T0> | IValidator<Badge, $, T0> | ((data: Data) => T0 | PromiseLike<T0> | IValidator<Badge, $, T0>),
    target1: T1 | PromiseLike<T1> | IValidator<Badge, $, T1> | ((data: Data) => T1 | PromiseLike<T1> | IValidator<Badge, $, T1>),
    target2: T2 | PromiseLike<T2> | IValidator<Badge, $, T2> | ((data: Data) => T2 | PromiseLike<T2> | IValidator<Badge, $, T2>),
    target3: T3 | PromiseLike<T3> | IValidator<Badge, $, T3> | ((data: Data) => T3 | PromiseLike<T3> | IValidator<Badge, $, T3>),
    target4: T4 | PromiseLike<T4> | IValidator<Badge, $, T4> | ((data: Data) => T4 | PromiseLike<T4> | IValidator<Badge, $, T4>),
    target5: T5 | PromiseLike<T5> | IValidator<Badge, $, T5> | ((data: Data) => T5 | PromiseLike<T5> | IValidator<Badge, $, T5>),
    target6: T6 | PromiseLike<T6> | IValidator<Badge, $, T6> | ((data: Data) => T6 | PromiseLike<T6> | IValidator<Badge, $, T6>)
  ): IValidator<Badge, $, [T0, T1, T2, T3, T4, T5, T6]>;
  after<T0, T1, T2, T3, T4, T5, T6, T7>(
    target0: T0 | PromiseLike<T0> | IValidator<Badge, $, T0> | ((data: Data) => T0 | PromiseLike<T0> | IValidator<Badge, $, T0>),
    target1: T1 | PromiseLike<T1> | IValidator<Badge, $, T1> | ((data: Data) => T1 | PromiseLike<T1> | IValidator<Badge, $, T1>),
    target2: T2 | PromiseLike<T2> | IValidator<Badge, $, T2> | ((data: Data) => T2 | PromiseLike<T2> | IValidator<Badge, $, T2>),
    target3: T3 | PromiseLike<T3> | IValidator<Badge, $, T3> | ((data: Data) => T3 | PromiseLike<T3> | IValidator<Badge, $, T3>),
    target4: T4 | PromiseLike<T4> | IValidator<Badge, $, T4> | ((data: Data) => T4 | PromiseLike<T4> | IValidator<Badge, $, T4>),
    target5: T5 | PromiseLike<T5> | IValidator<Badge, $, T5> | ((data: Data) => T5 | PromiseLike<T5> | IValidator<Badge, $, T5>),
    target6: T6 | PromiseLike<T6> | IValidator<Badge, $, T6> | ((data: Data) => T6 | PromiseLike<T6> | IValidator<Badge, $, T6>),
    target7: T7 | PromiseLike<T7> | IValidator<Badge, $, T7> | ((data: Data) => T7 | PromiseLike<T7> | IValidator<Badge, $, T7>)
  ): IValidator<Badge, $, [T0, T1, T2, T3, T4, T5, T6, T7]>;
  after<T0, T1, T2, T3, T4, T5, T6, T7, T8>(
    target0: T0 | PromiseLike<T0> | IValidator<Badge, $, T0> | ((data: Data) => T0 | PromiseLike<T0> | IValidator<Badge, $, T0>),
    target1: T1 | PromiseLike<T1> | IValidator<Badge, $, T1> | ((data: Data) => T1 | PromiseLike<T1> | IValidator<Badge, $, T1>),
    target2: T2 | PromiseLike<T2> | IValidator<Badge, $, T2> | ((data: Data) => T2 | PromiseLike<T2> | IValidator<Badge, $, T2>),
    target3: T3 | PromiseLike<T3> | IValidator<Badge, $, T3> | ((data: Data) => T3 | PromiseLike<T3> | IValidator<Badge, $, T3>),
    target4: T4 | PromiseLike<T4> | IValidator<Badge, $, T4> | ((data: Data) => T4 | PromiseLike<T4> | IValidator<Badge, $, T4>),
    target5: T5 | PromiseLike<T5> | IValidator<Badge, $, T5> | ((data: Data) => T5 | PromiseLike<T5> | IValidator<Badge, $, T5>),
    target6: T6 | PromiseLike<T6> | IValidator<Badge, $, T6> | ((data: Data) => T6 | PromiseLike<T6> | IValidator<Badge, $, T6>),
    target7: T7 | PromiseLike<T7> | IValidator<Badge, $, T7> | ((data: Data) => T7 | PromiseLike<T7> | IValidator<Badge, $, T7>),
    target8: T8 | PromiseLike<T8> | IValidator<Badge, $, T8> | ((data: Data) => T8 | PromiseLike<T8> | IValidator<Badge, $, T8>)
  ): IValidator<Badge, $, [T0, T1, T2, T3, T4, T5, T6, T7, T8]>;
  after<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    target0: T0 | PromiseLike<T0> | IValidator<Badge, $, T0> | ((data: Data) => T0 | PromiseLike<T0> | IValidator<Badge, $, T0>),
    target1: T1 | PromiseLike<T1> | IValidator<Badge, $, T1> | ((data: Data) => T1 | PromiseLike<T1> | IValidator<Badge, $, T1>),
    target2: T2 | PromiseLike<T2> | IValidator<Badge, $, T2> | ((data: Data) => T2 | PromiseLike<T2> | IValidator<Badge, $, T2>),
    target3: T3 | PromiseLike<T3> | IValidator<Badge, $, T3> | ((data: Data) => T3 | PromiseLike<T3> | IValidator<Badge, $, T3>),
    target4: T4 | PromiseLike<T4> | IValidator<Badge, $, T4> | ((data: Data) => T4 | PromiseLike<T4> | IValidator<Badge, $, T4>),
    target5: T5 | PromiseLike<T5> | IValidator<Badge, $, T5> | ((data: Data) => T5 | PromiseLike<T5> | IValidator<Badge, $, T5>),
    target6: T6 | PromiseLike<T6> | IValidator<Badge, $, T6> | ((data: Data) => T6 | PromiseLike<T6> | IValidator<Badge, $, T6>),
    target7: T7 | PromiseLike<T7> | IValidator<Badge, $, T7> | ((data: Data) => T7 | PromiseLike<T7> | IValidator<Badge, $, T7>),
    target8: T8 | PromiseLike<T8> | IValidator<Badge, $, T8> | ((data: Data) => T8 | PromiseLike<T8> | IValidator<Badge, $, T8>),
    target9: T9 | PromiseLike<T9> | IValidator<Badge, $, T9> | ((data: Data) => T9 | PromiseLike<T9> | IValidator<Badge, $, T9>)
  ): IValidator<Badge, $, [T0, T1, T2, T3, T4, T5, T6, T7, T8, T9]>;

  check(badge: Badge, validity: boolean | ((data: Data) => boolean), message?: string | ((data: Data) => string)): IValidator<Badge, $, Data>;
  earn(badge: Badge): IValidator<Badge, $, Data>;
  fail(badge: Badge, message?: string | ((data: Data) => string)): IValidator<Badge, $, Data>;
  when(...badges: Badge[]): IValidator<Badge, $, Data>;
  must(...conditions: (boolean | ((data: Data) => boolean))[]): IValidator<Badge, $, Data>;
  if(...conditions: (boolean | ((data: Data) => boolean))[]): IValidator<Badge, $, Data>;

  $: $;
}
