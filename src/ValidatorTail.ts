import { $Base, $Path, set$, get$ } from './utils/$';
import Internal from './utils/Internal';
import Chain from './utils/Chain';
import { getBadgeFailureMessage } from './utils/BadgeFailureMessages';
import Validator from './interfaces/Validator';
import Validation from './Validation';

export default class ValidatorTail<Badge extends string, $ extends $Base, Data> /*implements Validator<Badge, $, Data>*/ {
  private index: number;
  private data: Data = undefined as any;
  private unsafe: boolean | undefined = undefined;
  private promise?: Promise<void>;
  private bypass?: boolean;
  private chain?: Chain<Badge>;

  constructor(private readonly internal: Internal<Badge, $>, private readonly original: boolean = false) {
    this.index = internal.counter++;
    this.chain = internal.currentChain;
  }

  with<T>(target: T | Promise<T>): ValidatorTail<Badge, $, T> {
    if (this.internal.done || (this.unsafe === false && (this.unsafe = true), this.bypass)) return this as any;

    const validator = this;

    function action(target: T): void {
      validator.data = target as any;
    }

    this.asynchronize(() =>
      this.wrapInternalCurrentChain(() => (target instanceof Promise ? target.then(data => this.internal.done || action(data)) : action(target)))
    );

    return this as any;
  }

  then<T>(task: (data: Data) => T | Promise<T> | ValidatorTail<Badge, $, T>): ValidatorTail<Badge, $, T> {
    if (this.internal.done || (this.unsafe === false && (this.unsafe = true), this.bypass)) return this as any;

    const validator = this;

    function action(data: T): void {
      validator.data = data as any;
    }

    this.asynchronize(() => {
      const result = this.wrapInternalCurrentChain(() => task(this.data));
      if (result instanceof ValidatorTail) return result.provideFor(action);
      if (result instanceof Promise) return result.then(action);
      action(result);
    });

    return this as any;
  }

  do<T>(task: (...portions: any[]) => T | Promise<T> | ValidatorTail<Badge, $, T>): ValidatorTail<Badge, $, T> {
    if (this.internal.done || (this.unsafe === false && (this.unsafe = true), this.bypass)) return this as any;

    const validator = this;

    function action(data: T): void {
      validator.data = data as any;
    }

    this.asynchronize(() => {
      if (!this.data || !Array.isArray(this.data)) throw new Error('Can not iterate on empty or non-array objects.');
      const args = this.data;
      const result = this.wrapInternalCurrentChain(() => task(...args));
      if (result instanceof ValidatorTail) return result.provideFor(action);
      if (result instanceof Promise) return result.then(action);
      action(result);
    });

    return this as any;
  }

  each<T>(
    task: Data extends readonly (infer I)[] ? (item: I, index: number, data: Data) => T | Promise<T> | ValidatorTail<Badge, $, T> : never
  ): ValidatorTail<Badge, $, T[]> {
    if (this.internal.done || (this.unsafe === false && (this.unsafe = true), this.bypass)) return this as any;

    const validator = this;

    function action(data: T[]): void {
      validator.data = data as any;
    }

    this.asynchronize(() => {
      if (!this.data || !Array.isArray(this.data)) throw new Error('Can not iterate on empty or non-array objects.');
      const result = this.data.map((item, index) => {
        const r = this.wrapInternalCurrentChain(() => task(item, index, this.data));
        if (r instanceof ValidatorTail) return r.provide();
        return r;
      });
      if (result.every(r => !(r instanceof Promise))) return action(result as any);
      return Promise.all(result.map(r => (r instanceof Promise ? r : Promise.resolve(r)))).then(action);
    });

    return this as any;
  }

  after<T>(
    ...targets: (T | Promise<T> | ValidatorTail<Badge, $, T> | ((data: Data) => T | Promise<T> | ValidatorTail<Badge, $, T>))[]
  ): ValidatorTail<Badge, $, T[]> {
    if (this.internal.done || (this.unsafe === false && (this.unsafe = true), this.bypass)) return this as any;

    const validator = this;

    function action(...targets: T[]): void {
      validator.data = targets as any;
    }

    this.asynchronize(() => {
      const result = this.wrapInternalCurrentChain(() =>
        targets.map(target => {
          const r = typeof target === 'function' ? (target as (data: Data) => T | Promise<T> | ValidatorTail<Badge, $, T>)(validator.data) : target;
          if (r instanceof ValidatorTail) return r.provide();
          return r;
        })
      );
      if (result.every(r => !(r instanceof Promise))) return action(...(result as any));
      return Promise.all(result.map(r => (r instanceof Promise ? r : Promise.resolve(r)))).then(finalResult => action(...finalResult));
    });

    return this as any;
  }

  object<T = Data>(target: T | Promise<T>): ValidatorTail<Badge, $, T> {
    if (this.internal.done || (this.unsafe === false && (this.unsafe = true), this.unsafe === undefined && (this.unsafe = false), this.bypass))
      return this as any;

