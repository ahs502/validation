import Validation from './Validation';
import { Badge } from './Badge';

export default class Validator<K extends string, D extends {} = {}> {
  readonly data: D;
  private readonly validation: Validation<K, D>;
  private readonly blackhole: this;

  constructor(validation: Validation<K, D>) {
    const me = this;
    this.data = validation.data;
    this.validation = validation;
    this.blackhole = new Proxy({}, { get: () => () => me.blackhole }) as this;
  }

  /**
   * Returns true iff this validation satisfies all the given badges.
   * @param badges The badges to be checked.
   */
  has(...badges: K[]): boolean {
    return this.validation.has(...badges);
  }

  /**
   * Blocks a validation chain iff this validation does not satisfy some of the given badges.
   * @param requiredBadges Badges or badge arrays.
   */
  when(...requiredBadges: (K | K[])[]): this {
    if (!requiredBadges.some(b => !(Array.isArray(b) ? this.has(...b) : this.has(b)))) return this;
    this.validation.ok = false;
    return this.blackhole;
  }
  must(...conditions: (boolean | (() => boolean))[]): this {
    for (let i = 0; i < conditions.length; ++i) {
      const condition = conditions[i];
      if (typeof condition === 'function' ? !condition() : !condition) {
        this.validation.ok = false;
        return this.blackhole;
      }
    }
    return this;
  }
  if(...conditions: (boolean | (() => boolean))[]): this {
    for (let i = 0; i < conditions.length; ++i) {
      const condition = conditions[i];
      if (typeof condition === 'function' ? !condition() : !condition) return this.blackhole;
    }
    return this;
  }

  check(badge: Badge<K>, validity: boolean | (() => boolean)): this {
    if (typeof validity === 'function' ? validity() : validity) {
      this.validation.badges.push(badge);
      return this;
    }
    this.validation.ok = false;
    this.validation.failedBadges.push(badge);
    return this.blackhole;
  }
  earn(badge: Badge<K>): this {
    this.validation.badges.push(badge);
    return this;
  }
  fail(badge: Badge<K>): this {
    this.validation.ok = false;
    this.validation.failedBadges.push(badge);
    return this;
  }

  object<T extends any = any>(target: T): { do(task: (target: T) => void): Validator<K, D> } {
    const validator = this;
    if (target && typeof target === 'object' && !Array.isArray(target))
      return {
        do(task: (target: T) => void) {
          task(target);
          return validator;
        }
      };
    this.validation.ok = false;
    return {
      do(task: (target: T) => void) {
        return validator.blackhole;
      }
    };
  }
  array<A extends any = any>(target: A): { each(task: (item: A extends (infer T)[] ? T : any, index: number) => void): Validator<K, D> } {
    const validator = this;
    if (target && Array.isArray(target))
      return {
        each(task: (item: any, index: number) => void) {
          target.forEach(task);
          return validator;
        }
      };
    this.validation.ok = false;
    return {
      each(task: (item: any, index: number) => void) {
        return validator.blackhole;
      }
    };
  }

  into(...path: (string | number)[]) {
    if (path.length === 0) throw 'The path can not be empty.';
    if (typeof path[0] !== 'string') throw 'The first argument in the path should be a string.';
    const validator = this;
    return {
      set(validation: Validation<any> | (() => Validation<any>)): Validator<K, D> {
        const validationInstance = typeof validation === 'function' ? validation() : validation;
        let data = validator.validation.data as any;
        path.slice(0, -1).forEach((property, index) => {
          if (!data[property]) {
            const nextProperty = path[index + 1];
            data[property] = typeof nextProperty === 'number' ? [] : {};
          }
          data = data[property];
        });
        data[path[path.length - 1]] = validationInstance;
        if (validationInstance.ok) return validator;
        validator.validation.ok = false;
        return validator.blackhole;
      }
    };
  }
}
