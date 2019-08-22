import { $Base } from './$';
import Validator from './Validator';

export default interface ValidatorChain<Badge extends string, $ extends $Base, Data> {
  with<T>(target: T | Promise<T>): ValidatorChain<Badge, $, T>;
  then<T>(task: (data: Data) => T | Promise<T> | Validator<Badge, $, T>): ValidatorChain<Badge, $, T>;
  do<T>(
    task: Data extends readonly []
      ? () => T | Promise<T> | Validator<Badge, $, T>
      : Data extends readonly [(infer D0)]
      ? (d0: D0) => T | Promise<T> | Validator<Badge, $, T>
      : Data extends readonly [(infer D0), (infer D1)]
      ? (d0: D0, d1: D1) => T | Promise<T> | Validator<Badge, $, T>
      : Data extends readonly [(infer D0), (infer D1), (infer D2)]
      ? (d0: D0, d1: D1, d2: D2) => T | Promise<T> | Validator<Badge, $, T>
      : Data extends readonly [(infer D0), (infer D1), (infer D2), (infer D3)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3) => T | Promise<T> | Validator<Badge, $, T>
      : Data extends readonly [(infer D0), (infer D1), (infer D2), (infer D3), (infer D4)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4) => T | Promise<T> | Validator<Badge, $, T>
      : Data extends readonly [(infer D0), (infer D1), (infer D2), (infer D3), (infer D4), (infer D5)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => T | Promise<T> | Validator<Badge, $, T>
      : Data extends readonly [(infer D0), (infer D1), (infer D2), (infer D3), (infer D4), (infer D5), (infer D6)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => T | Promise<T> | Validator<Badge, $, T>
      : Data extends readonly [(infer D0), (infer D1), (infer D2), (infer D3), (infer D4), (infer D5), (infer D6), (infer D7)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => T | Promise<T> | Validator<Badge, $, T>
      : Data extends readonly [(infer D0), (infer D1), (infer D2), (infer D3), (infer D4), (infer D5), (infer D6), (infer D7), (infer D8)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => T | Promise<T> | Validator<Badge, $, T>
      : Data extends readonly [(infer D0), (infer D1), (infer D2), (infer D3), (infer D4), (infer D5), (infer D6), (infer D7), (infer D8), (infer D9)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => T | Promise<T> | Validator<Badge, $, T>
      : never
  ): ValidatorChain<Badge, $, T>;
  each<T>(task: Data extends readonly (infer I)[] ? (item: I, index: number) => T | Promise<T> | Validator<Badge, $, T> : never): ValidatorChain<Badge, $, T[]>;
  after<T0>(target0: T0 | Promise<T0> | Validator<Badge, $, T0> | ((data: Data) => T0 | Promise<T0> | Validator<Badge, $, T0>)): ValidatorChain<Badge, $, [T0]>;
  after<T0, T1>(
    target0: T0 | Promise<T0> | Validator<Badge, $, T0> | ((data: Data) => T0 | Promise<T0> | Validator<Badge, $, T0>),
    target1: T1 | Promise<T1> | Validator<Badge, $, T1> | ((data: Data) => T1 | Promise<T1> | Validator<Badge, $, T1>)
  ): ValidatorChain<Badge, $, [T0, T1]>;
  after<T0, T1, T2>(
    target0: T0 | Promise<T0> | Validator<Badge, $, T0> | ((data: Data) => T0 | Promise<T0> | Validator<Badge, $, T0>),
    target1: T1 | Promise<T1> | Validator<Badge, $, T1> | ((data: Data) => T1 | Promise<T1> | Validator<Badge, $, T1>),
    target2: T2 | Promise<T2> | Validator<Badge, $, T2> | ((data: Data) => T2 | Promise<T2> | Validator<Badge, $, T2>)
  ): ValidatorChain<Badge, $, [T0, T1, T2]>;
  after<T0, T1, T2, T3>(
    target0: T0 | Promise<T0> | Validator<Badge, $, T0> | ((data: Data) => T0 | Promise<T0> | Validator<Badge, $, T0>),
    target1: T1 | Promise<T1> | Validator<Badge, $, T1> | ((data: Data) => T1 | Promise<T1> | Validator<Badge, $, T1>),
    target2: T2 | Promise<T2> | Validator<Badge, $, T2> | ((data: Data) => T2 | Promise<T2> | Validator<Badge, $, T2>),
    target3: T3 | Promise<T3> | Validator<Badge, $, T3> | ((data: Data) => T3 | Promise<T3> | Validator<Badge, $, T3>)
  ): ValidatorChain<Badge, $, [T0, T1, T2, T3]>;
  after<T0, T1, T2, T3, T4>(
    target0: T0 | Promise<T0> | Validator<Badge, $, T0> | ((data: Data) => T0 | Promise<T0> | Validator<Badge, $, T0>),
    target1: T1 | Promise<T1> | Validator<Badge, $, T1> | ((data: Data) => T1 | Promise<T1> | Validator<Badge, $, T1>),
    target2: T2 | Promise<T2> | Validator<Badge, $, T2> | ((data: Data) => T2 | Promise<T2> | Validator<Badge, $, T2>),
    target3: T3 | Promise<T3> | Validator<Badge, $, T3> | ((data: Data) => T3 | Promise<T3> | Validator<Badge, $, T3>),
    target4: T4 | Promise<T4> | Validator<Badge, $, T4> | ((data: Data) => T4 | Promise<T4> | Validator<Badge, $, T4>)
  ): ValidatorChain<Badge, $, [T0, T1, T2, T3, T4]>;
  after<T0, T1, T2, T3, T4, T5>(
    target0: T0 | Promise<T0> | Validator<Badge, $, T0> | ((data: Data) => T0 | Promise<T0> | Validator<Badge, $, T0>),
    target1: T1 | Promise<T1> | Validator<Badge, $, T1> | ((data: Data) => T1 | Promise<T1> | Validator<Badge, $, T1>),
    target2: T2 | Promise<T2> | Validator<Badge, $, T2> | ((data: Data) => T2 | Promise<T2> | Validator<Badge, $, T2>),
    target3: T3 | Promise<T3> | Validator<Badge, $, T3> | ((data: Data) => T3 | Promise<T3> | Validator<Badge, $, T3>),
    target4: T4 | Promise<T4> | Validator<Badge, $, T4> | ((data: Data) => T4 | Promise<T4> | Validator<Badge, $, T4>),
    target5: T5 | Promise<T5> | Validator<Badge, $, T5> | ((data: Data) => T5 | Promise<T5> | Validator<Badge, $, T5>)
  ): ValidatorChain<Badge, $, [T0, T1, T2, T3, T4, T5]>;
  after<T0, T1, T2, T3, T4, T5, T6>(
    target0: T0 | Promise<T0> | Validator<Badge, $, T0> | ((data: Data) => T0 | Promise<T0> | Validator<Badge, $, T0>),
    target1: T1 | Promise<T1> | Validator<Badge, $, T1> | ((data: Data) => T1 | Promise<T1> | Validator<Badge, $, T1>),
    target2: T2 | Promise<T2> | Validator<Badge, $, T2> | ((data: Data) => T2 | Promise<T2> | Validator<Badge, $, T2>),
    target3: T3 | Promise<T3> | Validator<Badge, $, T3> | ((data: Data) => T3 | Promise<T3> | Validator<Badge, $, T3>),
    target4: T4 | Promise<T4> | Validator<Badge, $, T4> | ((data: Data) => T4 | Promise<T4> | Validator<Badge, $, T4>),
    target5: T5 | Promise<T5> | Validator<Badge, $, T5> | ((data: Data) => T5 | Promise<T5> | Validator<Badge, $, T5>),
    target6: T6 | Promise<T6> | Validator<Badge, $, T6> | ((data: Data) => T6 | Promise<T6> | Validator<Badge, $, T6>)
  ): ValidatorChain<Badge, $, [T0, T1, T2, T3, T4, T5, T6]>;
  after<T0, T1, T2, T3, T4, T5, T6, T7>(
    target0: T0 | Promise<T0> | Validator<Badge, $, T0> | ((data: Data) => T0 | Promise<T0> | Validator<Badge, $, T0>),
    target1: T1 | Promise<T1> | Validator<Badge, $, T1> | ((data: Data) => T1 | Promise<T1> | Validator<Badge, $, T1>),
    target2: T2 | Promise<T2> | Validator<Badge, $, T2> | ((data: Data) => T2 | Promise<T2> | Validator<Badge, $, T2>),
    target3: T3 | Promise<T3> | Validator<Badge, $, T3> | ((data: Data) => T3 | Promise<T3> | Validator<Badge, $, T3>),
    target4: T4 | Promise<T4> | Validator<Badge, $, T4> | ((data: Data) => T4 | Promise<T4> | Validator<Badge, $, T4>),
    target5: T5 | Promise<T5> | Validator<Badge, $, T5> | ((data: Data) => T5 | Promise<T5> | Validator<Badge, $, T5>),
    target6: T6 | Promise<T6> | Validator<Badge, $, T6> | ((data: Data) => T6 | Promise<T6> | Validator<Badge, $, T6>),
    target7: T7 | Promise<T7> | Validator<Badge, $, T7> | ((data: Data) => T7 | Promise<T7> | Validator<Badge, $, T7>)
  ): ValidatorChain<Badge, $, [T0, T1, T2, T3, T4, T5, T6, T7]>;
  after<T0, T1, T2, T3, T4, T5, T6, T7, T8>(
    target0: T0 | Promise<T0> | Validator<Badge, $, T0> | ((data: Data) => T0 | Promise<T0> | Validator<Badge, $, T0>),
    target1: T1 | Promise<T1> | Validator<Badge, $, T1> | ((data: Data) => T1 | Promise<T1> | Validator<Badge, $, T1>),
    target2: T2 | Promise<T2> | Validator<Badge, $, T2> | ((data: Data) => T2 | Promise<T2> | Validator<Badge, $, T2>),
    target3: T3 | Promise<T3> | Validator<Badge, $, T3> | ((data: Data) => T3 | Promise<T3> | Validator<Badge, $, T3>),
    target4: T4 | Promise<T4> | Validator<Badge, $, T4> | ((data: Data) => T4 | Promise<T4> | Validator<Badge, $, T4>),
    target5: T5 | Promise<T5> | Validator<Badge, $, T5> | ((data: Data) => T5 | Promise<T5> | Validator<Badge, $, T5>),
    target6: T6 | Promise<T6> | Validator<Badge, $, T6> | ((data: Data) => T6 | Promise<T6> | Validator<Badge, $, T6>),
    target7: T7 | Promise<T7> | Validator<Badge, $, T7> | ((data: Data) => T7 | Promise<T7> | Validator<Badge, $, T7>),
    target8: T8 | Promise<T8> | Validator<Badge, $, T8> | ((data: Data) => T8 | Promise<T8> | Validator<Badge, $, T8>)
  ): ValidatorChain<Badge, $, [T0, T1, T2, T3, T4, T5, T6, T7, T8]>;
  after<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    target0: T0 | Promise<T0> | Validator<Badge, $, T0> | ((data: Data) => T0 | Promise<T0> | Validator<Badge, $, T0>),
    target1: T1 | Promise<T1> | Validator<Badge, $, T1> | ((data: Data) => T1 | Promise<T1> | Validator<Badge, $, T1>),
    target2: T2 | Promise<T2> | Validator<Badge, $, T2> | ((data: Data) => T2 | Promise<T2> | Validator<Badge, $, T2>),
    target3: T3 | Promise<T3> | Validator<Badge, $, T3> | ((data: Data) => T3 | Promise<T3> | Validator<Badge, $, T3>),
    target4: T4 | Promise<T4> | Validator<Badge, $, T4> | ((data: Data) => T4 | Promise<T4> | Validator<Badge, $, T4>),
    target5: T5 | Promise<T5> | Validator<Badge, $, T5> | ((data: Data) => T5 | Promise<T5> | Validator<Badge, $, T5>),
    target6: T6 | Promise<T6> | Validator<Badge, $, T6> | ((data: Data) => T6 | Promise<T6> | Validator<Badge, $, T6>),
    target7: T7 | Promise<T7> | Validator<Badge, $, T7> | ((data: Data) => T7 | Promise<T7> | Validator<Badge, $, T7>),
    target8: T8 | Promise<T8> | Validator<Badge, $, T8> | ((data: Data) => T8 | Promise<T8> | Validator<Badge, $, T8>),
    target9: T9 | Promise<T9> | Validator<Badge, $, T9> | ((data: Data) => T9 | Promise<T9> | Validator<Badge, $, T9>)
  ): ValidatorChain<Badge, $, [T0, T1, T2, T3, T4, T5, T6, T7, T8, T9]>;

  object<T = Data>(target?: T | Promise<T>): ValidatorChain<Badge, $, T>;
  array<T = Data>(target?: T | Promise<T>): ValidatorChain<Badge, $, T>;

  check(badge: Badge, validity: boolean | ((data: Data) => boolean), message?: string | ((data: Data) => string)): ValidatorChain<Badge, $, Data>;
  when(...badges: Badge[]): ValidatorChain<Badge, $, Data>;
  must(...conditions: (boolean | ((data: Data) => boolean))[]): ValidatorChain<Badge, $, Data>;
  if(...conditions: (boolean | ((data: Data) => boolean))[]): ValidatorChain<Badge, $, Data>;

  earn(badge: Badge): ValidatorChain<Badge, $, Data>;
  fail(badge: Badge, message?: string | ((data: Data) => string)): ValidatorChain<Badge, $, Data>;

  set($path: Data): ValidatorChain<Badge, $, Data>;
  set<T>($path: T, value: T | Promise<T> | ((data: Data) => T | Promise<T>)): ValidatorChain<Badge, $, T>;
  get<T>($path: T): ValidatorChain<Badge, $, T>;
  get<T, D>($path: T, task: (value: T) => D | Promise<D>): ValidatorChain<Badge, $, D>;

  end(): Promise<Data>;
}
