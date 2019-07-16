import Validation from './Validation';
import { getBadgeMessage } from './utils';

interface AsyncHandler {
  promise: Promise<any>;
  chain: {
    method: string;
    args: any[];
  }[];
}

export default class Validator<Badge extends string, Structure extends {} = {}> {
  private readonly validation: Validation<Badge, Structure>;
  private readonly invalidate: () => void;
  private readonly badges: Badge[];
  private readonly errors: { [badge in Badge]?: string };
  private readonly blackhole: this;
  private readonly asyncHandlers: AsyncHandler[];
  private asyncDone: boolean;
  private asyncResolve!: (value?: any) => void;
  private asyncReject!: (reason?: any) => void;

  constructor(
    validation: Validation<Badge, Structure>,
    invalidate: () => void,
    badges: Badge[],
    errors: { [badge in Badge]?: string },
    consumeAsyncSetup: (providedAsyncSetup: (resolve: (value?: any) => void, reject: (reason?: any) => void) => void) => void
  ) {
    const me = this;
    this.validation = validation;
    this.invalidate = invalidate;
    this.badges = badges;
    this.errors = errors;
    this.blackhole = new Proxy(
      {},
      {
        get: (target, property, receiver) => {
          if (property === 'end') return () => undefined;
          if (property === 'else')
            return (task?: () => void) => {
              task && task();
              return me;
            };
          return () => me.blackhole;
        }
      }
    ) as this;
    this.asyncHandlers = [];
    this.asyncDone = false;
    consumeAsyncSetup((resolve, reject) => {
      this.asyncResolve = resolve;
      this.asyncReject = reject;
      if (this.asyncHandlers.length) return;
      this.asyncDone = true;
      this.asyncResolve();
    });
  }

  /**
   * Blocks a validation chain iff this validation does not satisfy some of the given badges.
   * @param requiredBadges Badges or badge arrays.
   */
  when(...requiredBadges: Badge[]): this {
    if (requiredBadges.length === 0) return this;
    if (this.validation.has(requiredBadges[0], ...requiredBadges.slice(1))) return this;
    this.invalidate();
    return this.blackhole;
  }
  must(...conditions: (boolean | (() => boolean))[]): this {
    for (let i = 0; i < conditions.length; ++i) {
      const condition = conditions[i];
      if (typeof condition === 'function' ? !condition() : !condition) {
        this.invalidate();
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

  check(badge: Badge, validity: boolean | (() => boolean), message?: string): this {
    if (typeof validity === 'function' ? validity() : validity) {
      this.badges.includes(badge) || this.badges.push(badge);
      return this;
    }
    this.errors[badge] =
      this.errors[badge] || message || getBadgeMessage(badge, this.validation.badgeFailureMessages, Validation.defaultBadgeFailureMessages) || '';
    this.invalidate();
    return this.blackhole;
  }
  earn(badge: Badge): this {
    this.badges.includes(badge) || this.badges.push(badge);
    return this;
  }
  fail(badge: Badge, message?: string): this {
    this.errors[badge] =
      this.errors[badge] || message || getBadgeMessage(badge, this.validation.badgeFailureMessages, Validation.defaultBadgeFailureMessages) || '';
    this.invalidate();
    return this;
  }

  object<T extends any = any>(target: T) {
    const validator = this;
    if (target && typeof target === 'object' && !Array.isArray(target))
      return {
        do(task: (target: T) => void) {
          task(target);
          return validator as Validator<Badge, Structure>;
        }
      };
    this.invalidate();
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
          return validator as Validator<Badge, Structure>;
        }
      };
    this.invalidate();
    return {
      each() {
        return validator.blackhole;
      }
    };
  }

  into(root: keyof Structure, ...path: (string | number)[]) {
    path.unshift(root as string | number); //TODO: Consider symbols here too.
    const validator = this;
    return {
      set(validation: Validation<any> | (() => Validation<any>)): Validator<Badge, Structure> {
        const validationInstance = typeof validation === 'function' ? validation() : validation;
        set$(validationInstance);
        if (validationInstance.ok) return validator;
        validator.invalidate();
        return validator.blackhole;
      },
      put(value: any | (() => any)): Validator<Badge, Structure> {
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

  await(promise: Promise<any> | (() => Promise<any>)): this {
    const asyncHandler: AsyncHandler = {
      promise: (typeof promise === 'function' ? promise() : promise)
        .then(() => {
          if (this.asyncDone) return;
          let validator = this as any;
          asyncHandler.chain.forEach(ring => (validator = validator[ring.method](...ring.args)));
          this.asyncHandlers.splice(this.asyncHandlers.indexOf(asyncHandler), 1);
          if (this.asyncHandlers.length) return;
          this.asyncDone = true;
          this.asyncResolve();
        })
        .catch(reason => {
          this.invalidate();
          if (this.asyncDone) return;
          this.asyncDone = true;
          this.asyncReject(reason);
        }),
      chain: []
    };
    this.asyncHandlers.push(asyncHandler);
    const chainRedirector = new Proxy(
      {},
      {
        get: (target, property, receiver) => {
          if (property === 'end') return () => undefined;
          return (...args: any[]) => {
            asyncHandler.chain.push({
              method: String(property),
              args
            });
            return chainRedirector;
          };
        }
      }
    ) as this;
    return chainRedirector;
  }

  end(): undefined {
    return undefined;
  }
}
