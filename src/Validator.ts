import { $Base } from './$';

interface Something {}

export default interface Validator<Badge extends string, $ extends $Base, Data> {
  with<T = Something>(target: T | Promise<T>): Validator<Badge, $, T>;
  then<T = Something>(
    task: Data extends void ? (() => T | Promise<T> | Validator<Badge, $, T>) : ((data: Data) => T | Promise<T> | Validator<Badge, $, T>)
  ): Validator<Badge, $, T>;
  do<T = Something>(
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
      : Data extends readonly (infer I)[]
      ? (...portions: I[]) => T | Promise<T> | Validator<Badge, $, T>
      : never
  ): Data extends readonly any[] ? Validator<Badge, $, T> : never;
  each<T = Something>(
    task: Data extends readonly (infer I)[] ? (item: I, index: number, data: Data) => T | Promise<T> | Validator<Badge, $, T> : never
  ): Data extends readonly any[] ? Validator<Badge, $, T> : never;
  after<T0 = Something>(
    target0?:
      | T0
      | Promise<T0>
      | Validator<Badge, $, T0>
      | (Data extends undefined ? (() => T0 | Promise<T0> | Validator<Badge, $, T0>) : ((data: Data) => T0 | Promise<T0> | Validator<Badge, $, T0>))
  ): Validator<Badge, $, [T0]>;
  after<T0 = Something, T1 = Something>(
    target0:
      | T0
      | Promise<T0>
      | Validator<Badge, $, T0>
      | (Data extends undefined ? (() => T0 | Promise<T0> | Validator<Badge, $, T0>) : ((data: Data) => T0 | Promise<T0> | Validator<Badge, $, T0>)),
    target1:
      | T1
      | Promise<T1>
      | Validator<Badge, $, T1>
      | (Data extends undefined ? (() => T1 | Promise<T1> | Validator<Badge, $, T1>) : ((data: Data) => T1 | Promise<T1> | Validator<Badge, $, T1>))
  ): Validator<Badge, $, [T0, T1]>;
  after<T0 = Something, T1 = Something, T2 = Something>(
    target0:
      | T0
      | Promise<T0>
      | Validator<Badge, $, T0>
      | (Data extends undefined ? (() => T0 | Promise<T0> | Validator<Badge, $, T0>) : ((data: Data) => T0 | Promise<T0> | Validator<Badge, $, T0>)),
    target1:
      | T1
      | Promise<T1>
      | Validator<Badge, $, T1>
      | (Data extends undefined ? (() => T1 | Promise<T1> | Validator<Badge, $, T1>) : ((data: Data) => T1 | Promise<T1> | Validator<Badge, $, T1>)),
    target2:
      | T2
      | Promise<T2>
      | Validator<Badge, $, T2>
      | (Data extends undefined ? (() => T2 | Promise<T2> | Validator<Badge, $, T2>) : ((data: Data) => T2 | Promise<T2> | Validator<Badge, $, T2>))
  ): Validator<Badge, $, [T0, T1, T2]>;
  after<T0 = Something, T1 = Something, T2 = Something, T3 = Something>(
    target0:
      | T0
      | Promise<T0>
      | Validator<Badge, $, T0>
      | (Data extends undefined ? (() => T0 | Promise<T0> | Validator<Badge, $, T0>) : ((data: Data) => T0 | Promise<T0> | Validator<Badge, $, T0>)),
    target1:
      | T1
      | Promise<T1>
      | Validator<Badge, $, T1>
      | (Data extends undefined ? (() => T1 | Promise<T1> | Validator<Badge, $, T1>) : ((data: Data) => T1 | Promise<T1> | Validator<Badge, $, T1>)),
    target2:
      | T2
      | Promise<T2>
      | Validator<Badge, $, T2>
      | (Data extends undefined ? (() => T2 | Promise<T2> | Validator<Badge, $, T2>) : ((data: Data) => T2 | Promise<T2> | Validator<Badge, $, T2>)),
    target3:
      | T3
      | Promise<T3>
      | Validator<Badge, $, T3>
      | (Data extends undefined ? (() => T3 | Promise<T3> | Validator<Badge, $, T3>) : ((data: Data) => T3 | Promise<T3> | Validator<Badge, $, T3>))
  ): Validator<Badge, $, [T0, T1, T2, T3]>;
  after<T0 = Something, T1 = Something, T2 = Something, T3 = Something, T4 = Something>(
    target0:
      | T0
      | Promise<T0>
      | Validator<Badge, $, T0>
      | (Data extends undefined ? (() => T0 | Promise<T0> | Validator<Badge, $, T0>) : ((data: Data) => T0 | Promise<T0> | Validator<Badge, $, T0>)),
    target1:
      | T1
      | Promise<T1>
      | Validator<Badge, $, T1>
      | (Data extends undefined ? (() => T1 | Promise<T1> | Validator<Badge, $, T1>) : ((data: Data) => T1 | Promise<T1> | Validator<Badge, $, T1>)),
    target2:
      | T2
      | Promise<T2>
      | Validator<Badge, $, T2>
      | (Data extends undefined ? (() => T2 | Promise<T2> | Validator<Badge, $, T2>) : ((data: Data) => T2 | Promise<T2> | Validator<Badge, $, T2>)),
    target3:
      | T3
      | Promise<T3>
      | Validator<Badge, $, T3>
      | (Data extends undefined ? (() => T3 | Promise<T3> | Validator<Badge, $, T3>) : ((data: Data) => T3 | Promise<T3> | Validator<Badge, $, T3>)),
    target4:
      | T4
      | Promise<T4>
      | Validator<Badge, $, T4>
      | (Data extends undefined ? (() => T4 | Promise<T4> | Validator<Badge, $, T4>) : ((data: Data) => T4 | Promise<T4> | Validator<Badge, $, T4>))
  ): Validator<Badge, $, [T0, T1, T2, T3, T4]>;
  after<T0 = Something, T1 = Something, T2 = Something, T3 = Something, T4 = Something, T5 = Something>(
    target0:
      | T0
      | Promise<T0>
      | Validator<Badge, $, T0>
      | (Data extends undefined ? (() => T0 | Promise<T0> | Validator<Badge, $, T0>) : ((data: Data) => T0 | Promise<T0> | Validator<Badge, $, T0>)),
    target1:
      | T1
      | Promise<T1>
      | Validator<Badge, $, T1>
      | (Data extends undefined ? (() => T1 | Promise<T1> | Validator<Badge, $, T1>) : ((data: Data) => T1 | Promise<T1> | Validator<Badge, $, T1>)),
    target2:
      | T2
      | Promise<T2>
      | Validator<Badge, $, T2>
      | (Data extends undefined ? (() => T2 | Promise<T2> | Validator<Badge, $, T2>) : ((data: Data) => T2 | Promise<T2> | Validator<Badge, $, T2>)),
    target3:
      | T3
      | Promise<T3>
      | Validator<Badge, $, T3>
      | (Data extends undefined ? (() => T3 | Promise<T3> | Validator<Badge, $, T3>) : ((data: Data) => T3 | Promise<T3> | Validator<Badge, $, T3>)),
    target4:
      | T4
      | Promise<T4>
      | Validator<Badge, $, T4>
      | (Data extends undefined ? (() => T4 | Promise<T4> | Validator<Badge, $, T4>) : ((data: Data) => T4 | Promise<T4> | Validator<Badge, $, T4>)),
    target5:
      | T5
      | Promise<T5>
      | Validator<Badge, $, T5>
      | (Data extends undefined ? (() => T5 | Promise<T5> | Validator<Badge, $, T5>) : ((data: Data) => T5 | Promise<T5> | Validator<Badge, $, T5>))
  ): Validator<Badge, $, [T0, T1, T2, T3, T4, T5]>;
  after<T0 = Something, T1 = Something, T2 = Something, T3 = Something, T4 = Something, T5 = Something, T6 = Something>(
    target0:
      | T0
      | Promise<T0>
      | Validator<Badge, $, T0>
      | (Data extends undefined ? (() => T0 | Promise<T0> | Validator<Badge, $, T0>) : ((data: Data) => T0 | Promise<T0> | Validator<Badge, $, T0>)),
    target1:
      | T1
      | Promise<T1>
      | Validator<Badge, $, T1>
      | (Data extends undefined ? (() => T1 | Promise<T1> | Validator<Badge, $, T1>) : ((data: Data) => T1 | Promise<T1> | Validator<Badge, $, T1>)),
    target2:
      | T2
      | Promise<T2>
      | Validator<Badge, $, T2>
      | (Data extends undefined ? (() => T2 | Promise<T2> | Validator<Badge, $, T2>) : ((data: Data) => T2 | Promise<T2> | Validator<Badge, $, T2>)),
    target3:
      | T3
      | Promise<T3>
      | Validator<Badge, $, T3>
      | (Data extends undefined ? (() => T3 | Promise<T3> | Validator<Badge, $, T3>) : ((data: Data) => T3 | Promise<T3> | Validator<Badge, $, T3>)),
    target4:
      | T4
      | Promise<T4>
      | Validator<Badge, $, T4>
      | (Data extends undefined ? (() => T4 | Promise<T4> | Validator<Badge, $, T4>) : ((data: Data) => T4 | Promise<T4> | Validator<Badge, $, T4>)),
    target5:
      | T5
      | Promise<T5>
      | Validator<Badge, $, T5>
      | (Data extends undefined ? (() => T5 | Promise<T5> | Validator<Badge, $, T5>) : ((data: Data) => T5 | Promise<T5> | Validator<Badge, $, T5>)),
    target6:
      | T6
      | Promise<T6>
      | Validator<Badge, $, T6>
      | (Data extends undefined ? (() => T6 | Promise<T6> | Validator<Badge, $, T6>) : ((data: Data) => T6 | Promise<T6> | Validator<Badge, $, T6>))
  ): Validator<Badge, $, [T0, T1, T2, T3, T4, T5, T6]>;
  after<T0 = Something, T1 = Something, T2 = Something, T3 = Something, T4 = Something, T5 = Something, T6 = Something, T7 = Something>(
    target0:
      | T0
      | Promise<T0>
      | Validator<Badge, $, T0>
      | (Data extends undefined ? (() => T0 | Promise<T0> | Validator<Badge, $, T0>) : ((data: Data) => T0 | Promise<T0> | Validator<Badge, $, T0>)),
    target1:
      | T1
      | Promise<T1>
      | Validator<Badge, $, T1>
      | (Data extends undefined ? (() => T1 | Promise<T1> | Validator<Badge, $, T1>) : ((data: Data) => T1 | Promise<T1> | Validator<Badge, $, T1>)),
    target2:
      | T2
      | Promise<T2>
      | Validator<Badge, $, T2>
      | (Data extends undefined ? (() => T2 | Promise<T2> | Validator<Badge, $, T2>) : ((data: Data) => T2 | Promise<T2> | Validator<Badge, $, T2>)),
    target3:
      | T3
      | Promise<T3>
      | Validator<Badge, $, T3>
      | (Data extends undefined ? (() => T3 | Promise<T3> | Validator<Badge, $, T3>) : ((data: Data) => T3 | Promise<T3> | Validator<Badge, $, T3>)),
    target4:
      | T4
      | Promise<T4>
      | Validator<Badge, $, T4>
      | (Data extends undefined ? (() => T4 | Promise<T4> | Validator<Badge, $, T4>) : ((data: Data) => T4 | Promise<T4> | Validator<Badge, $, T4>)),
    target5:
      | T5
      | Promise<T5>
      | Validator<Badge, $, T5>
      | (Data extends undefined ? (() => T5 | Promise<T5> | Validator<Badge, $, T5>) : ((data: Data) => T5 | Promise<T5> | Validator<Badge, $, T5>)),
    target6:
      | T6
      | Promise<T6>
      | Validator<Badge, $, T6>
      | (Data extends undefined ? (() => T6 | Promise<T6> | Validator<Badge, $, T6>) : ((data: Data) => T6 | Promise<T6> | Validator<Badge, $, T6>)),
    target7:
      | T7
      | Promise<T7>
      | Validator<Badge, $, T7>
      | (Data extends undefined ? (() => T7 | Promise<T7> | Validator<Badge, $, T7>) : ((data: Data) => T7 | Promise<T7> | Validator<Badge, $, T7>))
  ): Validator<Badge, $, [T0, T1, T2, T3, T4, T5, T6, T7]>;
  after<T0 = Something, T1 = Something, T2 = Something, T3 = Something, T4 = Something, T5 = Something, T6 = Something, T7 = Something, T8 = Something>(
    target0:
      | T0
      | Promise<T0>
      | Validator<Badge, $, T0>
      | (Data extends undefined ? (() => T0 | Promise<T0> | Validator<Badge, $, T0>) : ((data: Data) => T0 | Promise<T0> | Validator<Badge, $, T0>)),
    target1:
      | T1
      | Promise<T1>
      | Validator<Badge, $, T1>
      | (Data extends undefined ? (() => T1 | Promise<T1> | Validator<Badge, $, T1>) : ((data: Data) => T1 | Promise<T1> | Validator<Badge, $, T1>)),
    target2:
      | T2
      | Promise<T2>
      | Validator<Badge, $, T2>
      | (Data extends undefined ? (() => T2 | Promise<T2> | Validator<Badge, $, T2>) : ((data: Data) => T2 | Promise<T2> | Validator<Badge, $, T2>)),
    target3:
      | T3
      | Promise<T3>
      | Validator<Badge, $, T3>
      | (Data extends undefined ? (() => T3 | Promise<T3> | Validator<Badge, $, T3>) : ((data: Data) => T3 | Promise<T3> | Validator<Badge, $, T3>)),
    target4:
      | T4
      | Promise<T4>
      | Validator<Badge, $, T4>
      | (Data extends undefined ? (() => T4 | Promise<T4> | Validator<Badge, $, T4>) : ((data: Data) => T4 | Promise<T4> | Validator<Badge, $, T4>)),
    target5:
      | T5
      | Promise<T5>
      | Validator<Badge, $, T5>
      | (Data extends undefined ? (() => T5 | Promise<T5> | Validator<Badge, $, T5>) : ((data: Data) => T5 | Promise<T5> | Validator<Badge, $, T5>)),
    target6:
      | T6
      | Promise<T6>
      | Validator<Badge, $, T6>
      | (Data extends undefined ? (() => T6 | Promise<T6> | Validator<Badge, $, T6>) : ((data: Data) => T6 | Promise<T6> | Validator<Badge, $, T6>)),
    target7:
      | T7
      | Promise<T7>
      | Validator<Badge, $, T7>
      | (Data extends undefined ? (() => T7 | Promise<T7> | Validator<Badge, $, T7>) : ((data: Data) => T7 | Promise<T7> | Validator<Badge, $, T7>)),
    target8:
      | T8
      | Promise<T8>
      | Validator<Badge, $, T8>
      | (Data extends undefined ? (() => T8 | Promise<T8> | Validator<Badge, $, T8>) : ((data: Data) => T8 | Promise<T8> | Validator<Badge, $, T8>))
  ): Validator<Badge, $, [T0, T1, T2, T3, T4, T5, T6, T7, T8]>;
  after<
    T0 = Something,
    T1 = Something,
    T2 = Something,
    T3 = Something,
    T4 = Something,
    T5 = Something,
    T6 = Something,
    T7 = Something,
    T8 = Something,
    T9 = Something
  >(
    target0:
      | T0
      | Promise<T0>
      | Validator<Badge, $, T0>
      | (Data extends undefined ? (() => T0 | Promise<T0> | Validator<Badge, $, T0>) : ((data: Data) => T0 | Promise<T0> | Validator<Badge, $, T0>)),
    target1:
      | T1
      | Promise<T1>
      | Validator<Badge, $, T1>
      | (Data extends undefined ? (() => T1 | Promise<T1> | Validator<Badge, $, T1>) : ((data: Data) => T1 | Promise<T1> | Validator<Badge, $, T1>)),
    target2:
      | T2
      | Promise<T2>
      | Validator<Badge, $, T2>
      | (Data extends undefined ? (() => T2 | Promise<T2> | Validator<Badge, $, T2>) : ((data: Data) => T2 | Promise<T2> | Validator<Badge, $, T2>)),
    target3:
      | T3
      | Promise<T3>
      | Validator<Badge, $, T3>
      | (Data extends undefined ? (() => T3 | Promise<T3> | Validator<Badge, $, T3>) : ((data: Data) => T3 | Promise<T3> | Validator<Badge, $, T3>)),
    target4:
      | T4
      | Promise<T4>
      | Validator<Badge, $, T4>
      | (Data extends undefined ? (() => T4 | Promise<T4> | Validator<Badge, $, T4>) : ((data: Data) => T4 | Promise<T4> | Validator<Badge, $, T4>)),
    target5:
      | T5
      | Promise<T5>
      | Validator<Badge, $, T5>
      | (Data extends undefined ? (() => T5 | Promise<T5> | Validator<Badge, $, T5>) : ((data: Data) => T5 | Promise<T5> | Validator<Badge, $, T5>)),
    target6:
      | T6
      | Promise<T6>
      | Validator<Badge, $, T6>
      | (Data extends undefined ? (() => T6 | Promise<T6> | Validator<Badge, $, T6>) : ((data: Data) => T6 | Promise<T6> | Validator<Badge, $, T6>)),
    target7:
      | T7
      | Promise<T7>
      | Validator<Badge, $, T7>
      | (Data extends undefined ? (() => T7 | Promise<T7> | Validator<Badge, $, T7>) : ((data: Data) => T7 | Promise<T7> | Validator<Badge, $, T7>)),
    target8:
      | T8
      | Promise<T8>
      | Validator<Badge, $, T8>
      | (Data extends undefined ? (() => T8 | Promise<T8> | Validator<Badge, $, T8>) : ((data: Data) => T8 | Promise<T8> | Validator<Badge, $, T8>)),
    target9:
      | T9
      | Promise<T9>
      | Validator<Badge, $, T9>
      | (Data extends undefined ? (() => T9 | Promise<T9> | Validator<Badge, $, T9>) : ((data: Data) => T9 | Promise<T9> | Validator<Badge, $, T9>))
  ): Validator<Badge, $, [T0, T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
  after<T = Something>(
    ...targets: (
      | T
      | Promise<T>
      | Validator<Badge, $, T>
      | (Data extends undefined ? (() => T | Promise<T> | Validator<Badge, $, T>) : ((data: Data) => T | Promise<T> | Validator<Badge, $, T>)))[]
  ): Validator<Badge, $, T[]>;

  object<T = Something>(target: T | Promise<T>): Validator<Badge, $, T>;
  array<T = Something>(target: T | Promise<T>): Validator<Badge, $, T>;

  check(
    badge: Badge,
    validity: boolean | (Data extends undefined ? () => boolean : (data: Data) => boolean),
    message?: string | (Data extends undefined ? () => string : (data: Data) => string)
  ): Validator<Badge, $, Data>;
  when(...badges: Badge[]): Validator<Badge, $, Data>;
  must(...conditions: (boolean | (Data extends undefined ? () => boolean : (data: Data) => boolean))[]): Validator<Badge, $, Data>;
  if(...conditions: (boolean | (Data extends undefined ? () => boolean : (data: Data) => boolean))[]): Validator<Badge, $, Data>;

  earn(badge: Badge): Validator<Badge, $, Data>;
  fail(badge: Badge, message?: string | (Data extends undefined ? () => string : (data: Data) => string)): Validator<Badge, $, Data>;

  set: Data extends undefined ? (() => never) : (($path: Data) => Validator<Badge, $, Data>);
  put<T = Something>(
    $path: T,
    value: T | Promise<T> | (Data extends undefined ? () => T | Promise<T> : (data: Data) => T | Promise<T>)
  ): Validator<Badge, $, T>;
  get<T = Something>($path: T): Validator<Badge, $, T>;
  use<T = Something, D = Something>(
    $path: T,
    task: Data extends undefined ? ((value: T) => D | Promise<D>) : ((value: T, data: Data) => D | Promise<D>)
  ): Validator<Badge, $, D>;

  readonly data: Data | Promise<Data>;
}
