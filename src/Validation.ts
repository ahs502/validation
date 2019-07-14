import Badge, { Message, BadgeFailureMessages } from './Badge';
import Validator from './Validator';

export default class Validation<K extends string, D extends {} = {}> {
  ok: boolean;
  readonly $: D;
  readonly badges: Badge<K>[];
  readonly failedBadges: Badge<K>[];
  private readonly badgeFailureMessages: BadgeFailureMessages;

  protected constructor(validation: (validator: Validator<K, D>, validation: Validation<K, D>) => void, badgeFailureMessages: BadgeFailureMessages = {}) {
    this.ok = true;
    this.$ = {} as D;
    this.badges = [];
    this.failedBadges = [];
    this.badgeFailureMessages = badgeFailureMessages;

    validation(new Validator(this), this);
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
   * Returns true iff this validation satisfies all the given badges.
   * @param badges The badges to be checked.
   */
  has(...badges: K[]): boolean {
    return badges.every(badge => this.badges.some(b => (typeof b === 'string' ? b === badge : b.badge === badge)));
  }

  /**
   * Returns the list of all error messages of this validation,
   * with respect to the given badges or badge globs if provided.
   * @param badges Optional, the badges or badge globs which the method is going to
   * return messages for. It can be a badge name, a * character followed by a badge postfix,
   * a badge prefix followed by a * character or a * character alone (default, all badges)
   */
  errors(...badges: (K | string)[]): readonly Message[] {
    return (badges.length
      ? this.failedBadges.filter(b => {
          const bb = typeof b === 'string' ? b : b.badge;
          return badges.some(badge => matchBadgeGlob(bb, badge));
        })
      : this.failedBadges
    )
      .map(b => {
        if (typeof b === 'object') return b.message;
        return tryToFindIn(b, this.badgeFailureMessages) || tryToFindIn(b, Validation.defaultBadgeFailureMessages) || ''; // || `Failed @ ${b}`;
      })
      .filter(Boolean);

    function matchBadgeGlob(badge: string, badgeGlob: string): boolean {
      return (
        badgeGlob === badge ||
        (badgeGlob.startsWith('*') && badge.endsWith(badgeGlob.slice(1))) ||
        (badgeGlob.endsWith('*') && badge.startsWith(badgeGlob.slice(0, -1))) ||
        badgeGlob === '*'
      );
    }
    function tryToFindIn(badge: K, badgeFailureMessages: BadgeFailureMessages): string | undefined {
      const badgeGlobs = Object.keys(badgeFailureMessages);
      for (let i = 0; i < badgeGlobs.length; ++i) if (matchBadgeGlob(badge, badgeGlobs[i])) return badgeFailureMessages[badgeGlobs[i]];
      return undefined;
    }
  }

  /**
   * Throws an exception iff this validation does not passes deeply.
   * @param defaultMessage The default error message to be thrown iff
   * the validation is not ok but there exists no messages on any failed badge.
   */
  throw(defaultMessage?: string): void {
    if (this.ok) return;
    let messages = this.errors();
    if (messages.length) throw messages[0];
    this.traverse(validation => ((messages = validation.errors()), messages.length > 0));
    if (messages.length) throw messages[0];
    throw defaultMessage || '';
  }
}
