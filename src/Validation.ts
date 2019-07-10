import Badge, { Message, BadgeFailureMessages } from './Badge';
import Validator from './Validator';

export default class Validation<K extends string, D extends {} = {}> {
  ok: boolean;
  readonly data: D;
  readonly badges: Badge<K>[];
  readonly failedBadges: Badge<K>[];
  private readonly badgeFailureMessages: BadgeFailureMessages;

  protected constructor(validation: (validator: Validator<K, D>) => void, badgeFailureMessages: BadgeFailureMessages = {}) {
    this.ok = true;
    this.data = {} as D;
    this.badges = [];
    this.failedBadges = [];
    this.badgeFailureMessages = badgeFailureMessages;

    validation(new Validator(this));
  }

  static defaultBadgeFailureMessages: BadgeFailureMessages = {};

  /**
   * Traverses through all validations inside this.data structure.
   * @param task The task to be applied to all validations, should return true to break traversing.
   */
  private traverseData(task: (validation: Validation<any>) => boolean): void {
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
    })(this.data);
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
   * with respect to the given badges or badge prefixes if provided.
   * @param badges Optional, the badges or badge prefixes which the method is going to
   * return messages for. Badge prefixes end with a '*' character.
   */
  errors(...badges: (K | string)[]): readonly Message[] {
    const failedBadges = badges.length
      ? this.failedBadges.filter(b => {
          const bb = typeof b === 'string' ? b : b.badge;
          return badges.some(badge => (badge.endsWith('*') ? bb.startsWith(badge.slice(0, -1)) : bb === badge));
        })
      : this.failedBadges;
    return failedBadges
      .map(b => {
        if (typeof b === 'object') return b.message;
        return tryToFindIn(b, this.badgeFailureMessages) || tryToFindIn(b, Validation.defaultBadgeFailureMessages) || `Failed @ ${b}`;

        function tryToFindIn(badge: K, badgeFailureMessages: BadgeFailureMessages): string | undefined {
          const badgeGlobs = Object.keys(badgeFailureMessages);
          for (let i = 0; i < badgeGlobs.length; ++i) {
            const badgeGlob = badgeGlobs[i];
            if (
              badgeGlob === badge ||
              (badgeGlob.startsWith('*') && badge.endsWith(badgeGlob.slice(1))) ||
              (badgeGlob.endsWith('*') && badge.startsWith(badgeGlob.slice(0, -1))) ||
              badgeGlob === '*'
            )
              return badgeFailureMessages[badgeGlob];
          }
          return undefined;
        }
      })
      .filter(Boolean);
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
    this.traverseData(validation => ((messages = validation.errors()), messages.length > 0));
    if (messages.length) throw messages[0];
    throw defaultMessage || '';
  }
}

// /////////////////////////////////////////////////////////////

// interface A {
//   x: number;
//   y: number;
// }

// class AValidation extends Validation<'XVALID' | 'XPOSITIVE' | 'YVALID' | 'YPOSITIVE' | 'XLESSTHANY'> {
//   constructor(a: any) {
//     super(
//       validator => {
//         validator.object(a).do(({ x, y }) => {
//           validator.check({ badge: 'XVALID', message: 'Invalid.' }, typeof x === 'number').check({ badge: 'XPOSITIVE', message: 'Invalid.' }, () => x > 0);
//           validator.check({ badge: 'YVALID', message: 'Invalid.' }, typeof y === 'number').check({ badge: 'YPOSITIVE', message: 'Invalid.' }, () => y > 0);
//           validator.when('XPOSITIVE', 'YPOSITIVE').check({ badge: 'XLESSTHANY', message: 'Invalid.' }, () => x < y);
//         });
//       },
//       { XVALID: 'X is invalid.' }
//     );
//   }
// }

// /////////////////////////////////////////////////////////////

// interface B {
//   z: number;
//   a: A;
//   aa: A[];
//   o: {
//     oa?: A;
//     oaa: (A | undefined)[];
//   };
// }

// class BValidation extends Validation<
//   'ZVALID' | 'ZPOSITIVE' | 'ZMORETHANAXY' | 'ZMORETHANAAXONLY' | 'ZMORETHANOAXY' | 'ZMORETHANOAAXONLY',
//   {
//     a: AValidation;
//     aa: AValidation[];
//     o: {
//       oa?: AValidation;
//       oaa: (AValidation | undefined)[];
//     };
//   }
// > {
//   constructor(b: any) {
//     super(validator =>
//       validator.object(b).do(({ z, a, aa, o }) => {
//         validator.check({ badge: 'ZVALID', message: 'Invalid.' }, typeof z === 'number').check({ badge: 'ZPOSITIVE', message: 'Invalid.' }, () => z > 0);
//         validator
//           .object(a)
//           .in('a')
//           .set(() => new AValidation(a))
//           .when('ZPOSITIVE')
//           .check({ badge: 'ZMORETHANAXY', message: 'Invalid.' }, () => z > a.x && z > a.y);
//         validator
//           .array(aa)
//           .for((a, i) =>
//             validator
//               .object(a)
//               .in('aa', i)
//               .set(() => new AValidation(a))
//           )
//           .if(() => validator.data.aa.every(v => v.has('XPOSITIVE')))
//           .check({ badge: 'ZMORETHANAAXONLY', message: 'Invalid.' }, () => aa.every(a => z > a.x));
//         validator.object(o).do(({ oa, oaa }) => {
//           validator
//             .optional(oa)
//             .object(oa)
//             .in('o', 'oa')
//             .set(() => new AValidation(oa))
//             .when('ZPOSITIVE')
//             .check({ badge: 'ZMORETHANOAXY', message: 'Invalid.' }, () => z > oa.x && z > oa.y);
//           validator
//             .array(oaa)
//             .for((a, i) =>
//               validator
//                 .optional(a)
//                 .object(a)
//                 .in('o', 'oaa', i)
//                 .set(() => new AValidation(a))
//             )
//             .if(() => validator.data.o.oaa.filter(Boolean).every(v => v!.has('XPOSITIVE')))
//             .check({ badge: 'ZMORETHANOAAXONLY', message: 'Invalid.' }, () => oaa.every(a => z > a.x));
//         });
//       })
//     );
//   }
// }

// /////////////////////////////////////////////////////////////

// const a: any = {};
// const aValidation = new AValidation(a);
// aValidation.has('YPOSITIVE', 'XVALID');
// aValidation.ok;
// aValidation.errors();
// aValidation.errors('XLESSTHANY');
// aValidation.throwIfErrorsExist();

// /////////////////////////////////////////////////////////////

// const b: any = {};
// const bValidation = new BValidation(b);
// bValidation.data.o.oaa[3]!.has('XPOSITIVE');

// /////////////////////////////////////////////////////////////
