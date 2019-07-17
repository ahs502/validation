import Validation from './Validation';
import { getBadgeMessage } from './utils';

interface AsyncHandler {
  promise: Promise<any>;
  chain: {
    method: string;
    args: any[];
  }[];
}

export default class Validator<Badge extends string, Structure extends {}> {
  private readonly validation: Validation<Badge, Structure>;
  private readonly invalidate: () => void;
  private readonly badges: Badge[];
  private readonly errors: { [badge in Badge]?: string };
  private readonly blackhole: this;
  private readonly asyncHandlers: AsyncHandler[];
  private asyncDone: boolean;
  private asyncResolve!: (value?: any) => void;
  private asyncReject!: (reason?: any) => void;

  constructor(
    validation: Validation<Badge, Structure>,
    invalidate: () => void,
    badges: Badge[],
    errors: { [badge in Badge]?: string },
    consumeAsyncSetup: (providedAsyncSetup: (resolve: (value?: any) => void, reject: (reason?: any) => void) => void) => void
  ) {
    const me = this;
    this.validation = validation;
    this.invalidate = invalidate;
    this.badges = badges;
    this.errors = errors;
    this.blackhole = new Proxy(
      {},
      {
        get: (target, property, receiver) => {
          if (property === 'end') return () => undefined;
          if (property === 'else')
            return (task?: () => void) => {
              task && task();
              return me;
            };
          return () => me.blackhole;
        }
      }
    ) as this;
    this.asyncHandlers = [];
    this.asyncDone = false;
    consumeAsyncSetup((resolve, reject) => {
      this.asyncResolve = resolve;
      this.asyncReject = reject;
      if (this.asyncHandlers.length) return;
      this.asyncDone = true;
      this.asyncResolve();
    });
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
  when(...requiredBadges: Badge[]): this {
    if (requiredBadges.length === 0) return this;
    if (this.validation.has(requiredBadges[0], ...requiredBadges.slice(1))) return this;
    this.invalidate();
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
  must(...conditions: (boolean | (() => boolean))[]): this {
    for (let i = 0; i < conditions.length; ++i) {
      const condition = conditions[i];
      if (typeof condition === 'function' ? !condition() : !condition) {
        this.invalidate();
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
  if(...conditions: (boolean | (() => boolean))[]): this {
    for (let i = 0; i < conditions.length; ++i) {
      const condition = conditions[i];
      if (typeof condition === 'function' ? !condition() : !condition) return this.blackhole;
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
   *    validator.if(age >= 0).earn('AGE_IS_NOT_NEGATIVE').else(() => validator.fail('AGE_IS_NOT_NEGATIVE')).else();
   *
   *    validator.if(age >= 0).earn('AGE_IS_NOT_NEGATIVE').else().fail('AGE_IS_NOT_NEGATIVE').else().if(age >= 0);
   *
   * --------------------------------
   * @param task Optional, the task to run if this *ring* is about to reactivate the *chain*.
   * @see `if` *ring* method.
   * @see `earn` *ring* method.
   * @see `fail` *ring* method.
   */
  else(task?: () => void): this {
    // Just bypass task by definition!
    return this.blackhole;
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
  then(task: () => void): this {
    task();
    return this;
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
  check(badge: Badge, validity: boolean | (() => boolean), message?: string): this {
    if (typeof validity === 'function' ? validity() : validity) {
      this.badges.includes(badge) || this.badges.push(badge);
      return this;
    }
    this.errors[badge] =
      this.errors[badge] || message || getBadgeMessage(badge, this.validation.badgeFailureMessages, Validation.defaultBadgeFailureMessages) || '';
    this.invalidate();
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
    this.badges.includes(badge) || this.badges.push(badge);
    return this;
  }

  /**
   * Simply makes the validation to fail the `badge`, invalidates it and also skips the rest of *chain*.
   *
   * If the failure `message` is not specified, the validator will try to find an appropriate error message first
   * by looking at this validation's `badgeFailureMessages` and then the `Validation.defaultBadgeFailureMessages`
   * and finally if nothing gets found, an empty string `''` will be set for it.
   *
   * --------------------------------
   * Example:
   *
   * In the example below, the validation fails the badge `'SOME_BADGE'` with error message
   * `'Some error.'` and skips the rest of *chain*:
   *
   *    validator.fail('SOME_BADGE', 'Some error.');
   *
   * --------------------------------
   * @param badge The badge to fail.
   * @param message Optional, the error message allocated to this badge if it's going to fail at it.
   */
  fail(badge: Badge, message?: string): this {
    this.errors[badge] =
      this.errors[badge] || message || getBadgeMessage(badge, this.validation.badgeFailureMessages, Validation.defaultBadgeFailureMessages) || '';
    this.invalidate();
    return this.blackhole;
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
  object<T extends any = any>(target: T) {
    const validator = this;
    if (target && typeof target === 'object' && !Array.isArray(target))
      return {
        /**
         * Follows the `object()` *ring* on a *chain* and makes access
         * validating the contents of the checked target safely.
         *
         * --------------------------------
         * @param task The task to perform on the target.
         * @see `object` *ring* method.
         */
        do(task: (target: T) => void) {
          task(target);
          return validator as Validator<Badge, Structure>;
        }
      };
    this.invalidate();
    return {
      do() {
        return validator.blackhole;
      }
    };
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
  array<A extends any = any>(target: A) {
    const validator = this;
    if (target && Array.isArray(target))
      return {
        /**
         * Follows the `array()` *ring* on a *chain* and makes access
         * validating the items of the checked target safely.
         *
         * --------------------------------
         * @param task The task to perform on each item of the target,
         *             providing both the item and its index to the implementation.
         * @see `array` *ring* method.
         */
        each(task: (item: A extends readonly (infer T)[] ? T : any, index: number) => void) {
          target.forEach(task);
          return validator as Validator<Badge, Structure>;
        }
      };
    this.invalidate();
    return {
      each() {
        return validator.blackhole;
      }
    };
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
  into(root: keyof Structure, ...path: (string | number)[]) {
    path.unshift(root as string | number); //TODO: Consider symbols here too.
    const validator = this;
    return {
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
      set(validation: Validation<any> | (() => Validation<any>)): Validator<Badge, Structure> {
        const validationInstance = typeof validation === 'function' ? validation() : validation;
        set$(validationInstance);
        if (validationInstance.ok) return validator;
        validator.invalidate();
        return validator.blackhole;
      },

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
      put(value: any | (() => any)): Validator<Badge, Structure> {
        set$(typeof value === 'function' ? value() : value);
        return validator;
      }
    };

    function set$(value: any) {
      let $ = validator.validation.$ as any;
      path.slice(0, -1).forEach((property, index) => {
        if (!$[property]) {
          const nextProperty = path[index + 1];
          $[property] = typeof nextProperty === 'number' ? [] : {};
        }
        $ = $[property];
      });
      $[path[path.length - 1]] = value;
    }
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
  await(promise: Promise<any> | (() => Promise<any>)): this {
    const asyncHandler: AsyncHandler = {
      promise: (typeof promise === 'function' ? promise() : promise)
        .then(() => {
          if (this.asyncDone) return;
          let validator = this as any;
          asyncHandler.chain.forEach(ring => (validator = validator[ring.method](...ring.args)));
          this.asyncHandlers.splice(this.asyncHandlers.indexOf(asyncHandler), 1);
          if (this.asyncHandlers.length) return;
          this.asyncDone = true;
          this.asyncResolve();
        })
        .catch(reason => {
          this.invalidate();
          if (this.asyncDone) return;
          this.asyncDone = true;
          this.asyncReject(reason);
        }),
      chain: []
    };
    this.asyncHandlers.push(asyncHandler);
    const chainRedirector = new Proxy(
      {},
      {
        get: (target, property, receiver) => {
          if (property === 'end') return () => undefined;
          return (...args: any[]) => {
            asyncHandler.chain.push({
              method: String(property),
              args
            });
            return chainRedirector;
          };
        }
      }
    ) as this;
    return chainRedirector;
  }

  /**
   * Ends the *chain*. No more *ring*s can attach to **this** *chain* anymore.
   *
   * It won't affect the validity status.
   *
   * Its most common use case is to close returning *chain*s in promises
   * given to `await` *ring* methods. Look at `await` *ring* method for more details.
   *
   * --------------------------------
   * Example:
   *
   *    validator.check(...).check(...).end(); // That's fine!
   *
   *    validator.check(...).check(...).end().check(...); // Error.
   *
   * --------------------------------
   * @see `await` *ring* method.
   */
  end(): undefined {
    return undefined;
  }
}
