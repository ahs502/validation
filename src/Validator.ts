import Validation from './Validation';
import { getBadgeMessage, Chain, AsyncHandler, PendingHandler } from './utils';

export interface Internal<Badge extends string, $ extends {}> {
  validation: Validation<Badge, $>;
  invalidate: () => void;
  badges: Badge[];
  errors: { [badge in Badge]?: string };
  chains: { [name: string]: Chain<Badge>; [index: number]: Chain<Badge> };
  openedChains: string[];
  closedChains: string[];
  pendingHandlers: PendingHandler[];
  asyncHandlers: AsyncHandler[];
  asyncDone: boolean;
  asyncResolve: (value?: any) => void;
  asyncReject: (reason?: any) => void;
}

export default class Validator<Badge extends string, $ extends {}, Data = undefined> {
  private readonly internal: Internal<Badge, $>;
  private readonly blackhole: this;
  private readonly chain?: Chain<Badge>;

  private data: Data;

  constructor(internal: Internal<Badge, $>, chain?: Chain<Badge>) {
    const validator = this;
    this.internal = internal;
    this.blackhole = new Proxy(
      {},
      {
        get: (target, property, receiver) => {
          if (property === 'end') return () => undefined;
          if (property === 'else')
            return (task?: () => void) => {
              task && task();
              validator.data = undefined as any;
              return validator;
            };
          return () => validator.blackhole;
        }
      }
    ) as this;
    this.chain = chain;
    this.data = undefined as any;
  }

  /**
   * Fully throws away any other *ring* without any intention to return back.
   */
  private static blackhole = new Proxy(
    {},
    {
      get: (target, property, receiver) => {
        if (property === 'end') return () => undefined;
        return () => Validator.blackhole;
      }
    }
  );

  private set$(path: (string | number)[], value: any): void {
    let $ = this.internal.validation.$ as any;
    path.slice(0, -1).forEach((property, index) => {
      if (!$[property]) {
        const nextProperty = path[index + 1];
        $[property] = typeof nextProperty === 'number' ? [] : {};
      }
      $ = $[property];
    });
    $[path[path.length - 1]] = value;
  }

  private static end<Badge extends string, $ extends {}>(internal: Internal<Badge, $>, name: string, data: any): void {
    if (internal.asyncDone) return;
    if (internal.closedChains.includes(name)) throw `Chain ${name} is already closed.`;
    internal.closedChains.push(name);
    internal.chains[name].data = data;
    for (let i = 0; i < internal.pendingHandlers.length; i++) {
      const pendingHandler = internal.pendingHandlers[i];
      if (!pendingHandler.names.every(name => internal.closedChains.includes(name))) continue;
      pendingHandler.validator.data = pendingHandler.names.map(name => internal.chains[name].data);
      pendingHandler.tail.forEach(ring => (pendingHandler.validator = pendingHandler.validator[ring.method](...ring.args)));
      internal.pendingHandlers.splice(i--, 1);
    }
  }

  /**
   *
   * @param name
   * @param watches
   */
  in(name: string, ...watches: any[]): Validator<Badge, $> {
    if (this.chain) throw `Chain '${this.chain.name}' is already openned.`;
    if (this.internal.openedChains.includes(name)) throw `Chain ${name} already exists.`;

    this.internal.openedChains.push(name);

    if (name in this.internal.chains) {
      const { watches: oldWatches, effects } = this.internal.chains[name];
      if (watches.length === oldWatches.length && watches.every((thing, index) => thing === oldWatches[index])) {
        effects.invalidates && this.internal.invalidate();
        effects.badges.forEach(badge => this.internal.badges.includes(badge) || this.internal.badges.push(badge));
        for (const badge in effects.errors) {
          this.internal.errors[badge] = effects.errors[badge];
        }
        effects.$.forEach(pair => this.set$(pair.path, pair.value));
        Validator.end(this.internal, name, this.data);
        return Validator.blackhole;
      }
    }

    return new Validator(
      this.internal,
      (this.internal.chains[name] = {
        name,
        watches,
        data: undefined,
        effects: {
          invalidates: false,
          badges: [],
          errors: {},
          $: []
        }
      })
    );
  }

