export default interface ValidatorDescribed {
  /**
   * Suplies the *chain* with a given (async) data.
   *
   * It won't affect the validity status.
   *
   * --------------------------------
   * Example:
   *
   *```typescript
   *validator
   *  .with(10)
   *  .then(console.log) // Prints 10
   *  .with(Promise.resolve(20))
   *  .then(console.log) // Prints 20 asynchronously
   *```
   * --------------------------------
   * @param target The provided data to be passed (can be a promise)
   * @see `then` *ring* method.
   */
  with(...params: any[]): any;

  /**
   * Runs the `task` on the passed data.
   *
   * It won't affect the validity status.
   *
   * --------------------------------
   * Example:
   *
   *```typescript
   *validator
   *  .with(10)
   *  .then(data => console.log(data)) // Prints 10
   *
   *validator
   *  .if(!!nickName)
   *  .then(() => {
   *    validator
   *      .check('NICK_NAME_IS_VALID', /^[a-z]{3,20}$/.test(nickName))
   *      .check('NICK_NAME_IS_NICE', nickName.includes('nice'))
   *    validator
   *      .check('SHORT_NICK_NAME_IS_VALID', /^[a-z]{3,20}$/.test(shortNickName))
   *      .when('NICK_NAME_IS_VALID')
   *      .check('SHORT_NICK_NAME_IS_DIFFERENT', shortNickName !== nickName);
   *  })
   *  .then( ... )
   *  ...
   *```
   * --------------------------------
   * @param task The task to run.
   * @see `with` *ring* method.
   * @see `if` *ring* method.
   * @see `check` *ring* method.
   * @see `when` *ring* method.
   */
  then(...params: any[]): any;

  /**
   * Runs the `task` on the passed data.
   * The same as `then` *ring* method, but with the passed data as spread parameters.
   *
   * Usually comes after an `after` *ring* method.
   *
   * It won't affect the validity status.
   *
   * --------------------------------
   * Example:
   *
   *```typescript
   *validator
   *  .after(
   *    10,
   *    Promise.resolve(20),
   *    validator.with(30)
   *  )
   *  .do((x, y, z) => {
   *    // x is 10
   *    // y is 20
   *    // z is 30
   *  })
   *```
   * --------------------------------
   * @param task The task to run.
   * @see `after` *ring* method.
   */
  do(...params: any[]): any;

  /**
   * Runs the `task` on each element of the passed data.
   * Requires the passed data to be an array.
   *
   * It won't affect the validity status.
   *
   * --------------------------------
   * Example:
   *
   *```typescript
   *validator
   *  .with([10, 20, 30])
   *  .each((item, index, array) => console.log(item, index, array))
   *  // Prints the following:
   *  // 10 0 [10, 20, 30]
   *  // 20 1 [10, 20, 30]
   *  // 30 2 [10, 20, 30]
   *```
   * --------------------------------
   * @param task The task to run on each element of the array data.
   * @see `with` *ring* method.
   */
  each(...params: any[]): any;

  /**
   * Suplies the *chain* with a series of given (async) data.
   * Similar to the `with` *ring* method, but with elements provided separately.
   *
   * Usually comes before a `do` *ring* method.
   *
   * It won't affect the validity status.
   *
   * --------------------------------
   * Example:
   *
   *```typescript
   *validator
   *  .after(
   *    10,
   *    Promise.resolve(20),
   *    validator.with(30)
   *  )
   *  .do((x, y, z) => {
   *    // x is 10
   *    // y is 20
   *    // z is 30
   *  })
   *```
   * --------------------------------
   * @see `do` *ring* method.
   */
  after(...params: any[]): any;

  /**
   * Checks if the `target` is an existing ***JSON-like object*** aka **`{ ... }`** (an object, not array).
   * Also, suplies the *chain* with the `target` as data.
   * Typically, followed by a `then` *ring* method.
   *
   * The same as a `with` *ring* method, but also checks the `target` type and exsistance.
   *
   * If the `target` object doesn't exist and qualify, then the *chain* breaks and the validation fails.
   *
   * --------------------------------
   * Example:
   *
   * In the example below, the validation first checks for existance of `person` and makes sure
   * that it is an existing object (not an array or anything else, but a `{ ... }` like object),
   * then continues the *chain* on the next `then` *ring* method, feeding the same `person` from before,
   * so, we can safely decompose it and make access to its properties within the `then` *ring* method:
   *
   *```typescript
   *validator
   *  .object(person)
   *  .then(({name, age, role}) => {
   *    // The person object surely exists at this point.
   *    // So, it can be safely decomposed to its containing properties and
   *    // we can validate each property of it here separately.
   *    validator.check( ... ) ...
   *    validator.check( ... ) ...
   *    ...
   *  });
   *```
   * --------------------------------
   * @param target The object to be checked and passed through the *chain*.
   * @see `with` *ring* method.
   * @see `then` *ring* method.
   * @see `array` *ring* method.
   */
  object(...params: any[]): any;

