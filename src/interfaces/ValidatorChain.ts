import { $Base } from '../utils/$';
import { Something, Provider, ResultPromise, ResultValidator, ResultProvider } from './utils';
import ValidatorDescribed from '../descriptions/ValidatorDescribed';
import Validator from './Validator';

export default interface ValidatorChain<Badge extends string, $ extends $Base, Data> extends ValidatorDescribed {
  with<T = Something | Promise<Something>>(target: T): ValidatorChain<Badge, $, ResultPromise<T>>;

  then<T = Something | Promise<Something> | Validator<Badge, $, Something>>(task: Provider<Data, T>): ValidatorChain<Badge, $, ResultValidator<Badge, $, T>>;

  do<T = Something | Promise<Something> | Validator<Badge, $, Something>>(
    task: Data extends readonly []
      ? () => T
      : Data extends readonly [infer D0]
      ? (d0: D0) => T
      : Data extends readonly [infer D0, infer D1]
      ? (d0: D0, d1: D1) => T
      : Data extends readonly [infer D0, infer D1, infer D2]
      ? (d0: D0, d1: D1, d2: D2) => T
      : Data extends readonly [infer D0, infer D1, infer D2, infer D3]
      ? (d0: D0, d1: D1, d2: D2, d3: D3) => T
      : Data extends readonly [infer D0, infer D1, infer D2, infer D3, infer D4]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4) => T
      : Data extends readonly [infer D0, infer D1, infer D2, infer D3, infer D4, infer D5]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => T
      : Data extends readonly [infer D0, infer D1, infer D2, infer D3, infer D4, infer D5, infer D6]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => T
      : Data extends readonly [infer D0, infer D1, infer D2, infer D3, infer D4, infer D5, infer D6, infer D7]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => T
      : Data extends readonly [infer D0, infer D1, infer D2, infer D3, infer D4, infer D5, infer D6, infer D7, infer D8]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => T
      : Data extends readonly [infer D0, infer D1, infer D2, infer D3, infer D4, infer D5, infer D6, infer D7, infer D8, infer D9]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => T
      : Data extends readonly [infer D0, infer D1, infer D2, infer D3, infer D4, infer D5, infer D6, infer D7, infer D8, infer D9, ...(infer I)[]]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9, ...others: I[]) => T
      : never
  ): Data extends readonly any[] ? ValidatorChain<Badge, $, ResultValidator<Badge, $, T>> : never;

  each<T = Something | Promise<Something> | Validator<Badge, $, Something>>(
    task: Data extends readonly (infer I)[] ? (item: I, index: number, data: Data) => T : never
  ): Data extends readonly any[] ? ValidatorChain<Badge, $, ResultValidator<Badge, $, T>[]> : never;

  after<T0 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>>(
    target0: T0
  ): ValidatorChain<Badge, $, [ResultProvider<Badge, $, T0>]>;
  after<
    T0 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T1 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>
  >(
    target0: T0,
    target1: T1
  ): ValidatorChain<Badge, $, [ResultProvider<Badge, $, T0>, ResultProvider<Badge, $, T1>]>;
  after<
    T0 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T1 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>,
    T2 = Something | Promise<Something> | Validator<Badge, $, Something> | Provider<Data, Something | Promise<Something> | Validator<Badge, $, Something>>
  >(
    target0: T0,
    target1: T1,
    target2: T2
  ): ValidatorChain<Badge, $, [ResultProvider<Badge, $, T0>, ResultProvider<Badge, $, T1>, ResultProvider<Badge, $, T2>]>;
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
  ): ValidatorChain<Badge, $, [ResultProvider<Badge, $, T0>, ResultProvider<Badge, $, T1>, ResultProvider<Badge, $, T2>, ResultProvider<Badge, $, T3>]>;
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
  ): ValidatorChain<
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
  ): ValidatorChain<
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
  ): ValidatorChain<
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
  ): ValidatorChain<
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
  ): ValidatorChain<
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
  ): ValidatorChain<
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
  ): ValidatorChain<
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

  object<T = Something | Promise<Something>>(target: T): ValidatorChain<Badge, $, ResultPromise<T>>;

  array<T = Something | Promise<Something>>(target: T): ValidatorChain<Badge, $, ResultPromise<T>>;

  check(badge: Badge, validity: boolean | Provider<Data, boolean>, message?: string | Provider<Data, string>): ValidatorChain<Badge, $, Data>;

  when(...badges: Badge[]): ValidatorChain<Badge, $, Data>;

  must(...conditions: (boolean | Provider<Data, boolean>)[]): ValidatorChain<Badge, $, Data>;

  if(...conditions: (boolean | Provider<Data, boolean>)[]): ValidatorChain<Badge, $, Data>;

  earn(badge: Badge): ValidatorChain<Badge, $, Data>;

  fail(badge: Badge, message?: string | Provider<Data, string>): ValidatorChain<Badge, $, Data>;

  set: Data extends undefined ? () => never : ($path: Data) => ValidatorChain<Badge, $, Data>;

  put<T = Something, U = T | Promise<T>>($path: T, value: U | Provider<Data, U>): ValidatorChain<Badge, $, ResultPromise<U>>;

  get<T = Something>($path: T): ValidatorChain<Badge, $, T>;

  use<T = Something, U = Something | Promise<Something> | Validator<Badge, $, Something>>(
    $path: T,
    task: Data extends undefined ? (value: T) => U : (value: T, data: Data) => U
  ): ValidatorChain<Badge, $, ResultValidator<Badge, $, U>>;

  readonly value: Data | Promise<Data>;

  /**
   * Closes a named *chain* and caches its results to be used later in continuous validation.
   *
   * It should be the last *ring* in a *chain* and that *chain* must begin with a `stort` *ring* method.
   *
   * --------------------------------
   * Example:
   *
   *```typescript
   *interface User {
   *  firstName: string;
   *  lastName: string;
   *  age: number;
   *}
   *
   *class UserValidation extends Validation {
   *  constructor({ firstName, lastName, age }: User, previousUserValidation?: UserValidation) {
   *    super(
   *      validator => {
   *
   *        validator
   *          .start('name', firstName, lastName)
   *          ...
   *          .check( ... ) // Some heavy/async check on name
   *          ...
   *          .end();
   *
   *        validator
   *          .start('age', age)
   *          ...
   *          .check( ... ) // Some heavy/async check on age
   *          ...
   *          .end();
   *
   *      },
   *      previousUserValidation
   *    );
   *  }
   *}
   *
   *let validation: userValidation | undefined = undefined;
   *
   *do {
   *  const user = getUser();
   *
   *  // This is called continuous validation; to feed the previous validation
   *  // to the new one to achieve more performance.
   *  // While either user.firstName or user.lastName don't change, the checks for them in
   *  // the 'name' named chain won't happen again and the result will be copied from before.
   *  // The same happens for user.age and 'age' named chain.
   *  validation = new UserValidation(user, validation);
   *
   *  if (validation.ok) {
   *    // The user data is valid.
   *  }
   *} while (...)
   *```
   * --------------------------------
   * @see `start` *ring* method.
   */
  end(): Data | Promise<Data>;
}