  /**
   *
   * @param target
   */
  with<T extends any>(target: T): Validator<Badge, $, T extends Validation ? undefined : T> {
    this.data = (target instanceof Validation ? undefined : target) as any;
    return this as any;
  }

  /**
   * Checks if the `target` is an existing ***JSON-like object*** aka **`{ ... }`** (an object, not array).
   * In the *chain*, the `object()` *ring* can only be followed by a `do()` *ring*, which performs some task on that `target`.
   *
   * If the `target` object exists, then the *chain* continues with the next `do()` *ring*.
   * Otherwise, the validation fails and the rest of *chain* will be skipped.
   *
   * --------------------------------
   * Example:
   *
   * In the example below, the validation first checks for existance of `person` and makes sure
   * that it is an existing object (not an array or anything else, but a `{ ... }` like object),
   * then continues the *chain* on the next `do()` *ring* method, feeding the same `person` from before,
   * so, we can safely decompose it and make access to its parts within the `do()` *ring* method:
   *
   *    validator
   *      .object(person)
   *      .do(({name, age, role}) => {
   *        // The person object surely exists at this point.
   *        // So, it can be safely decomposed to its containing parts and
   *        // we can validate each part of it here separately.
   *        validator.check( ... ) ...
   *        validator.check( ... ) ...
   *        ...
   *      });
   *
   * --------------------------------
   * @param target The object to be checked. It will be fed to the next `do()` *ring* method if exists.
   * @see `do` *ring* method.
   * @see `array` *ring* method.
   */
  object<T extends any>(target: T): Validator<Badge, $, T extends Validation ? undefined : T> {
    if (target && typeof target === 'object' && !Array.isArray(target)) {
      this.data = (target instanceof Validation ? undefined : target) as any;
      return this as any;
    }
    this.internal.invalidate();
    this.chain && (this.chain.effects.invalidates = true);
    return this.blackhole as any;
  }

  /**
   * Checks if the `target` is an existing ***JSON-like array*** aka **`[ ... ]`** (an array, not array-like objects).
   * In the *chain*, the `array()` *ring* can only be followed by an `each()` *ring*,
   * which performs some task on each item of that `target`.
   *
   * If the `target` array exists, then the *chain* continues with the next `each()` *ring*.
   * Otherwise, the validation fails and the rest of *chain* will be skipped.
   *
   * --------------------------------
   * Example:
   *
   * In the example below, the validation first checks for existance of `points` and makes sure
   * that it is an existing array (not an array-like object or anything else, but a `[ ... ]` array),
   * then continues the *chain* on the next `each()` *ring* method, iterating the same `points` from before,
   * so, we can safely decompose it and make access to its items within the `each()` *ring* method:
   *
   *    validator
   *      .array(points)
   *      .do((point, index) => {
   *        // The person object surely exists at this point.
   *        // So, it can be safely decomposed to its containing parts and
   *        // we can validate each part of it here separately.
   *        validator
   *          .object(point)
   *          .do(({x, y}) => {
   *            // ...
   *          });
   *      });
   *
   * --------------------------------
   * @param target The array to be checked. It will be fed to the next `each()` *ring* method if exists.
   * @see `each` *ring* method.
   * @see `object` *ring* method.
   * @see `into` *ring* method.
   */
  array<T extends any>(target: T): Validator<Badge, $, T> {
    if (target && Array.isArray(target)) {
      this.data = target as any;
      return this as any;
    }
    this.internal.invalidate();
    this.chain && (this.chain.effects.invalidates = true);
    return this.blackhole as any;
  }