  /**
   * Checks if the `target` is an existing ***JSON-like array*** aka **`[ ... ]`** (an array, not array-like objects).
   * Also, suplies the *chain* with the `target` as data.
   * Typically, followed by an `each` *ring* method.
   *
   * The same as a `with` *ring* method, but also checks the `target` type and exsistance.
   *
   * If the `target` array doesn't exist and qualify, then the *chain* breaks and the validation fails.
   *
   * --------------------------------
   * Example:
   *
   * In the example below, the validation first checks for existance of `points` and makes sure
   * that it is an existing array (not an array-like object or anything else, but a `[ ... ]` array),
   * then continues the *chain* on the next `each` *ring* method, iterating the same `points` from before,
   * so, we can safely decompose it and make access to its elements within the `each` *ring* method:
   *
   *```typescript
   *validator
   *  .array(points)
   *  .each((point, index, points) => {
   *    // The points array surely exists at this point.
   *    // So, it can be safely decomposed to its containing elements and
   *    // we can validate each element of it here separately.
   *    validator
   *      .object(point)
   *      .then(({x, y}) => {
   *        validate.check( ... ) ...
   *        validate.check( ... ) ...
   *      });
   *  });
   *```
   * --------------------------------
   * @param target The array to be checked and passed through the *chain*.
   * @see `with` *ring* method.
   * @see `then` *ring* method.
   * @see `object` *ring* method.
   */
  array(...params: any[]): any;

  /**
   * Checks the `validity` condition.
   *
   * If it helds, then the validation will earn the `badge` and the *chain* continues.
   *
   * Otherwise, the validation will fail at the `badge` with `message` (if provided) and skip the rest of *chain*.
   *
   * If the failure `message` is not specified, the validator will try to find an appropriate error message first
   * by looking at this validation's `badgeFailureMessages` and then the `Validation.defaultBadgeFailureMessages`
   * and finally if nothing gets found, an empty string `''` will be set for it.
   *
   * All failed badges will be available both through the `errors` and `failedBadges` properties of the validation.
   *
   * --------------------------------
   * Example:
   *
   *```typescript
   *validator.check('BADGE', condition, 'Failure message');
   *```
   *
   * In both the following examples, the validator checks the condition `age >= 0`,
   * if fulfilled, then it receives the badge `'AGE_IS_NOT_NEGATIVE'` and continues the *chain*,
   * otherwise, it fails at badge `'AGE_IS_NOT_NEGATIVE'` with error message `'Age -... is negative and invalid.'` and skips the rest of *chain*:
   *
   *```typescript
   *validator.check('AGE_IS_NOT_NEGATIVE', age >= 0, `Age ${age} is negative and invalid.`);
   *
   *validator
   *  .with(age)
   *  .check(
   *    'AGE_IS_NOT_NEGATIVE',
   *    age => age >= 0,
   *    age => `Age ${age} is negative and invalid.`
   *  )
   *```
   * --------------------------------
   * @param badge The badge to decide whether to earn or fail at.
   * @param validity The condition to check.
   * @param message Optional, the error message allocated to this badge if it's going to fail at it.
   * @see `with` *ring* method.
   */
  check(...params: any[]): any;

  /**
   * Breaks the *chain* and invalidates the validation
   * only iff there is some badge specified but not earned yet by the validation.
   *
   * --------------------------------
   * Example:
   *
   * In the example below, the validator goes for checking the badge `'X_EQUALS_Y'` only if both
   * badges `'X_IS_VALID'` and `'Y_IS_VALID'` are available, otherwise, invalidates the validation and skips the check:
   *
   *```typescript
   *validator.check('X_IS_VALID', typeof x === 'number');
   *validator.check('Y_IS_VALID', typeof y === 'number');
   *
   *validator
   *  .when('X_IS_VALID', 'Y_IS_VALID')
   *  .check('X_EQUALS_Y', () => x === y);
   *```
   * --------------------------------
   * @param requiredBadges The required badges to continue the *chain*.
   * @see `check` *ring* method.
   */
  when(...params: any[]): any;

