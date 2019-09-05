export default interface ValidatorDescribed {
  /**
   *
   */
  with(...params: any[]): any;

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
  then(...params: any[]): any;

  /**
   *
   */
  do(...params: any[]): any;

  /**
   *
   */
  each(...params: any[]): any;

  /**
   *
   */
  after(...params: any[]): any;

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
  object(...params: any[]): any;

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
  array(...params: any[]): any;

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
  check(...params: any[]): any;

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
  when(...params: any[]): any;

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
  must(...params: any[]): any;

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
  if(...params: any[]): any;

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
  earn(...params: any[]): any;

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
  fail(...params: any[]): any;

  /**
   *
   */
  set(...params: any[]): any;

  /**
   *
   */
  put(...params: any[]): any;

  /**
   *
   */
  get(...params: any[]): any;

  /**
   *
   */
  use(...params: any[]): any;
}