  /**
   * Checks the `validity` condition (or `validity` condition provider) to see if it
   * fulfills or not.
   *
   * If yes, then the validation will earn the `badge` and the *chain* continues.
   *
   * If no, then the validation will fail at the `badge` and skip the rest of *chain*.
   * It will allocate `message` as the error message allocated to this badge if provided.
   * Otherwise, it'll try to find an appropriate error message first by looking at this
   * validation's `badgeFailureMessages` and then the `Validation.defaultBadgeFailureMessages`
   * and finally if nothing gets found, an empty string `''` will be set for it.
   *
   * All failed badge will be available both through the `errors` and `failedBadges` properties.
   *
   * --------------------------------
   * Example:
   *
   * In the example below, the validator checks the condition `age >= 0`,
   * if fulfilled, then it receives the badge `'AGE_IS_NOT_NEGATIVE'` and continues the *chain*,
   * otherwise, it fails at badge `'AGE_IS_NOT_NEGATIVE'` with error message `'Age -... is negative and invalid.'` and skips the rest of *chain*:
   *
   *    validator.check('AGE_IS_NOT_NEGATIVE', age >= 0, `Age ${age} is negative and invalid.`);
   *
   * --------------------------------
   * @param badge The badge to decide whether to earn or fail at.
   * @param validity The condition to check.
   * @param message Optional, the error message allocated to this badge if it's going to fail at it.
   */
  check(badge: Badge, validity: boolean | ((data: Data) => boolean), message?: string | ((data: Data) => string)): this {
    if (typeof validity === 'function' ? validity(this.data) : validity) {
      this.internal.badges.includes(badge) || (this.internal.badges.push(badge), this.chain && this.chain.effects.badges.push(badge));
      return this;
    }
    this.internal.errors[badge] =
      this.internal.errors[badge] ||
      (message && (typeof message === 'function' ? message(this.data) : message)) ||
      getBadgeMessage(badge, this.internal.validation.badgeFailureMessages, Validation.defaultBadgeFailureMessages) ||
      '';
    this.internal.invalidate();
    this.chain && ((this.chain.effects.invalidates = true), (this.chain.effects.errors[badge] = this.internal.errors[badge]));
    return this.blackhole;
  }

  /**
   * Simply adds the `badge` to this validation.
   *
   * It won't affect the validity status.
   *
   * --------------------------------
   * Example:
   *
   * In the example below, the validation earns the badge `'SOME_BADGE'` and continues the *chain*:
   *
   *    validator.earn('SOME_BADGE');
   *
   * --------------------------------
   * @param badge The badge to earn.
   */
  earn(badge: Badge): this {
    this.internal.badges.includes(badge) || (this.internal.badges.push(badge), this.chain && this.chain.effects.badges.push(badge));
    return this;
  }

  /**
   * Simply makes the validation to fail the `badge`, invalidates it but continues the rest of *chain*.
   *
   * If the failure `message` is not specified, the validator will try to find an appropriate error message first
   * by looking at this validation's `badgeFailureMessages` and then the `Validation.defaultBadgeFailureMessages`
   * and finally if nothing gets found, an empty string `''` will be set for it.
   *
   * --------------------------------
   * Example:
   *
   * In the example below, the validation fails the badge `'SOME_BADGE'` with error message
   * `'Some error.'` and continues the rest of *chain*:
   *
   *    validator.fail('SOME_BADGE', 'Some error.');
   *
   * --------------------------------
   * @param badge The badge to fail.
   * @param message Optional, the error message allocated to this badge if it's going to fail at it.
   */
  fail(badge: Badge, message?: string | ((data: Data) => string)): this {
    this.internal.errors[badge] =
      this.internal.errors[badge] ||
      (message && (typeof message === 'function' ? message(this.data) : message)) ||
      getBadgeMessage(badge, this.internal.validation.badgeFailureMessages, Validation.defaultBadgeFailureMessages) ||
      '';
    this.internal.invalidate();
    this.chain && ((this.chain.effects.invalidates = true), (this.chain.effects.errors[badge] = this.internal.errors[badge]));
    return this;
  }