  /**
   * Breaks the *chain* and invalidates the validation
   * iff even one of the provided conditions becomes `false`.
   *
   * The same as an `if` *ring* method, but invalidates the validation in the case of failure.
   *
   * --------------------------------
   * Example:
   *
   * In the example below, the validator goes for checking the badge `'N_IS_POSITIVE'` only if
   * the condition `n !== null` is fulfilled, otherwise, invalidates the validation and skips the check:
   *
   *```typescript
   *validator
   *  .must(n !== null)
   *  .check('N_IS_POSITIVE', () => n > 0 );
   *```
   * --------------------------------
   * @param conditions The required conditions (or condition providers) to continue the *chain*.
   * @see `if` *ring* method.
   * @see `check` *ring* method.
   */
  must(...params: any[]): any;

  /**
   * Breaks the *chain* iff even one of the provided conditions becomes `false`.
   *
   * The same as a `must` *ring* method, but doesn't invalidate the validation in the case of failure.
   *
   * --------------------------------
   * Example:
   *
   * In the example below, the validator treats `nickName` as an **optional** parameter and goes for
   * checking the badge `'NICK_NAME_IS_VALID'` only if `nickName` exists, otherwise, just simply skips the check:
   *
   *```typescript
   *validator
   *  .if(!!nickName)
   *  .check('NICK_NAME_IS_VALID', () => /^[a-z]{3,20}$/.test(nickName));
   *```
   * --------------------------------
   * @param conditions The required conditions (or condition providers) to continue the *chain*.
   * @see `must` *ring* method.
   * @see `check` *ring* method.
   */
  if(...params: any[]): any;

  /**
   * Lets the validation to earn the specified `badge`.
   *
   * It won't affect the validity status.
   *
   * --------------------------------
   * Example:
   *
   * In the example below, the validation earns the badge `'SOME_BADGE'` and continues the *chain*:
   *
   *```typescript
   *validator.earn('SOME_BADGE');
   *```
   * --------------------------------
   * @param badge The badge to earn.
   */
  earn(...params: any[]): any;

  /**
   * Fails the validation at the specified `badge` with the specified `message` (if provided)
   * and invalidates it but continues the rest of *chain*.
   *
   * If the failure `message` is not specified, the validator will try to find an appropriate error message first
   * by looking at this validation's `badgeFailureMessages` and then the `Validation.defaultBadgeFailureMessages`
   * and finally if nothing gets found, an empty string `''` will be set for it.
   *
   * --------------------------------
   * Example:
   *
   *In the example below, the validation fails the badge `'SOME_BADGE'` with error message
   *`'Some error.'` and continues the rest of *chain*:
   *
   *```typescript
   *validator.fail('SOME_BADGE', 'Some error.');
   *```
   * --------------------------------
   * @param badge The badge to fail.
   * @param message Optional, the error message allocated to this badge if it's going to fail at it.
   */
  fail(...params: any[]): any;

  /**
   * Sets the passed down data of the *chain* into the specified path of the `$` internal storage.
   *
   * Almost the same as a `put` *ring* method, but uses the passed down data.
   *
   * The reverse of a `get` *ring* method.
   *
   * It won't affect the validity status.
   *
   * --------------------------------
   * Example:
   *
   *```typescript
   *class MyValidation extends Validation<string, {
   *  alpha: {
   *    beta: number[]
   *  }
   *}> {
   *  constructor() {
   *    super(validator => {
   *      validator
   *        .with(10)
   *        .set(validator.$.alpha.beta[0])
   *    })
   *  }
   *}
   *
   *const myValidation = new MyValidation()
   *
   *myValidation.$.alpha.beta[0] // will be 10
   * ```
   * --------------------------------
   * @param $path The specified path of the `$` internal storage, must be specified using the `validator` parameter.
   * @see `Validation` class.
   * @see `put` *ring* method.
   * @see `get` *ring* method.
   * @see `with` *ring* method.
   */
  set(...params: any[]): any;

