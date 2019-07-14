import Validation from './Validation';
import Badge from './Badge';

export default class Validator<K extends string, D extends {} = {}> {
  private readonly validation: Validation<K, D>;
  private readonly blackhole: this;

  constructor(validation: Validation<K, D>) {
    const me = this;
    this.validation = validation;
    this.blackhole = new Proxy(
      {},
      {
        get: (target, property, receiver) => {
          if (property === 'else')
            return (task?: () => void) => {
              task && task();
              return me;
            };
          return () => me.blackhole;
        }
      }
    ) as this;
  }

  /**
   * Blocks a validation chain iff this validation does not satisfy some of the given badges.
   * @param requiredBadges Badges or badge arrays.
   */
  when(...requiredBadges: (K | K[])[]): this {
    if (!requiredBadges.some(b => !(Array.isArray(b) ? this.validation.has(...b) : this.validation.has(b)))) return this;
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
  else(task?: () => void): this {
    // Just bypass task by definition!
    return this.blackhole;
  }
  then(task: () => void): this {
    task();
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

  object<T extends any = any>(target: T) {
    const validator = this;
    if (target && typeof target === 'object' && !Array.isArray(target))
      return {
        do(task: (target: T) => void) {
          task(target);
          return validator as Validator<K, D>;
        }
      };
    this.validation.ok = false;
    return {
      do() {
        return validator.blackhole;
      }
    };
  }
  array<A extends any = any>(target: A) {
    const validator = this;
    if (target && Array.isArray(target))
      return {
        each(task: (item: A extends readonly (infer T)[] ? T : any, index: number) => void) {
          target.forEach(task);
          return validator as Validator<K, D>;
        }
      };
    this.validation.ok = false;
    return {
      each() {
        return validator.blackhole;
      }
    };
  }

  into(root: keyof D, ...path: (string | number)[]) {
    path.unshift(root as string | number); //TODO: Consider symbols here too.
    const validator = this;
    return {
      set(validation: Validation<any> | (() => Validation<any>)): Validator<K, D> {
        const validationInstance = typeof validation === 'function' ? validation() : validation;
        set$(validationInstance);
        if (validationInstance.ok) return validator;
        validator.validation.ok = false;
        return validator.blackhole;
      },
      put(value: any | (() => any)): Validator<K, D> {
        set$(typeof value === 'function' ? value() : value);
        return validator;
      }
    };

    function set$(value: any) {
      let $ = validator.validation.$ as any;
      path.slice(0, -1).forEach((property, index) => {
        if (!$[property]) {
          const nextProperty = path[index + 1];
          $[property] = typeof nextProperty === 'number' ? [] : {};
        }
        $ = $[property];
      });
      $[path[path.length - 1]] = value;
    }
  }

  // await(promise: Promise<any> | (() => Promise<any>)): this {}
}