  /**
   * Lets the *chain* continues iff this validation satisfies *all* the specified badges at the moment or no badges are specified.
   * Otherwise, invalidates the validation and skips execution of the rest of *chain*.
   *
   * --------------------------------
   * Example:
   *
   * In the example below, the validator goes for checking the badge `'X_EQUALS_Y'` only if both
   * badges `'X_IS_VALID'` and `'Y_IS_VALID'` are available, otherwise, invalidates the validation and skips the check:
   *
   *    validator.check('X_IS_VALID', typeof x === 'number' );
   *    validator.check('Y_IS_VALID', typeof y === 'number' );
   *    validator.when('X_IS_VALID', 'Y_IS_VALID').check('X_EQUALS_Y', () => x === y );
   *
   * --------------------------------
   * @param requiredBadges The required badges to continue the *chain*.
   * @see `check` *ring* method.
   */
  when(...badges: Badge[]): this {
    if (badges.length === 0) return this;
    if (this.internal.validation.has(...badges)) return this;
    this.internal.invalidate();
    this.chain && (this.chain.effects.invalidates = true);
    return this.blackhole;
  }

  /**
   * Lets the *chain* continues iff all the specified conditions (or condition providers) are fulfilled at the moment
   * or no conditions (or condition providers) are specified.
   * Otherwise, invalidates the validation (unlike `if` *ring* method) and skips execution of the rest of *chain*.
   *
   * --------------------------------
   * Example:
   *
   * In the example below, the validator goes for checking the badge `'N_IS_POSITIVE'` only if
   * the condition `n !== null` is fulfilled, otherwise, invalidates the validation and skips the check:
   *
   *    validator.must(n !== null).check('N_IS_POSITIVE', () => n > 0 );
   *
   * --------------------------------
   * @param conditions The required conditions (or condition providers) to continue the *chain*.
   *                   If a condition provider is given, the method first retrieve the condition
   *                   itself just before checking, then continues to check.
   * @see `if` *ring* method.
   * @see `check` *ring* method.
   */
  must(...conditions: (boolean | ((data: Data) => boolean))[]): this {
    for (let i = 0; i < conditions.length; ++i) {
      const condition = conditions[i];
      if (typeof condition === 'function' ? !condition(this.data) : !condition) {
        this.internal.invalidate();
        this.chain && (this.chain.effects.invalidates = true);
        return this.blackhole;
      }
    }
    return this;
  }

  /**
   * Lets the *chain* continues iff all the specified conditions (or condition providers) are fulfilled at the moment
   * or no conditions (or condition providers) are specified.
   * Otherwise, **only** skips execution of the rest of *chain* but **does not** invalidate the validation (unlike `must` *ring* method).
   *
   * --------------------------------
   * Example:
   *
   * In the example below, the validator treats `nickName` as an **optional** parameter and goes for
   * checking the badge `'NICK_NAME_IS_VALID'` only if `nickName` exists, otherwise, just skips the check:
   *
   *    validator.if(!!nickName).check('NICK_NAME_IS_VALID', () => /^[a-z]{3,20}$/.test(nickName));
   *
   * --------------------------------
   * @param conditions The required conditions (or condition providers) to continue the *chain*.
   *                   If a condition provider is given, the method first retrieve the condition
   *                   itself just before checking, then continues to check.
   * @see `must` *ring* method.
   * @see `check` *ring* method.
   */
  if(...conditions: (boolean | ((data: Data) => boolean))[]): this {
    for (let i = 0; i < conditions.length; ++i) {
      const condition = conditions[i];
      if (typeof condition === 'function' ? !condition(this.data) : !condition) return this.blackhole;
    }
    return this;
  }

