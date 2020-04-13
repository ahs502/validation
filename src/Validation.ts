import { $Base, traverse$ } from './utils/$';
import BadgeFailureMessages, { matchBadgeGlob } from './utils/BadgeFailureMessages';
import Internal from './utils/Internal';
import ValidationDescribed from './descriptions/ValidationDescribed';
import ValidatorSeed from './interfaces/ValidatorSeed';
import ValidatorBase from './ValidatorBase';

/**
 * The base class for every other validation class.
 *
 * Defines by two optional types:
 * - `Badge`: The type of all *badge*s involved with this validation.
 *   Should extend `string`, by default is `string`, can also be `never` but
 *   usually is a **`string` literal type** listing all related badges.
 * - `$`: The type of the internal storage mostly used for nested validations.
 *   Should extend `{}` and by default is `{}`.
 *
 * --------------------------------
 * Example:
 *
 *```typescript
 *interface Person {
 *  name: string;
 *  age?: number;
 *}
 *
 *class PersonValidation extends Validation<
 *| 'NAME_EXISTS'
 *| 'NAME_IS_VALID'
 *| 'AGE_EXISTS'
 *| 'AGE_IS_POSITIVE'
 *> {
 *  constructor(person: Person) {
 *    super(validator =>
 *      validator
 *        .object(person)
 *        .then(({ name, age }) => {
 *          validator
 *            .check('NAME_EXISTS', !!name, 'Name is required.')
 *            .check('NAME_IS_VALID', () => name.length >= 3, 'Name is invalid.');
 *          validator
 *            .check('AGE_EXISTS', age !== undefined, 'Age is required.')
 *            .check('AGE_IS_POSITIVE', () => age >= 0, 'Age can not be negative.');
 *        })
 *    );
 *  }
 *}
 *
 *const person: Person = {
 *  name: 'Hessamoddin',
 *  age: 34
 *};
 *
 *const validation = new PersonValidation(person);
 *
 *if (validation.ok) {
 *  // person data is valid.
 *}
 *```
 */
export default abstract class Validation<Badge extends string = string, $ extends $Base = {}> implements ValidationDescribed {
  readonly ok?: boolean;
  readonly $: $;
  readonly badges: readonly Badge[];
  readonly errors: { readonly [badge in Badge]?: string };
  readonly async: Promise<boolean>;
  readonly badgeFailureMessages: BadgeFailureMessages;

  /**
   * The default error messages for failed badge of all validation classes globally.
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
   *```typescript
   *Validation.defaultBadgeFailureMessages = {
   *  NAME_IS_VALID: 'Name is invalid.',
   *  '*_IS_VALID': 'This field is invalid.',
   *  'NAME_*': 'Name has a problem.',
   *  '*': 'The form data is not acceptable.'
   *};
   *```
   */
  static defaultBadgeFailureMessages: BadgeFailureMessages = {};

  private readonly internal!: Internal<Badge, $>;

