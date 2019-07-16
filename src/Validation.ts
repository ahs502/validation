import Validator from './Validator';
import { BadgeFailureMessages, matchBadgeGlob } from './utils';

export { BadgeFailureMessages } from './utils';

export default class Validation<Badge extends string = string, Structure extends {} = {}> {
  /**
   * The overall validity status.
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
   */
  readonly ok: boolean;

  /**
   * The internal data structure used for nested validation for complext data.
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
   */
  readonly $: Structure;

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
   */
  readonly badges: readonly Badge[];

  readonly errors: { readonly [badge in Badge]?: string };

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
   */
  readonly async: Promise<any>;

  readonly badgeFailureMessages: BadgeFailureMessages;

  protected constructor(
    validate: (validator: Validator<Badge, Structure>, validation: Validation<Badge, Structure>) => void,
    badgeFailureMessages: BadgeFailureMessages = {}
  ) {
    this.ok = true;
    this.$ = {} as Structure;
    this.badges = [];
    this.errors = {};

    this.badgeFailureMessages = badgeFailureMessages;

    let asyncSetup: (resolve: (value?: any) => void, reject: (reason?: any) => void) => void;
    const validator = new Validator(
      this,
      () => ((this as { ok: boolean }).ok = false),
      this.badges as Badge[],
      this.errors as { [badge in Badge]?: string },
      providedAsyncSetup => (asyncSetup = providedAsyncSetup)
    );
    validate(validator, this);
    this.async = new Promise(asyncSetup!);
  }

  static defaultBadgeFailureMessages: BadgeFailureMessages = {};

  /**
   * Traverses through all validations inside this.$ structure.
   * @param task The task to be applied to all validations, should return true to break traversing.
   */
  private traverse(task: (validation: Validation<any>) => boolean): void {
    (function traverseItem(item: any): boolean {
      if (!item) return false;
      if (item instanceof Validation) return task(item);
      if (Array.isArray(item)) {
        for (let index = 0; index < item.length; ++index) {
          if (traverseItem(item[index])) return true;
        }
      } else if (typeof item === 'object') {
        for (const key in item) {
          if (traverseItem(item[key])) return true;
        }
      }
      return false;
    })(this.$);
  }

  /**
   * The list of all badges failed to earn during validation process.
   *
   * Having any failed badges means validation fails as well or `validation.ok === false`, but not vice versa.
   *
   * It may get updated through time until asynchronous validation steps are completed and
   * finally finds its final value after `validation.async` promise is resolved or rejected.
   *
   * --------------------------------
   * Example:
   *
   *    const validation = new DataValidation(data);
   *    validation.failedBadges.forEach(b => console.log(`Badge ${b} failed.`));
   */
  get failedBadges(): readonly Badge[] {
    return Object.keys(this.errors) as Badge[];
  }

  /**
   * Returns true iff this validation satisfies all the given badges.
   * @param badges The badges to be checked.
   */
  has(badge: Badge, ...badges: Badge[]): boolean {
    return badges.concat(badge).every(b => this.badges.includes(b));
  }

  // /**
  //  * Returns the list of all error messages of this validation,
  //  * with respect to the given badges or badge globs if provided.
  //  * @param badges Optional, the badges or badge globs which the method is going to
  //  * return messages for. It can be a badge name, a * character followed by a badge postfix,
  //  * a badge prefix followed by a * character or a * character alone (default, all badges)
  //  */
  // errors(...badges: (Badge | string)[]): readonly string[] {
  //   return (badges.length
  //     ? this.failedBadges.filter(b => {
  //         const bb = typeof b === 'string' ? b : b.badge;
  //         return badges.some(badge => matchBadgeGlob(bb, badge));
  //       })
  //     : this.failedBadges
  //   )
  //     .map(b => {
  //       if (typeof b === 'object') return b.message;
  //       return tryToFindIn(b, this.badgeFailureMessages) || tryToFindIn(b, Validation.defaultBadgeFailureMessages); // || `Failed @ ${b}`;
  //     })
  //     .filter(Boolean) as readonly Message[];

  //   function matchBadgeGlob(badge: Badge, badgeGlob: string): boolean {
  //     return (
  //       badgeGlob === badge ||
  //       (badgeGlob.startsWith('*') && badge.endsWith(badgeGlob.slice(1))) ||
  //       (badgeGlob.endsWith('*') && badge.startsWith(badgeGlob.slice(0, -1))) ||
  //       badgeGlob === '*'
  //     );
  //   }
  //   function tryToFindIn(badge: Badge, badgeFailureMessages: BadgeFailureMessages): Message | undefined {
  //     const badgeGlobs = Object.keys(badgeFailureMessages);
  //     for (let i = 0; i < badgeGlobs.length; ++i) if (matchBadgeGlob(badge, badgeGlobs[i])) return badgeFailureMessages[badgeGlobs[i]];
  //     return undefined;
  //   }
  // }

  messages(...badgeGlobs: string[]): string[] {
    const result: string[] = [];
    const failedBadges = badgeGlobs.length ? Object.keys(this.errors).filter(b => badgeGlobs.some(g => matchBadgeGlob(b, g))) : Object.keys(this.errors);
    failedBadges.forEach(b => result.includes(this.errors[b]!) || result.push(this.errors[b]!));
    return result;
  }
  message(...badgeGlobs: string[]): string | undefined {
    const failedBadges = badgeGlobs.length ? Object.keys(this.errors).filter(b => badgeGlobs.some(g => matchBadgeGlob(b, g))) : Object.keys(this.errors);
    for (const i in failedBadges) if (this.errors[failedBadges[i]]) return this.errors[failedBadges[i]];
    return undefined;
  }

  /**
   * Throws an exception iff this validation does not passes deeply.
   * @param defaultMessage The default error message to be thrown iff
   * the validation is not ok but there exists no messages on any failed badge.
   */
  throw(defaultMessage?: string): void {
    if (this.ok) return;
    let message = this.message();
    if (message) throw message;
    this.traverse(validation => ((message = validation.message()), !!message));
    if (message) throw message;
    throw defaultMessage || '';
  }
}
