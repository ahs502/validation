import { $Base, set$ } from './utils/$';
import Internal from './utils/Internal';
import ValidatorSeed from './interfaces/ValidatorSeed';
import ValidatorTail from './ValidatorTail';
import ValidatorMock from './ValidatorMock';

const numberRegExp = /^\d+$/;

export default class ValidatorBase<Badge extends string, $ extends $Base> /*implements ValidatorSeed<Badge, $>*/ {
  constructor(private readonly internal: Internal<Badge, $>) {}

  get $(): $ {
    const $paths = this.internal.$paths;
    $paths.unshift([]);
    const proxy = new Proxy(
      {},
      {
        get(target, property, receiver) {
          const propertyString = property as string;
          $paths[0].push(numberRegExp.test(propertyString) ? Number(propertyString) : propertyString);
          return proxy;
        },
        set(target, property, value, receiver) {
          return false;
        }
      }
    );
    return proxy;
  }

  start(name: string, ...watches: any[]): ValidatorTail<Badge, $, undefined> {
    if (this.internal.currentChain) throw `Already within the chain '${this.internal.currentChain.name}'.`;
    if (this.internal.openedChains.includes(name)) throw `The chain $'${name}' is already started.`;

    this.internal.openedChains.push(name);

    if (name in this.internal.chains) {
      const { watches: oldWatches, async, data, effects } = this.internal.chains[name];
      if (watches.length === oldWatches.length && watches.every((thing, index) => thing === oldWatches[index])) {
        effects.invalidates && this.internal.invalidate();
        effects.badges.forEach(badge => this.internal.badges.includes(badge) || this.internal.badges.push(badge));
        for (const badge in effects.errors) {
          this.internal.errors[badge] = effects.errors[badge];
        }
        effects.$.forEach(pair => set$(this.internal.$, pair.path, pair.value));
        this.internal.closedChains.push(name);
        return new ValidatorMock(data, async) as any;
      }
    }

    this.internal.currentChain = this.internal.chains[name] = {
      name,
      watches,
      data: undefined,
      async: false,
      effects: {
        invalidates: false,
        badges: [],
        errors: {},
        $: []
      }
    };
    return new ValidatorTail(this.internal, true);
  }

  with(target: any): any {
    return new ValidatorTail<Badge, $, undefined>(this.internal).with(target);
  }
  object(target: any): any {
    return new ValidatorTail<Badge, $, undefined>(this.internal).object(target);
  }
  array(target: any): any {
    return new ValidatorTail<Badge, $, undefined>(this.internal).array(target);
  }
  then(task: any): any {
    return new ValidatorTail<Badge, $, undefined>(this.internal).then(task);
  }
  do(task: any): any {
    return new ValidatorTail<Badge, $, undefined>(this.internal).do(task);
  }
  each(task: any): any {
    return (new ValidatorTail<Badge, $, undefined>(this.internal) as any).each(task);
  }
  after(...targets: any[]): any {
    return new ValidatorTail<Badge, $, undefined>(this.internal).after(...targets);
  }
  check(badge: any, validity: any, message: any): any {
    return new ValidatorTail<Badge, $, undefined>(this.internal).check(badge, validity, message);
  }
  earn(badge: any): any {
    return new ValidatorTail<Badge, $, undefined>(this.internal).earn(badge);
  }
  fail(badge: any, message: any): any {
    return new ValidatorTail<Badge, $, undefined>(this.internal).fail(badge, message);
  }
  when(...badges: any[]): any {
    return new ValidatorTail<Badge, $, undefined>(this.internal).when(...badges);
  }
  must(...conditions: any[]): any {
    return new ValidatorTail<Badge, $, undefined>(this.internal).must(...conditions);
  }
  if(...conditions: any[]): any {
    return new ValidatorTail<Badge, $, undefined>(this.internal).if(...conditions);
  }

  set($path: any): any {
    return new ValidatorTail<Badge, $, undefined>(this.internal).set($path);
  }
  put($path: any, value: any): any {
    return new ValidatorTail<Badge, $, undefined>(this.internal).put($path, value);
  }
  get($path: any, task: any): any {
    return new ValidatorTail<Badge, $, undefined>(this.internal).get($path, task);
  }
  use($path: any, task: any): any {
    return new ValidatorTail<Badge, $, undefined>(this.internal).use($path, task);
  }
}