    const validator = this;

    function action(target: any): void {
      validator.data = target;
      if (!target /* || typeof target !== 'object' || Array.isArray(target) */ || target.__proto__ !== Object.prototype) {
        validator.internal.invalidate();
        validator.chain && (validator.chain.effects.invalidates = true);
        validator.bypass = true;
      }
    }

    this.asynchronize(() =>
      this.wrapInternalCurrentChain(() => (target instanceof Promise ? target.then(data => this.internal.done || action(data)) : action(target)))
    );

    return this as any;
  }

  array<T = Data>(target: T | Promise<T>): ValidatorTail<Badge, $, T> {
    if (this.internal.done || (this.unsafe === false && (this.unsafe = true), this.unsafe === undefined && (this.unsafe = false), this.bypass))
      return this as any;

    const validator = this;

    function action(target: any): void {
      validator.data = target;
      if (!target || !Array.isArray(target)) {
        validator.internal.invalidate();
        validator.chain && (validator.chain.effects.invalidates = true);
        validator.bypass = true;
      }
    }

    this.asynchronize(() =>
      this.wrapInternalCurrentChain(() => (target instanceof Promise ? target.then(data => this.internal.done || action(data)) : action(target)))
    );

    return this as any;
  }

  check(badge: Badge, validity: boolean | ((data: Data) => boolean), message?: string | ((data: Data) => string)): ValidatorTail<Badge, $, Data> {
    if (this.internal.done || (this.unsafe === undefined && (this.unsafe = false), this.bypass)) return this as any;

    const validator = this;

    function action(badge: Badge, validity: boolean | ((data: Data) => boolean), message?: string | ((data: Data) => string)): void {
      if (typeof validity === 'function' ? validity(validator.data) : validity) {
        validator.internal.badges.includes(badge) || validator.internal.badges.push(badge);
        validator.chain && (validator.chain.effects.badges.includes(badge) || validator.chain.effects.badges.push(badge));
        return;
      }
      validator.internal.errors[badge] =
        validator.internal.errors[badge] ||
        (message && (typeof message === 'function' ? message(validator.data) : message)) ||
        getBadgeFailureMessage(badge, validator.internal.badgeFailureMessages, Validation.defaultBadgeFailureMessages) ||
        '';
      validator.internal.invalidate();
      validator.chain && ((validator.chain.effects.invalidates = true), (validator.chain.effects.errors[badge] = validator.internal.errors[badge]));
      validator.bypass = true;
    }

    this.asynchronize(() => action(badge, validity, message));

    return this as any;
  }

  when(...badges: Badge[]): ValidatorTail<Badge, $, Data> {
    if (this.internal.done || (this.unsafe === undefined && (this.unsafe = false), this.bypass)) return this as any;

    const validator = this;

    function action(...badges: Badge[]): void {
      if (badges.some(badge => !validator.internal.badges.includes(badge))) {
        validator.internal.invalidate();
        validator.chain && (validator.chain.effects.invalidates = true);
        validator.bypass = true;
      }
    }

    this.asynchronize(() => action(...badges));

    return this as any;
  }

  must(...conditions: (boolean | ((data: Data) => boolean))[]): ValidatorTail<Badge, $, Data> {
    if (this.internal.done || (this.unsafe === undefined && (this.unsafe = false), this.bypass)) return this as any;

    const validator = this;

    function action(...conditions: (boolean | ((data: Data) => boolean))[]): void {
      if (conditions.some(condition => (typeof condition === 'function' ? !condition(validator.data) : !condition))) {
        validator.internal.invalidate();
        validator.chain && (validator.chain.effects.invalidates = true);
        validator.bypass = true;
      }
    }

    this.asynchronize(() => action(...conditions));

    return this as any;
  }

  if(...conditions: (boolean | ((data: Data) => boolean))[]): ValidatorTail<Badge, $, Data> {
    if (this.internal.done || (this.unsafe === undefined && (this.unsafe = false), this.bypass)) return this as any;

    const validator = this;

    function action(...conditions: (boolean | ((data: Data) => boolean))[]): void {
      if (conditions.some(condition => (typeof condition === 'function' ? !condition(validator.data) : !condition))) {
        validator.bypass = true;
      }
    }

    this.asynchronize(() => action(...conditions));

    return this as any;
  }

  earn(badge: Badge): ValidatorTail<Badge, $, Data> {
    if (this.internal.done || this.bypass) return this as any;

    const validator = this;

    function action(badge: Badge): void {
      validator.internal.badges.includes(badge) || validator.internal.badges.push(badge);
      validator.chain && (validator.chain.effects.badges.includes(badge) || validator.chain.effects.badges.push(badge));
    }

    this.asynchronize(() => action(badge));

    return this as any;
  }

