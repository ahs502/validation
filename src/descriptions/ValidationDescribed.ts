export default interface ValidationDescribed {
  /**
   * The overall validity status (Considering all the nested validation too).
   *
   * It is initially `undefined` and becomes `undefined` again when there are any synchronous or asynchronous exceptions.
   *
   * It may get updated through time until asynchronous validation steps are completed and
   * finally finds its final value after `validation.async` promise is resolved or rejected.
   *
   * --------------------------------
   * Example:
   *
   *```typescript
   *const validation = new DataValidation(data);
   *
   *if (validation.ok) {
   *  // data is valid!
   *}
   *```
   * --------------------------------
   * @see `async` property.
   */
  ok?: any;

  /**
   * The internal storage used for nested validation and more.
   *
   * It may get updated through time until asynchronous validation steps are completed and
   * finally finds its final value after `validation.async` promise is resolved or rejected.
   *
   * --------------------------------
   * Example:
   *
   *```typescript
   *class SimpleValidation extends Validation { ... }
   *
   *class ComplexValidation extends Validation< ... , {
   *  simpleValidation: SimpleValidation;
   *}> {
   *  constructor(complexData: ComplexData) {
   *    super(validator => {
   *      ...
   *      validator.put(validator.$.simpleValidation, new SimpleValidation(complexData.simpleData));
   *      ...
   *    });
   *  }
   *}
   *
   *const complexData = { ..., simpleData: { ... }, ... };
   *
   *const complexValidation = new ComplexValidation(complexData);
   *
   *if (complexValidation.ok) {
   *  // Both complexData and complexData.simpleData are valid.
   *}
   *
   *if (complexValidation.$.simpleValidation.ok) {
   *  // complexData.simpleData is valid, independent of complexData.
   *}
   *```
   * --------------------------------
   * @see `async` property.
   * @see `validator.set` *ring* method.
   * @see `validator.put` *ring* method.
   * @see `validator.get` *ring* method.
   * @see `validator.use` *ring* method.
   */
  $: any;

  /**
   * The list of all earned badges during validation process.
   *
   * It may get updated through time until asynchronous validation steps are completed and
   * finally finds its final value after `validation.async` promise is resolved or rejected.
   *
   * --------------------------------
   * Example:
   *
   *```typescript
   *const validation = new DataValidation(data);
   *
   *validation.badges // An array of all earned badges.
   *```
   * --------------------------------
   * @see `failedBadges` property.
   * @see `async` property.
   */
  badges: any;

  /**
   * The list of all badge failures during validation process.
   * It's the same as the keys of the `validation.errors` property.
   *
   * Having any failed badges means the validation fails as well or `validation.ok === false`, but **not vice versa**.
   *
   * It may get updated through time until asynchronous validation steps are completed and
   * finally finds its final value after `validation.async` promise is resolved or rejected.
   *
   * --------------------------------
   * Example:
   *
   *```typescript
   *const validation = new DataValidation(data);
   *
   *validation.failedBadges // An array of all badge failures.
   *```
   * --------------------------------
   * @see `errors` property.
   * @see `badges` property.
   * @see `async` property.
   */
  failedBadges: any;

  /**
   * A mapping from all the failed badges to their corresponding error messages.
   *
   * It may get updated through time until asynchronous validation steps are completed and
   * finally finds its final value after `validation.async` promise is resolved or rejected.
   *
   * --------------------------------
   * Example:
   *
   *```typescript
   *const validation = new DataValidation(data);
   *
   *validation.errors // Is something like: { 'FAILED_BADGE': 'Failure message.', ... }
   *```
   * --------------------------------
   * @see `failedBadges` property.
   * @see `message` method.
   * @see `messages` method.
   * @see `async` property.
   */
  errors: any;

  /**
   * A promise to be resolved with the final value of the `ok` property or
   * rejected by the exception reason after all asynchronous checks and *chains* of the validation are completed.
   *
   * After that, there will be no changes in any other property like `ok`, `badges` and so on.
   *
   * If there are exceptions during asynchronous checks, then this promise rejects and the `ok` property becomes `undefined` again.
   *
   * For synchronous validation, it resolves near immediately.
   * And, the possible exceptions are being thrown directly.
   *
   * --------------------------------
   * Example:
   *
   *```typescript
   *const validation = new DataValidation(data); // Let's suppose it contains asynchronous checks.
   *
   *if (validation.ok) {
   *  // data is valid by the means of synchronous checks only.
   *}
   *
   *await validation.async;
   *
   *if (validation.ok) {
   *  // data is valid!
   *}
   *```
   * --------------------------------
   * @see `ok` property.
   */
  async: any;

  /**
   * The default error messages for failed badge of this validation,
   * provided within validation class constructor definition.
   *
   * The *keys* are badge globs, either one of these:
   * - A badge itself
   * - A * character followed by a badge postfix
   * - A badge prefix followed by a * character
   * - A single * character
   *
   * The *values* are the error messages.
   *
   * --------------------------------
   * Example:
   *
   *```typescript
   *class DataValidation extends Validation {
   *  constructor() {
   *    super(
   *      validator => {
   *        ...
   *      },
   *      {
   *        NAME_IS_VALID: 'Name is invalid.',
   *        '*_IS_VALID': 'This field is invalid.',
   *        'NAME_*': 'Name has a problem.',
   *        '*': 'The form data is not acceptable.'
   *      }
   *    );
   *  }
   *}
   *```
   * --------------------------------
   * @see `Validation` class constructor.
   */
  badgeFailureMessages: any;

  /**
   * Returns `true` iff this validation earned all the specified badges or no badges are specified.
   *
   * The result may change through time until asynchronous validation steps are completed and
   * finally fixes after `validation.async` promise is resolved or rejected.
   *
   * --------------------------------
   * Example:
   *
   *```typescript
   *const validation = new DataValidation(data);
   *
   *if (validation.has('NAME_EXISTS', 'NAME_IS_OK')) {
   *  // The field 'name' is ok!
   *}
   *```
   * --------------------------------
   * @param badges The badges to be checked for existance.
   * @see `async` property.
   */
  has(...params: any[]): any;

  /**
   * Returns all error messages produced during validation,
   * with respect to the given badge globs if specified any.
   *
   * The same as `message` method, but retrieves all the error messages.
   *
   * The result may change through time until asynchronous validation steps are completed and
   * finally fixes after `validation.async` promise is resolved or rejected.
   *
   * --------------------------------
   * Example:
   *
   *```typescript
   *const validation = new DataValidation(data);
   *
   *validation.messages() // Array of error messages strings.
   *validation.messages('*') // The same as above.
   *validation.messages('NAME_*') // All the error messages about the 'name' field.
   *```
   * --------------------------------
   * @param badgeGlobs Optional, it will narrowed down the result of the method.
   *                   Each badge glob is either one of these:
   *                   - A badge itself
   *                   - A * character followed by a badge postfix
   *                   - A badge prefix followed by a * character
   *                   - A single * character *(which is the same as not specifing any badge glob
   *                     at the first place in order to retrieve all error messages)*
   * @see `async` property.
   */
  messages(...params: any[]): any;

  /**
   * Returns the first error message produced during validation if exists any,
   * and returns `undefined` if no error messages exist for this validation,
   * with respect to the given badge globs if specified any.
   *
   * The same as `messages` method, but retrieves only the first existing error message.
   *
   * The result may change through time until asynchronous validation steps are completed and
   * finally fixes after `validation.async` promise is resolved or rejected.
   *
   * --------------------------------
   * Example:
   *
   *```typescript
   *const validation = new DataValidation(data);
   *
   *validation.message() // The first existing error message string.
   *validation.message('*') // The same as above.
   *validation.message('NAME_*') // The first existing error message about the 'name' field.
   *```
   * --------------------------------
   * @param badgeGlobs Optional, it will narrowed down the result of the method.
   *                   Each badge glob is either one of these:
   *                   - A badge itself
   *                   - A * character followed by a badge postfix
   *                   - A badge prefix followed by a * character
   *                   - A single * character *(which is the same as not specifing any badge glob
   *                     at the first place in order to retrieve any available error message)*
   * @see `async` property.
   */
  message(...params: any[]): any;

  /**
   * Throws an exception only iff this validation does not pass overally,
   * in other words, `validation.ok !== true`.
   *
   * It'll throw the first non-empty error message within `validation.errors` or
   * in the nested validations through the hole `validation.$` data structure.
   *
   * If no error messages are found, it will throw `defaultMessage` if provided,
   * otherwise, it will throw an empty string `''`.
   *
   * The outcome may change through time until asynchronous validation steps are completed and
   * finally fixes after `validation.async` promise is resolved or rejected.
   *
   * --------------------------------
   * Example:
   *
   *```typescript
   *const validation = new DataValidation(data);
   *
   *validation.throw('Unknown error.'); // Only throws exception if the validation fails.
   *```
   * --------------------------------
   * @param defaultMessage The default error message to be thrown if no existing error messages are found.
   * @throws The first non-empty error message or the default error message only iff this validation does not pass.
   * @see `ok` property.
   */
  throw(...params: any[]): any;

  /**
   * Disposes the validation.
   * That means the all the asynchronous checks will be disabled and
   * the promise `validation.async` will be rejected by the specified `reason` parameter.
   *
   * It will have no effect after validation is completed,
   * aka `validation.async` is already resolved or rejected.
   *
   * --------------------------------
   * Example:
   *
   *```typescript
   *const validation = new DataValidation(data); // Let's suppose it contains asynchronous checks.
   *
   *validation.dispose('Page is closed.'); // No more attempt to perform the remaining asynchronous validation steps.
   *```
   * --------------------------------
   * @param reason Optional, the `validation.async` rejection reason, by default is `'disposed'`.
   * @see `async` property.
   */
  dispose(...params: any[]): any;
}
