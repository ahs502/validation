export default interface ValidationDescribed {
  /**
   * The overall validity status *(Considering all the nested validation too)*.
   *
   * It may get updated through time until asynchronous validation steps are completed and
   * finally finds its final value after `validation.async` promise is resolved or rejected.
   *
   * --------------------------------
   * Example:
   *
   *    const validation = new DataValidation(data);
   *    if (validation.ok) {
   *      // data is valid!
   *    }
   *
   * --------------------------------
   * @see `async` property.
   */
  ok?: any;

  /**
   * The internal data structure used for nested validation for complext data.
   *
   * It may get updated through time until asynchronous validation steps are completed and
   * finally finds its final value after `validation.async` promise is resolved or rejected.
   *
   * --------------------------------
   * Example:
   *
   *    class SimpleValidation extends Validation ...
   *    class ComplexValidation extends Validation<..., { simple: SimpleValidation }> {
   *      constructor(complexData: ComplexData) {
   *        super(validator => {
   *          ...
   *          validator.into('simple').set(new SimpleValidation(complexData.simplePart));
   *          ...
   *        });
   *      }
   *    }
   *
   *    const complexData = { ..., simplePart: { ... }, ... };
   *    const validation = new ComplexValidation(complexData);
   *    if (validation.$.simple.ok) {
   *      // complexData.simplePart is valid!
   *    }
   *
   * --------------------------------
   * @see `async` property.
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
   *    const validation = new DataValidation(data);
   *    validation.badges.forEach(b => console.log(`Badge ${b} earned!`));
   *
   * --------------------------------
   * @see `async` property.
   */
  badges: any;

  /**
   * The list of all badges failed to earn during validation process.
   * It's exactly the same as the keys of `errors` object.
   *
   * Having any failed badges means the validation fails as well or `validation.ok === false`, but **not vice versa**.
   *
   * It may get updated through time until asynchronous validation steps are completed and
   * finally finds its final value after `validation.async` promise is resolved or rejected.
   *
   * --------------------------------
   * Example:
   *
   *    const validation = new DataValidation(data);
   *    validation.failedBadges.forEach(b => console.log(`Badge ${b} failed.`));
   *
   * --------------------------------
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
   *    const validation = new DataValidation(data);
   *    if(validation.errors['SOME_FAILED_BADGE']) {
   *      console.log(`Badge SOME_FAILED_BADGE failed with error ${validation.errors['SOME_FAILED_BADGE']}`);
   *    }
   *
   * --------------------------------
   * @see `failedBadges` property.
   * @see `async` property.
   */
  errors: any;

  /**
   * A promise to be resolved or rejected after an asynchronous validation is completed.
   *
   * For synchronous validation, it resolves near immediately.
   *
   * --------------------------------
   * Example:
   *
   *    const validation = new DataValidation(data); // Contains asynchronous checks
   *    if(validation.ok) {
   *      // data is valid by the means of synchronous checks only
   *    }
   *    validation.async.then(() => {
   *      if(validation.ok) {
   *        // data is valid!
   *      }
   *    });
   *
   * --------------------------------
   * @see `await` method from `Validator` class.
   */
  async: any;

  /**
   * The default error messages for failed badge of this validation,
   * provided into validation class constructor definition.
   *
   * The *keys* are badge globs, either one of these:
   * - A badge itself
   * - A * character followed by a badge postfix
   * - A badge prefix followed by a * character
   * - A single * character
   *
   * The *values* are the error message.
   *
   * --------------------------------
   * Example:
   *
   *    class DataValidation extends Validation<...> {
   *      constructor(...) {
   *        super(validator => {
   *          ...
   *        }, {
   *          NAME_IS_VALID: 'Name is invalid.',
   *          '*_IS_VALID': 'This field is invalid.',
   *          'NAME_*': 'Name has a problem.',
   *          '*': 'The form data is not acceptable.'
   *        });
   *      }
   *    }
   *
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
   *    const validation = new DataValidation(data);
   *    if (validation.has('NAME_EXISTS', 'NAME_IS_OK')) {
   *      // The field name is ok!
   *    }
   *
   * --------------------------------
   * @param badges The badges to be checked for existance.
   * @see `async` property.
   */
  has(...params: any[]): any;

  /**
   * Returns all error messages produced during validation,
   * with respect to the given badge globs if specified.
   *
   * The result may change through time until asynchronous validation steps are completed and
   * finally fixes after `validation.async` promise is resolved or rejected.
   *
   * --------------------------------
   * Example:
   *
   *    const validation = new DataValidation(data);
   *    console.log(validation.errors()); // The same as validation.errors('*')
   *
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
   * with respect to the given badge globs if specified.
   *
   * The result may change through time until asynchronous validation steps are completed and
   * finally fixes after `validation.async` promise is resolved or rejected.
   *
   * --------------------------------
   * Example:
   *
   *    const validation = new DataValidation(data);
   *    console.log(validation.error('NAME_*')); // First error occurance with the name field
   *
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
   * Throws an exception iff this validation does not pass overally,
   * in other words, `validation.ok === false`.
   *
   * It'll throw the first un empty error message within `validation.errors` or
   * through the hole `validation.$` data structure.
   * If no error messages are found, it will throw `defaultMessage` if provided,
   * otherwise, it will throw an empty string `''`.
   *
   * The outcome may change through time until asynchronous validation steps are completed and
   * finally fixes after `validation.async` promise is resolved or rejected.
   *
   * --------------------------------
   * Example:
   *
   *    const validation = new DataValidation(data);
   *    validation.throw('Unknown error.');
   *
   * --------------------------------
   * @param defaultMessage The default error message to be thrown if no existing error messages are found.
   * @throws The first unempty error message iff this validation does not pass.
   * @see `ok` property.
   */
  throw(...params: any[]): any;

  /**
   *
   */
  dispose(...params: any[]): any;
}