  /**
   * Defines the validation; in other words, how to validate.
   *
   * --------------------------------
   * Example:
   *
   *```typescript
   *class DataValidation extends Validation {
   *  constructor(data: Data, previousDataValidation?: DataValidation) {
   *
   *    // Only validate data:
   *    super(validator => {... validate the data ...});
   *
   *    // Validate data based on the previous validation:
   *    super(
   *      validator => {... validate the data ...},
   *      previousDataValidation
   *    );
   *
   *    // Validate data using a predefined badgeFailureMessages:
   *    super(
   *      validator => {... validate the data ...},
   *      badgeFailureMessages
   *    );
   *
   *    // Validate data based on the previous validation using a predefined badgeFailureMessages:
   *    super(
   *      validator => {... validate the data ...},
   *      previousDataValidation,
   *      badgeFailureMessages
   *    );
   *
   *  }
   *}
   *```
   * --------------------------------
   * @param validate The validation body to validate data. Provides the `validator` parameter to be used to validate data.
   * @param previousValidation Optional, the previous instance of the validation.
   * @param badgeFailureMessages Optional, the default error messages for the failed badges of this validation.
   * @see `Validation.defaultBadgeFailureMessages` static property.
   */
  protected constructor(validate: (validator: ValidatorSeed<Badge, $>) => void, badgeFailureMessages?: BadgeFailureMessages);
  protected constructor(
    validate: (validator: ValidatorSeed<Badge, $>) => void,
    previousValidation?: Validation<Badge, $>,
    badgeFailureMessages?: BadgeFailureMessages
  );
  protected constructor(...parameters: any[]) {
    let validate: (validator: ValidatorSeed<Badge, $>) => void,
      previousValidation: Validation<Badge, $> | undefined,
      badgeFailureMessages: BadgeFailureMessages | undefined;
    if (parameters[1] instanceof Validation) {
      [validate, previousValidation, badgeFailureMessages] = parameters;
    } else if (!parameters[2]) {
      [validate, badgeFailureMessages] = parameters;
      previousValidation = undefined;
    } else {
      validate = parameters[0];
      previousValidation = undefined;
      badgeFailureMessages = parameters[2];
    }

    this.ok = true;
    this.$ = {} as $;
    this.badges = [];
    this.errors = {};

    this.badgeFailureMessages = badgeFailureMessages || {};

    this.async = new Promise((resolve, reject) => {
      const internal: Internal<Badge, $> = ((this as any).internal = {
        counter: 0,
        invalidate: () => ((this as { ok: boolean }).ok = false),
        badges: this.badges as Badge[],
        errors: this.errors as { [badge in Badge]?: string },
        $: this.$,
        $paths: [],
        badgeFailureMessages: this.badgeFailureMessages,
        chains: {},
        openedChains: [],
        closedChains: [],
        currentChain: undefined,
        done: false,
        promises: {},
        resolve: () => {
          if (internal.done) return;
          internal.done = true;
          resolve(this.ok);
        },
        reject: (reason: any) => {
          if (internal.done) return;
          internal.done = true;
          delete (this as any).ok;
          reject(reason);
        }
      });
      previousValidation &&
        (Object.keys(previousValidation.internal.chains)
          .filter(name => !previousValidation!.internal.openedChains.includes(name) || previousValidation!.internal.closedChains.includes(name))
          .forEach(name => (internal.chains[name] = previousValidation!.internal.chains[name])),
        previousValidation.dispose());
    });

    const internal = this.internal;

    try {
      validate(new ValidatorBase(internal) as any);
    } catch (error) {
      internal.done = true;
      delete (this as any).ok;
      throw error;
    }

    (function handlePromises() {
      const promises = Object.values(internal.promises);
      if (promises.length === 0) return internal.resolve();
      internal.promises = {};
      return Promise.all(promises).then(handlePromises, internal.reject);
    })();
  }

  get failedBadges(): readonly Badge[] {
    return Object.keys(this.errors) as Badge[];
  }

  has(...badges: Badge[]): boolean {
    return badges.every(b => this.badges.includes(b));
  }

  messages(...badgeGlobs: string[]): string[] {
    const result: string[] = [];
    const failedBadges = badgeGlobs.length ? Object.keys(this.errors).filter(b => badgeGlobs.some(g => matchBadgeGlob(b, g))) : Object.keys(this.errors);
    failedBadges.forEach(b => this.errors[b] && (result.includes(this.errors[b]) || result.push(this.errors[b])));
    return result;
  }

  message(...badgeGlobs: string[]): string | undefined {
    const failedBadges = badgeGlobs.length ? Object.keys(this.errors).filter(b => badgeGlobs.some(g => matchBadgeGlob(b, g))) : Object.keys(this.errors);
    for (const i in failedBadges) if (this.errors[failedBadges[i]]) return this.errors[failedBadges[i]];
    return undefined;
  }

  throw(defaultMessage?: string): void {
    if (this.ok) return;
    let message = this.message();
    if (message) throw new Error(message);
    traverse$(this.$, validation => ((message = validation.message()), !!message));
    if (message) throw new Error(message);
    throw new Error(defaultMessage || '');
  }

  dispose(reason: any = 'disposed'): void {
    if (this.internal.done) return;
    this.internal.done = true;
    this.internal.reject(reason);
  }
}
