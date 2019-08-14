import Validation from './Validation';
import { getBadgeMessage, Chain, AsyncHandler, PendingHandler, $Base } from './utils';

export class ValidatorBase<Badge extends string, $ extends $Base> implements ValidatorSeed<Badge, $, undefined> {
  constructor(private readonly internal: Internal<Badge, $>) {}

  /**
   *
   * @param name
   * @param watches
   */
  start(name: string, ...watches: any[]): ValidatorTail<Badge, $, undefined> {
    if (this.internal.currentChain) throw `Already within the chain '${this.internal.currentChain.name}'.`;
    if (this.internal.openedChains.includes(name)) throw `The chain $'${name}' is already oppened.`;

    this.internal.openedChains.push(name);

    if (name in this.internal.chains) {
      const { watches: oldWatches, data, effects } = this.internal.chains[name];
      if (watches.length === oldWatches.length && watches.every((thing, index) => thing === oldWatches[index])) {
        effects.invalidates && this.internal.invalidate();
        effects.badges.forEach(badge => this.internal.badges.includes(badge) || this.internal.badges.push(badge));
        for (const badge in effects.errors) {
          this.internal.errors[badge] = effects.errors[badge];
        }
        effects.$.forEach(pair => set$(this.internal.validation.$, pair.path, pair.value));
        this.internal.closedChains.push(name);
        return new ValidatorMock(data) as any;
      }
    }

    return new ValidatorTail(
      this.internal,
      (this.internal.chains[name] = {
        name,
        watches,
        data: undefined,
        effects: {
          invalidates: false,
          badges: [],
          errors: {},
          $: []
        }
      })
    );

    function set$($: any, path: (string | number)[], value: any): void {
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

  with(target: any): any {
    if (this.internal.currentChain) return new ValidatorTail<Badge, $, undefined>(this.internal).with(target);
  }
  object(target: any): any {}
  array(target: any): any {}
  then(task: any): any {}
  do(task: any): any {}
  each(task: any): any {}
  after(...targets: any[]): any {}
  check(badge: any, validity: any, message: any): any {}
  earn(badge: any): any {}
  fail(badge: any, message: any): any {}
  when(...badges: any[]): any {}
  must(...conditions: any[]): any {}
  if(...conditions: any[]): any {}
  end(): any {}

  get $(): any {
    throw 'not implemented.';
  }
  set $($: any) {
    throw 'not implemented.';
  }
}

export class ValidatorMock implements Validator<'', {}, {}> {
  constructor(private readonly data: any) {}

  with(): any {
    return this;
  }
  object(): any {
    return this;
  }
  array(): any {
    return this;
  }
  then(): any {
    return this;
  }
  do(): any {
    return this;
  }
  each(): any {
    return this;
  }
  after(): any {
    return this;
  }
  check(): any {
    return this;
  }
  earn(): any {
    return this;
  }
  fail(): any {
    return this;
  }
  when(): any {
    return this;
  }
  must(): any {
    return this;
  }
  if(): any {
    return this;
  }
  end(): Promise<any> {
    return Promise.resolve(this.data);
  }

  get $(): any {
    throw 'not implemented.';
  }
  set $($: any) {
    throw 'not implemented.';
  }
}

export class ValidatorTail<Badge extends string, $ extends $Base, Data> implements Validator<Badge, $, Data> {
  private readonly chain?: Chain<Badge>;
  private readonly original: boolean;
  private data: Data;

  constructor(private readonly internal: Internal<Badge, $>, chain?: Chain<Badge>) {
    this.chain = internal.currentChain || chain;
    this.original = !internal.currentChain;
    this.data = undefined as any;
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export abstract class Validator0<Badge extends string, $ extends {}, Data = undefined> {
  private readonly original: boolean;
  private data: Data;
  private promiseReject?(): unknown;
  private promiseResolve?(data: Data): unknown;

  constructor(private readonly internal: Internal<Badge, $>) {
    const validator = this;
    this.blackhole = new Proxy(
      {},
      {
        get: (target, property, receiver) => {
          if (property === 'end')
            return () => {
              if (validator.promiseReject) {
                validator.promiseReject();
                return;
              }
              return Promise.reject();
            };
          return () => validator.blackhole;
        }
      }
    ) as this;
    this.chain = chain;
    this.data = undefined as any;
  }

  private set$(path: (string | number)[], value: any): void {
    let $ = this.internal.validation.$ as any;
    path.slice(0, -1).forEach((property, index) => {
      if (!$[property]) {
        const nextProperty = path[index + 1];
        $[property] = typeof nextProperty === 'number' ? [] : {};
      }
      $ = $[property];
    });
    $[path[path.length - 1]] = value;
  }

  private static end<Badge extends string, $ extends {}>(internal: Internal<Badge, $>, name: string, data: any): void {
    if (internal.asyncDone) return;
    if (internal.closedChains.includes(name)) throw `Chain ${name} is already closed.`;
    internal.closedChains.push(name);
    internal.chains[name].data = data;
    for (let i = 0; i < internal.pendingHandlers.length; i++) {
      const pendingHandler = internal.pendingHandlers[i];
      if (!pendingHandler.names.every(name => internal.closedChains.includes(name))) continue;
      pendingHandler.validator.data = pendingHandler.names.map(name => internal.chains[name].data);
      pendingHandler.tail.forEach(ring => (pendingHandler.validator = pendingHandler.validator[ring.method](...ring.args)));
      internal.pendingHandlers.splice(i--, 1);
    }
  }

  in(name: string, ...watches: any[]): Validator<Badge, $> {
    if (this.chain) throw `Chain '${this.chain.name}' is already openned.`;
    if (this.internal.openedChains.includes(name)) throw `Chain ${name} already exists.`;

    this.internal.openedChains.push(name);

    if (name in this.internal.chains) {
      const { watches: oldWatches, data, effects } = this.internal.chains[name];
      if (watches.length === oldWatches.length && watches.every((thing, index) => thing === oldWatches[index])) {
        effects.invalidates && this.internal.invalidate();
        effects.badges.forEach(badge => this.internal.badges.includes(badge) || this.internal.badges.push(badge));
        for (const badge in effects.errors) {
          this.internal.errors[badge] = effects.errors[badge];
        }
        effects.$.forEach(pair => this.set$(pair.path, pair.value));
        ValidatorTail.end(this.internal, name, this.data);
        const blackhole = new Proxy(
          {},
          {
            get: (target, property, receiver) => {
              if (property === 'in')
                return () => {
                  throw `Chain '${name}' is already openned.`;
                };
              if (property === 'end') return () => Promise.resolve(data);
              return () => blackhole;
            }
          }
        ) as Validator<Badge, $>;
        return blackhole;
      }
    }

    return new ValidatorTail(
      this.internal,
      (this.internal.chains[name] = {
        name,
        watches,
        data: undefined,
        effects: {
          invalidates: false,
          badges: [],
          errors: {},
          $: []
        }
      })
    );
  }

  with<T extends any>(target: T): Validator<Badge, $, T extends Validation ? undefined : T> {
    this.data = (target instanceof Validation ? undefined : target) as any;
    return this as any;
  }

  object<T extends any>(target: T): Validator<Badge, $, T extends Validation ? undefined : T> {
    if (target && typeof target === 'object' && !Array.isArray(target)) {
      this.data = (target instanceof Validation ? undefined : target) as any;
      return this as any;
    }
    this.internal.invalidate();
    this.chain && (this.chain.effects.invalidates = true);
    return this.blackhole as any;
  }

  array<T extends any>(target: T): Validator<Badge, $, T> {
    if (target && Array.isArray(target)) {
      this.data = target as any;
      return this as any;
    }
    this.internal.invalidate();
    this.chain && (this.chain.effects.invalidates = true);
    return this.blackhole as any;
  }

  check(badge: Badge, validity: boolean | ((data: Data) => boolean), message?: string | ((data: Data) => string)): this {
    if (typeof validity === 'function' ? validity(this.data) : validity) {
      this.internal.badges.includes(badge) || (this.internal.badges.push(badge), this.chain && this.chain.effects.badges.push(badge));
      return this;
    }
    this.internal.errors[badge] =
      this.internal.errors[badge] ||
      (message && (typeof message === 'function' ? message(this.data) : message)) ||
      getBadgeMessage(badge, this.internal.validation.badgeFailureMessages, Validation.defaultBadgeFailureMessages) ||
      '';
    this.internal.invalidate();
    this.chain && ((this.chain.effects.invalidates = true), (this.chain.effects.errors[badge] = this.internal.errors[badge]));
    return this.blackhole;
  }

  earn(badge: Badge): this {
    this.internal.badges.includes(badge) || (this.internal.badges.push(badge), this.chain && this.chain.effects.badges.push(badge));
    return this;
  }

  fail(badge: Badge, message?: string | ((data: Data) => string)): this {
    this.internal.errors[badge] =
      this.internal.errors[badge] ||
      (message && (typeof message === 'function' ? message(this.data) : message)) ||
      getBadgeMessage(badge, this.internal.validation.badgeFailureMessages, Validation.defaultBadgeFailureMessages) ||
      '';
    this.internal.invalidate();
    this.chain && ((this.chain.effects.invalidates = true), (this.chain.effects.errors[badge] = this.internal.errors[badge]));
    return this;
  }

  when(...badges: Badge[]): this {
    if (badges.length === 0) return this;
    if (this.internal.validation.has(...badges)) return this;
    this.internal.invalidate();
    this.chain && (this.chain.effects.invalidates = true);
    return this.blackhole;
  }

  must(...conditions: (boolean | ((data: Data) => boolean))[]): this {
    for (let i = 0; i < conditions.length; ++i) {
      const condition = conditions[i];
      if (typeof condition === 'function' ? !condition(this.data) : !condition) {
        this.internal.invalidate();
        this.chain && (this.chain.effects.invalidates = true);
        return this.blackhole;
      }
    }
    return this;
  }

  if(...conditions: (boolean | ((data: Data) => boolean))[]): this {
    for (let i = 0; i < conditions.length; ++i) {
      const condition = conditions[i];
      if (typeof condition === 'function' ? !condition(this.data) : !condition) return this.blackhole;
    }
    return this;
  }

  then<T>(task: (data: Data) => T): Validator<Badge, $, T extends void | undefined | Validation ? Data : T> {
    const data = task(this.data);
    this.data = (data instanceof Validation || data === undefined ? this.data : data) as any;
    return this as any;
  }

  /**
   *
   * @param task
   */
  do<T>(
    task: Data extends [(infer D0), (infer D1), (infer D2), (infer D3), (infer D4), (infer D5), (infer D6), (infer D7), (infer D8), (infer D9)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8, d9: D9) => T
      : Data extends [(infer D0), (infer D1), (infer D2), (infer D3), (infer D4), (infer D5), (infer D6), (infer D7), (infer D8)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8) => T
      : Data extends [(infer D0), (infer D1), (infer D2), (infer D3), (infer D4), (infer D5), (infer D6), (infer D7)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7) => T
      : Data extends [(infer D0), (infer D1), (infer D2), (infer D3), (infer D4), (infer D5), (infer D6)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6) => T
      : Data extends [(infer D0), (infer D1), (infer D2), (infer D3), (infer D4), (infer D5)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4, d5: D5) => T
      : Data extends [(infer D0), (infer D1), (infer D2), (infer D3), (infer D4)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3, d4: D4) => T
      : Data extends [(infer D0), (infer D1), (infer D2), (infer D3)]
      ? (d0: D0, d1: D1, d2: D2, d3: D3) => T
      : Data extends [(infer D0), (infer D1), (infer D2)]
      ? (d0: D0, d1: D1, d2: D2) => T
      : Data extends [(infer D0), (infer D1)]
      ? (d0: D0, d1: D1) => T
      : Data extends [(infer D0)]
      ? (d0: D0) => T
      : (...items: (Data extends readonly (infer I)[] ? I : any)[]) => T
  ): Validator<Badge, $, T extends void | undefined | Validation ? Data : T> {
    if (!Array.isArray(this.data)) throw 'The target is not an array.';
    const data = (task as any)(...(this.data as any[]));
    this.data = (data instanceof Validation || data === undefined ? this.data : data) as any;
    return this as any;
  }

  each(task: (item: Data extends readonly (infer I)[] ? I : any, index: number) => void): this {
    if (!Array.isArray(this.data)) throw 'The target is not an array.';
    (this.data as any[]).forEach(task);
    return this;
  }

  await<T>(promise: Promise<T> | ((data: Data) => Promise<T>)): Validator<Badge, $, T extends void | undefined | Validation ? Data : T> {
    const asyncHandler: AsyncHandler = {
      promise: (typeof promise === 'function' ? promise(this.data) : promise)
        .then(data => {
          if (this.internal.asyncDone) return;
          let validator = this as any;
          validator.data = data instanceof Validation || data === undefined ? validator.data : data;
          asyncHandler.tail.forEach(ring => (validator = validator[ring.method](...ring.args)));
          this.internal.asyncHandlers.splice(this.internal.asyncHandlers.indexOf(asyncHandler), 1);
          if (this.internal.asyncHandlers.length) return;
          this.internal.asyncDone = true;
          this.internal.asyncResolve();
        })
        .catch(reason => {
          this.internal.invalidate();
          // this.chain && (this.chain.effects.invalidates = true);
          if (this.internal.asyncDone) return;
          this.internal.asyncDone = true;
          this.internal.asyncReject(reason);
        }),
      tail: []
    };
    this.internal.asyncHandlers.push(asyncHandler);
    const validator = this;
    const chainRedirector = new Proxy(
      {},
      {
        get: (target, property, receiver) => {
          return (...args: any[]) => {
            asyncHandler.tail.push({
              method: String(property),
              args
            });
            if (property === 'end') return new Promise((resolve, reject) => ((validator.promiseResolve = resolve), (validator.promiseReject = reject)));
            return chainRedirector;
          };
        }
      }
    );
    return chainRedirector as any;
  }

  after<T extends any[] = any[]>(...names: string[]): Validator<Badge, $, T> {
    if (names.every(name => this.internal.closedChains.includes(name))) {
      this.data = names.map(name => this.internal.chains[name].data) as any;
      return this as any;
    }
    const pendingHandler: PendingHandler = {
      names,
      validator: this,
      tail: []
    };
    this.internal.pendingHandlers.push(pendingHandler);
    const validator = this;
    const chainRedirector = new Proxy(
      {},
      {
        get: (target, property, receiver) => {
          return (...args: any[]) => {
            pendingHandler.tail.push({
              method: String(property),
              args
            });
            if (property === 'end') return new Promise((resolve, reject) => ((validator.promiseResolve = resolve), (validator.promiseReject = reject)));
            return chainRedirector;
          };
        }
      }
    );
    return chainRedirector as any;
  }

  $(
    root: keyof $,
    ...path: (string | number)[]
  ): {
    set(validation: Validation<any> | ((data: Data) => Validation<any>)): Validator<Badge, $, Data>;
    put(value: any | ((data: Data) => any)): Validator<Badge, $, Data>;
  } {
    path.unshift(root as string | number);
    const validator = this;
    return {
      set(validation: Validation<any> | ((data: Data) => Validation<any>)): Validator<Badge, $, Data> {
        const validationInstance = typeof validation === 'function' ? validation(validator.data) : validation;
        validator.set$(path, validationInstance);
        validator.chain && validator.chain.effects.$.push({ path, value: validationInstance });
        if (validationInstance.ok) return validator;
        validator.internal.invalidate();
        validator.chain && (validator.chain.effects.invalidates = true);
        return validator.blackhole;
      },
      put(value: any | ((data: Data) => any)): Validator<Badge, $, Data> {
        const valueInstance = typeof value === 'function' ? value(validator.data) : value;
        validator.set$(path, valueInstance);
        validator.chain && validator.chain.effects.$.push({ path, value: valueInstance });
        return validator;
      }
    };
  }

  end(): Promise<Data> {
    this.chain && ValidatorTail.end(this.internal, this.chain.name, this.data);
    if (this.promiseResolve) {
      this.promiseResolve(this.data);
      return (undefined as unknown) as Promise<Data>;
    }
    return Promise.resolve(this.data);
  }
}

class Validator1<Badge extends string, $ extends {}> extends ValidatorBase<Badge, $> {
  constructor(internal: Internal<Badge, $>, private readonly chain: Chain<Badge>) {
    super(internal);
  }
}
