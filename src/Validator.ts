import Validation from './Validation';
import { Badge } from './Badge';

export default class Validator<K extends string, D extends {} = {}> {
  readonly data: D;
  private readonly validation: Validation<K, D>;
  private readonly blackhole: this;
  private target: any;
  private path: (string | number)[];

  constructor(validation: Validation<K, D>) {
    const me = this;
    this.data = validation.data;
    this.validation = validation;
    this.blackhole = new Proxy({}, { get: () => () => me.blackhole }) as this;
    this.target = undefined;
    this.path = [];
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
  if(...conditions: (boolean | (() => boolean))[]): this {
    for (let i = 0; i < conditions.length; ++i) {
      const condition = conditions[i];
      if (typeof condition === 'function' ? !condition() : !condition) {
        this.validation.ok = false;
        return this.blackhole;
      }
    }
    return this;
  }

  object(target: any): this {
    this.target = target;
    if (target && typeof target === 'object') return this;
    this.validation.ok = false;
    return this.blackhole;
  }
  do(task: (target: any) => void): this {
    task(this.target);
    return this;
  }
  array(target: any): this {
    this.target = target;
    if (target && Array.isArray(target)) return this;
    this.validation.ok = false;
    return this.blackhole;
  }
  for(task: (item: any, index: number) => void): this {
    (this.target as any[]).forEach(task);
    return this;
  }
  optional(target: any): this {
    this.target = target;
    if (target) return this;
    return this.blackhole;
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
  also(badge: Badge<K>): this {
    this.validation.badges.push(badge);
    return this;
  }
  in(...path: (string | number)[]): this {
    this.path = path;
    return this;
  }
  set(validation: Validation<any> | (() => Validation<any>)): this {
    const validationObject = typeof validation === 'function' ? validation() : validation;
    let data = this.validation.data as any;
    this.path.slice(0, -1).forEach((property, index) => {
      if (!data[property]) {
        const nextProperty = this.path[index + 1];
        data[property] = typeof nextProperty === 'number' ? [] : {};
      }
      data = data[property];
    });
    data[this.path[this.path.length - 1]] = validationObject;
    if (validationObject.ok) return this;
    this.validation.ok = false;
    return this.blackhole;
  }
}