  fail(badge: Badge, message?: string | ((data: Data) => string)): ValidatorTail<Badge, $, Data> {
    if (this.internal.done || this.bypass) return this as any;

    const validator = this;

    function action(badge: Badge): void {
      validator.internal.errors[badge] =
        validator.internal.errors[badge] ||
        (message && (typeof message === 'function' ? message(validator.data) : message)) ||
        getBadgeFailureMessage(badge, validator.internal.badgeFailureMessages, Validation.defaultBadgeFailureMessages) ||
        '';
      validator.internal.invalidate();
      validator.chain && ((validator.chain.effects.invalidates = true), (validator.chain.effects.errors[badge] = validator.internal.errors[badge]));
    }

    this.asynchronize(() => action(badge));

    return this as any;
  }

  set($path: Data): ValidatorTail<Badge, $, Data> {
    if (this.internal.done || (this.unsafe === false && (this.unsafe = true), this.bypass)) return this as any;

    const validator = this,
      path = this.get$Path();

    function action(): void {
      set$(validator.internal.$, path, validator.data);
      validator.chain && validator.chain.effects.$.push({ path, value: validator.data });
    }

    this.asynchronize(action);

    return this as any;
  }

  put<T>($path: T, value: T | Promise<T> | ((data: Data) => T | Promise<T>)): ValidatorTail<Badge, $, T> {
    if (this.internal.done || (this.unsafe === false && (this.unsafe = true), this.bypass)) return this as any;

    const validator = this,
      path = this.get$Path();

    function action(value: T): void {
      validator.data = value as any;
      set$(validator.internal.$, path, value);
      validator.chain && validator.chain.effects.$.push({ path, value: value });
      if (value instanceof Validation && !value.ok) {
        validator.internal.invalidate();
        validator.chain && (validator.chain.effects.invalidates = true);
      }
    }

    this.asynchronize(() => {
      const result = typeof value === 'function' ? (value as any)(this.data) : value;
      return result instanceof Promise ? result.then(data => this.internal.done || action(data)) : action(result);
    });

    return this as any;
  }

  get<T>($path: T): ValidatorTail<Badge, $, T> {
    if (this.internal.done || (this.unsafe === false && (this.unsafe = true), this.bypass)) return this as any;

    const validator = this,
      path = this.get$Path();

    function action(): void {
      validator.data = get$(validator.internal.$, path);
    }

    this.asynchronize(action);

    return this as any;
  }

  use<T, D>($path: T, task: (value: T, data: Data) => D | Promise<D> | ValidatorTail<Badge, $, D>): ValidatorTail<Badge, $, D> {
    if (this.internal.done || (this.unsafe === false && (this.unsafe = true), this.bypass)) return this as any;

    const validator = this,
      path = this.get$Path();

    function action(value: D): void {
      validator.data = value as any;
    }

    this.asynchronize(() => {
      const result = task(get$(this.internal.$, path), this.data);
      const value = result instanceof ValidatorTail ? result.provide() : result;
      return value instanceof Promise ? value.then(data => this.internal.done || action(data)) : action(value);
    });

    return this as any;
  }

  get value(): Data | Promise<Data> {
    //TODO: Throw if not safe
    return this.promise ? this.promise.then(() => this.data) : this.data;
  }

  end(): Data | Promise<Data> {
    //TODO: Throw if not safe
    if (!this.original) throw new Error('Only the named chains can be finished.');
    if (this.internal.done) return (this.promise ? Promise.resolve(undefined) : undefined) as any;

    delete this.internal.currentChain;

    if (this.promise)
      return (this.internal.promises[this.index] = this.promise.then(() => {
        if (this.internal.done) return undefined as any;
        this.chain && ((this.chain.async = true), (this.chain.data = this.data), this.internal.closedChains.push(this.chain.name));
        return this.data;
      }));

    this.chain && ((this.chain.data = this.data), this.internal.closedChains.push(this.chain.name));
    return this.data;
  }

  private wrapInternalCurrentChain<T>(task: () => T): T {
    const currentChain = this.internal.currentChain;
    this.internal.currentChain = this.chain;
    const result = task();
    this.internal.currentChain = currentChain;
    return result;
  }

  private asynchronize(task: () => any) {
    if (this.promise)
      return (this.promise = this.internal.promises[this.index] = this.promise
        .then(() => {
          if (this.internal.done || this.bypass) return;
          return task();
        })
        .catch(this.internal.reject));
    const result = task();
    result instanceof Promise && (this.promise = this.internal.promises[this.index] = result.catch(this.internal.reject));
  }

  private provide(): Data | Promise<Data> {
    if (this.unsafe) throw new Error('Can not retrieve data from an unsafe validation chain.');
    if (this.promise) return this.promise.then(() => this.data);
    return this.data;
  }
  private provideFor(consumer: (data: Data) => void): void | Promise<void> {
    if (this.unsafe) throw new Error('Can not retrieve data from an unsafe validation chain.');
    if (this.promise) return this.promise.then(() => consumer(this.data));
    consumer(this.data);
  }

  private get$Path(): $Path {
    const $path = this.internal.$paths.shift();
    if (!$path) throw new Error("The path must be specified using 'validator.$'.");
    return $path;
  }
}
