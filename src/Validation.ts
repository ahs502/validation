import IValidation from './types/IValidation';
import { $Base, BadgeFailureMessages, Internal } from './types/general';
import { matchBadgeGlob } from './utils';

export { BadgeFailureMessages } from './types/general';

/**
 * The generic base for every validation class.
 *
 * Defines by two optional types:
 * - `Badge`: The type of all *badge*s involved with this validation.
 *   Should extend `string`, by default is `string`, can also be `never` but
 *   usually is a **`string` literal type** listing all related badges.
 * - `$`: The type of the internal data structure used for nested
 *   complex data type validations. Should extend `{}` and by default is `{}`.
 *
 * --------------------------------
 * Example:
 *
 *    class StudentValidation extends Validation<
 *    | 'NAME_EXISTS',
 *    | 'NAME_IS_VALID',
 *    | 'AGE_EXISTS',
 *    | ...,
 *    {
 *      grades: GradeValidation[],
 *      courses: CourseValidation[]
 *    }> {
 *      constructor(student: Student) {
 *        super(validator => {
 *          // Validate the student data...
 *        });
 *      }
 *    }
 *
 *    const student: Student = ... ;
 *    const validation = new StudentValidation(student);
 *    if (validation.ok) {
 *      // student data is valid!
 *    }
 *
 */
export default abstract class Validation<Badge extends string = string, $ extends $Base = {}> implements IValidation<Badge, $> {
  readonly ok: boolean;
  readonly $: $;
  readonly badges: readonly Badge[];
  readonly errors: { readonly [badge in Badge]?: string };
  readonly async: Promise<any>;
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
   *    Validation.defaultBadgeFailureMessages = {
   *      NAME_IS_VALID: 'Name is invalid.',
   *      '*_IS_VALID': 'This field is invalid.',
   *      'NAME_*': 'Name has a problem.',
   *      '*': 'The form data is not acceptable.'
   *    };
   */
  static defaultBadgeFailureMessages: BadgeFailureMessages = {};

  private readonly internal!: Internal<Badge, $>;

  protected constructor(...parameters: any[]) {
    let validate: (validator: Validator<Badge, $>, validation: Validation<Badge, $>) => void,
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
      ((this as unknown) as { internal: Internal<Badge, $> }).internal = {
        validation: this,
        invalidate: () => ((this as { ok: boolean }).ok = false),
        badges: this.badges as Badge[],
        errors: this.errors as { [badge in Badge]?: string },
        chains: previousValidation ? previousValidation.internal.chains : {},
        openedChains: [],
        closedChains: [],
        pendingHandlers: [],
        asyncHandlers: [],
        asyncDone: false,
        asyncResolve: resolve,
        asyncReject: reject
      };
      previousValidation &&
        (previousValidation.internal.openedChains
          .filter(name => !previousValidation!.internal.closedChains.includes(name))
          .forEach(name => delete this.internal.chains[name]),
        previousValidation.dispose());

      validate(new Validator(this.internal), this);

      if (!this.internal.asyncHandlers.length) {
        this.internal.asyncDone = true;
        this.internal.asyncResolve();
      }
    });
  }

  /**
   * Traverses through all validations inside `this.$` data structure.
   *
   * --------------------------------
   * @param task The task to be applied to all validations, may return `true` to break traversing.
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
    if (message) throw message;
    this.traverse(validation => ((message = validation.message()), !!message));
    if (message) throw message;
    throw defaultMessage || '';
  }

  dispose(message: string = 'disposed'): void {
    if (this.internal.asyncDone) return;
    this.internal.asyncDone = true;
    this.internal.asyncReject(message);
  }
}

export class StructuralValidation<$ extends {} = {}> extends Validation<'', $> {}