  /**
   * Sets the specified data of the *chain* into the specified path of the `$` internal storage.
   * Also, lets the same data to pass through the *chain*.
   *
   * Almost the same as a `set` *ring* method, but uses the specified data (or data provider).
   *
   * If the data is an invalidated `Validation` instance, then it cause the validation to be invalidated as well.
   * Otherwise, it won't affect the validity status.
   *
   * --------------------------------
   * Example:
   *
   *```typescript
   *class MyValidation extends Validation<string, {
   *  alpha: {
   *    beta: number[]
   *  }
   *}> {
   *  constructor() {
   *    super(validator => {
   *      validator
   *        .put(validator.$.alpha.beta[0], 20)
   *        .put(validator.$.alpha.beta[1], data => data + 5)
   *    })
   *  }
   *}
   *
   *const myValidation = new MyValidation()
   *
   *myValidation.$.alpha.beta[0] // will be 20
   *myValidation.$.alpha.beta[1] // will be 25
   * ```
   *
   * Another example:
   *
   *```typescript
   *interface Point {
   *  x: number;
   *  y: number;
   *}
   *
   *class PointValidation extends Validation {
   *  constructor(point: Point) {
   *    super(validator => ... )
   *  }
   *}
   *
   *interface Path {
   *  points: Point[]
   *}
   *
   *class PathValidation extends Validation<string, {
   *  pointValidations: PointValidation[]
   *}> {
   *  constructor(path: Path) {
   *    super(validator => {
   *      validator
   *        .object(path)
   *        .then(({ points }) => {
   *          validator
   *            .array(points)
   *            .each((point, index) => {
   *              validator
   *                .put(validator.$.pointValidations[index], new PointValidation(point));
   *            });
   *        });
   *    });
   *  }
   *}
   *
   *const path: Path = {
   *  points: [
   *    { x: 1, y: 2 },
   *    ...
   *  ]
   *};
   *
   *const pathValidation = new PathValidation(path);
   *
   *if (pathValidation.ok) {
   *  // Both the path and all its points are valid.
   *}
   *
   *if (pathValidation.$.pointValidations[0].ok) {
   *  // The first point of the path is valid,
   *  // independent of the other points or the path itself.
   *}
   * ```
   * --------------------------------
   * @param $path The specified path of the `$` internal storage, must be specified using the `validator` parameter.
   * @param value The specified value or value provider.
   * @see `Validation` class.
   * @see `set` *ring* method.
   * @see `object` *ring* method.
   * @see `then` *ring* method.
   * @see `array` *ring* method.
   * @see `each` *ring* method.
   */
  put(...params: any[]): any;

  /**
   * Reads a value from a specified path of the `$` internal storage and let it to be passed down through the *chain*.
   *
   * The same as an `use` *ring* method, but without manipulating the retrieved value.
   *
   * The reverse of a `set` *ring* method.
   *
   * It won't affect the validity status.
   *
   * --------------------------------
   * Example:
   *
   *```typescript
   *class MyValidation extends Validation<string, {
   *  alpha: {
   *    beta: number[]
   *  }
   *}> {
   *  constructor() {
   *    super(validator => {
   *      validator
   *        .put(validator.$.alpha.beta[0], 10);
   *
   *      validator
   *        .get(validator.$.alpha.beta[0])
   *        .then(console.log);
   *    })
   *  }
   *}
   *
   *const myValidation = new MyValidation() // Prints 10
   * ```
   * --------------------------------
   * @param $path The specified path of the `$` internal storage, must be specified using the `validator` parameter.
   * @see `Validation` class.
   * @see `use` *ring* method.
   * @see `set` *ring* method.
   * @see `put` *ring* method.
   * @see `then` *ring* method.
   */
  get(...params: any[]): any;

  /**
   * Makes use of a value from a specified path of the `$` internal storage and let the result to be passed down through the *chain*.
   *
   * The same as an `get` *ring* method, but with manipulating the retrieved value.
   *
   * It won't affect the validity status.
   *
   * --------------------------------
   * Example:
   *
   *```typescript
   *class MyValidation extends Validation<string, {
   *  alpha: {
   *    beta: number[]
   *  }
   *}> {
   *  constructor() {
   *    super(validator => {
   *      validator
   *        .put(validator.$.alpha.beta[0], 10);
   *
   *      validator
   *        .use(validator.$.alpha.beta[0], data => data + 5)
   *        .then(console.log);
   *    })
   *  }
   *}
   *
   *const myValidation = new MyValidation() // Prints 15
   * ```
   * --------------------------------
   * @param $path The specified path of the `$` internal storage, must be specified using the `validator` parameter.
   * @see `Validation` class.
   * @see `get` *ring* method.
   * @see `put` *ring* method.
   * @see `then` *ring* method.
   */
  use(...params: any[]): any;

  /**
   * Gets the passed value from the *chain*.
   * It will be a Promise for asynchronous *chain*s.
   */
  value: any;
}