  /**
   * Skips the rest of *chain* if it's not skipped before this point.
   *
   * Retrieves the rest of *chain* if it's skipped before from this point on
   * and also runs the `task` if specified.
   *
   * It won't affect the validity status.
   *
   * --------------------------------
   * Example:
   *
   * All the example *chain*s below have the exact same behaviour:
   *
   *    validator.check('AGE_IS_NOT_NEGATIVE', age >= 0 );
   *
   *    validator.if(age >= 0).earn('AGE_IS_NOT_NEGATIVE').else().fail('AGE_IS_NOT_NEGATIVE').else();
   *
   *    validator.if(age >= 0).earn('AGE_IS_NOT_NEGATIVE').else(() => validator.fail('AGE_IS_NOT_NEGATIVE')).else();
   *
   * --------------------------------
   * @param task Optional, the task to run if this *ring* is about to reactivate the *chain*.
   * @see `if` *ring* method.
   * @see `earn` *ring* method.
   * @see `fail` *ring* method.
   */
  else(task?: () => void): Validator<Badge, $> {
    // Just bypass task by definition!
    this.data = undefined as any;
    return this.blackhole as any;
  }

  /**
   * Runs the `task` if specified.
   *
   * It won't affect the validity status.
   *
   * --------------------------------
   * Example:
   *
   *    validator
   *      .if(!!nickName)
   *      .then(() => {
   *        validator
   *          .check('NICK_NAME_IS_VALID', /^[a-z]{3,20}$/.test(nickName))
   *          .check('NICK_NAME_IS_NICE', nickName.includes('nice'))
   *        validator
   *          .check('SHORT_NICK_NAME_IS_VALID', /^[a-z]{3,20}$/.test(shortNickName))
   *          .when('NICK_NAME_IS_VALID')
   *          .check('SHORT_NICK_NAME_IS_DIFFERENT', shortNickName !== nickName);
   *      })
   *      .then( ... )
   *      ...
   *
   * --------------------------------
   * @param task The task to run.
   * @see `if` *ring* method.
   * @see `check` *ring* method.
   * @see `when` *ring* method.
   */
  then<T>(task: (data: Data) => T): Validator<Badge, $, T extends void | undefined | Validation ? Data : T> {
    const data = task(this.data);
    this.data = (data instanceof Validation || data === undefined ? this.data : data) as any;
    return this as any;
  }

  /**
   *
   * @param task
   */
  do<T>(task: (...items: (Data extends readonly (infer I)[] ? I : any)[]) => T): Validator<Badge, $, T extends void | undefined | Validation ? Data : T> {
    if (!Array.isArray(this.data)) throw 'The target is not an array.';
    const data = task(...(this.data as any[]));
    this.data = (data instanceof Validation || data === undefined ? this.data : data) as any;
    return this as any;
  }

  /**
   *
   * @param task
   */
  each(task: (item: Data extends readonly (infer I)[] ? I : any, index: number) => void): this {
    if (!Array.isArray(this.data)) throw 'The target is not an array.';
    (this.data as any[]).forEach(task);
    return this;
  }

