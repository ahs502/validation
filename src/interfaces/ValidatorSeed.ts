import { $Base } from '../utils/$';
import Validator from './Validator';
import ValidatorChain from './ValidatorChain';

export default interface ValidatorSeed<Badge extends string, $ extends $Base> extends Validator<Badge, $, undefined> {
  /**
   * The validation internal storage, mostly used for nested validation.
   *
   * During validation, it is accessible through `set`, `put`, `get` and `use` *ring* methods.
   *
   * After validation, it is accessible through `validation.$` property.
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
   *
   *myValidation.$.alpha.beta[0] // Equals to 10
   *```
   * --------------------------------
   * @see `set` *ring* method.
   * @see `put` *ring* method.
   * @see `get` *ring* method.
   * @see `use` *ring* method.
   */
  readonly $: $;

  /**
   * Names a *chain* and skips unnecessary checks in continuous validation.
   *
   * It should be the first *ring* in a *chain* and that *chain* must end with an `end` *ring* method.
   * Otherwise, the *chain* activity won't be cached and will be uneffective.
   *
   * Named *chain*s can not be introduced within other named *chain*s.
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
   * @param name The unique name of the *chain*, shouldn't be duplicated.
   * @param watches Optional, the list of all *chain* dependencies. The *chain* won't run again next time until one of these dependencies changes.
   * @see `end` *ring* method.
   */
  start(name: string, ...watches: any[]): ValidatorChain<Badge, $, undefined>;
}