  /**
   * Awaits for the specified **promise** or **async task** *(promise provider)* to get resolved,
   * then continues the *chain*.
   *
   * The `async` property of the validation will only get resolved just after all known `await` calls
   * get resolved, otherwise, it will get rejected right after the first known `await` gets rejected.
   *
   * This *ring* method won't affect the validity status, unless if the `promise` gets rejected or
   * there exists other validation checks inside the `promise`.
   *
   * --------------------------------
   * Example:
   *
   * The following example checks the user allocated with an `userId` that if
   * the `username` field is valid and if the user has a phone number and the
   * required access to make a phone call. It uses two asynchronous services to
   * make the check happen:
   *
   *    validator
   *      .await(async () => {
   *        const user = await fetchUser(userId);
   *        validator.check('USER_NAME_IS_VALID', username === user.username);
   *        validator.check('USER_PHONE_NUMBER_EXISTS', !!user.phoneNumber);
   *      })
   *      .if('USER_PHONE_NUMBER_EXISTS')
   *      .await(() => fetchAccess(userId).then(access => {
   *        validator.check('USER_HAS_ACCESS_TO_CALL', access.call);
   *      }));
   *
   * And then in order to validate the data:
   *
   *    const validation = new UserValidation(userId, username);
   *    validation.ok // is not final yet...
   *    validation.async.then(() => {
   *      validation.ok // is final now!
   *    }).catch(reason => {
   *      // One of the fetches has failed with this reason.
   *    });
   *
   * > **IMPORTANT NOTE:**
   * >
   * > Please pay attention to the final `await` *ring* again, it looks something like this:
   * >
   * >     .await(() => fetch(...).then(data => { validator.check( ... ); }))
   * >
   * > the following looks very similar to the provided example above and it is even a little simpler to write:
   * >
   * >     .await(() => fetch(...).then(data => validator.check( ... )))
   * >
   * > but surprisingly **that does not work**!
   * >
   * > That's because the promise `fetch(...).then(data => validator.check( ... ))` resolves to
   * > **an open _chain_** `validator.check( ... )` and the provided promise for an `await` *ring*
   * > **can not get resolved to an open _chain_**.
   * >
   * > One possible solution is to wrap the *chain* into curly braces, just like the provided example above.
   * >
   * > Another possible solution is to **close the _chain_** with `end` *ring* method:
   * >
   * >     .await(() => fetch(...).then(data => validator.check( ... ).end()))
   *
   * --------------------------------
   * @param promise The promise or async task (promise provider) to be resolved.
   * @see `async` property from `Validation` class.
   * @see `end` *ring* method.
   * @see `Validation` class constructor.
   * @see `check` *ring* method.
   * @see `if` *ring* method.
   */
  await<T>(promise: Promise<T> | ((data: Data) => Promise<T>)): Validator<Badge, $, T extends void | undefined | Validation ? Data : T> {
    const asyncHandler: AsyncHandler = {
      promise: (typeof promise === 'function' ? promise(this.data) : promise)
        .then(data => {
          if (this.internal.asyncDone) return;
          let validator = this as any;
          validator.data = data instanceof Validation || data === undefined ? validator.data : data;
          asyncHandler.tail.forEach(ring => (validator = validator[ring.method](...ring.args)));
          this.internal.asyncHandlers.splice(this.internal.asyncHandlers.indexOf(asyncHandler), 1);
          if (this.internal.asyncHandlers.length) return;
          this.internal.asyncDone = true;
          this.internal.asyncResolve();
        })
        .catch(reason => {
          this.internal.invalidate();
          // this.chain && (this.chain.effects.invalidates = true);
          if (this.internal.asyncDone) return;
          this.internal.asyncDone = true;
          this.internal.asyncReject(reason);
        }),
      tail: []
    };
    this.internal.asyncHandlers.push(asyncHandler);
    const chainRedirector = new Proxy(
      {},
      {
        get: (target, property, receiver) => {
          return (...args: any[]) => {
            asyncHandler.tail.push({
              method: String(property),
              args
            });
            if (property === 'end') return undefined;
            return chainRedirector;
          };
        }
      }
    );
    return chainRedirector as any;
  }

  /**
   *
   * @param names
   */
  after<T extends any[] = any[]>(...names: string[]): Validator<Badge, $, T> {
    if (names.every(name => this.internal.closedChains.includes(name))) {
      this.data = names.map(name => this.internal.chains[name].data) as any;
      return this as any;
    }
    const pendingHandler: PendingHandler = {
      names,
      validator: this,
      tail: []
    };
    this.internal.pendingHandlers.push(pendingHandler);
    const chainRedirector = new Proxy(
      {},
      {
        get: (target, property, receiver) => {
          return (...args: any[]) => {
            pendingHandler.tail.push({
              method: String(property),
              args
            });
            if (property === 'end') return undefined;
            return chainRedirector;
          };
        }
      }
    );
    return chainRedirector as any;
  }

  /**
   * Addresses somewhere specific in `this.$` data structure,
   * so we can put something into it through the next `set()` or `put()` *ring* methods.
   *
   * It has to be followed by either a `set()` or a `put()` *ring* method.
   *
   * It won't affect the validity status.
   *
   * --------------------------------
   * Example:
   *
   * In the example below, the path validation first checks for existance of `path.points` and makes sure
   * that it is an existing array then iterates on each point and makes the `this.$` data structure with them:
   *
   *    interface Point { ... }
   *    class PointValidation extends Validation< ... > { ... }
   *
   *    interface Path {
   *      points: Point[];
   *      ...
   *    }
   *    class PathValidation extends Validation< ... , {
   *      points: {
   *        exists: boolean;
   *        validation: PointValidation;
   *      }[];
   *    }> {
   *      constructor(path: Path) {
   *        super(validator => {
   *          ...
   *          validator
   *            .array(path.points)
   *            .do((point, index) => {
   *              validator.into('points', index, 'exists').put(!!point);
   *              validator.into('points', index, 'validation').set(new PointValidation(point));
   *            });
   *          ...
   *        });
   *      }
   *    }
   *
   * --------------------------------
   * @param root The main key in the `this.$` object.
   * @param path The trailing keys / indexes after `root` indicating where the next
   *             `set()` or `put()` *ring* method should put the value to.
   * @see `set` *ring* method.
   * @see `put` *ring* method.
   * @see `Validation` class constructor.
   * @see `object` *ring* method.
   * @see `array` *ring* method.
   */
  $(
    root: keyof $,
    ...path: (string | number)[]
  ): {
    /**
     * Follows the `into()` *ring* on a *chain* and sets a nested validation
     * into the addressed position of `this.$` data structure.
     *
     * It will make the validation fail and skip the rest of *chain* iff
     * the nested validation already fails.
     *
     * --------------------------------
     * @param validation The nested validation (or validation provider) to be set into
     *                   the addressed position of `this.$` data structure.
     * @see `into` *ring* method.
     */
    set(validation: Validation<any> | ((data: Data) => Validation<any>)): Validator<Badge, $, Data>;
    /**
     * Follows the `into()` *ring* on a *chain* and custom value
     * into the addressed position of `this.$` data structure.
     *
     * It won't affect the validity status.
     *
     * --------------------------------
     * @param value The custom value (or value provider) to be set into
     *              the addressed position of `this.$` data structure.
     * @see `into` *ring* method.
     */
    put(value: any | ((data: Data) => any)): Validator<Badge, $, Data>;
  } {
    path.unshift(root as string | number);
    const validator = this;
    return {
      set(validation: Validation<any> | ((data: Data) => Validation<any>)): Validator<Badge, $, Data> {
        const validationInstance = typeof validation === 'function' ? validation(validator.data) : validation;
        validator.set$(path, validationInstance);
        validator.chain && validator.chain.effects.$.push({ path, value: validationInstance });
        if (validationInstance.ok) return validator;
        validator.internal.invalidate();
        validator.chain && (validator.chain.effects.invalidates = true);
        return validator.blackhole;
      },
      put(value: any | ((data: Data) => any)): Validator<Badge, $, Data> {
        const valueInstance = typeof value === 'function' ? value(validator.data) : value;
        validator.set$(path, valueInstance);
        validator.chain && validator.chain.effects.$.push({ path, value: valueInstance });
        return validator;
      }
    };
  }

  /**
   *
   */
  end(): undefined {
    this.chain && Validator.end(this.internal, this.chain.name, this.data);
    return undefined;
  }
}
