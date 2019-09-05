import Validation from './Validation';

class XValidation extends Validation<'', { a: { b: number; c: ['s'] } }> {
  constructor() {
    super(validator => {
      // const chain = validator.with((0 as any) as [number, boolean, string]).do((x, y, z) => true);
      // const chain = validator.with((0 as any) as boolean[]).each((b, i, bb) => validator.with(Promise.resolve(true)));
      // const chain = validator.with((0 as any) as boolean).after(true);
      // const chain = validator.with((0 as any) as number[]).use(validator.$.a.b, (x, y) => Promise.resolve(''));
      // const chain = validator.after(7, Promise.resolve(true)).after(([n, b]) => (5).toString(), false, 5, 55);
      const chain = validator
        .start('lsfdkfj', 5, 4, true)
        .with(5)
        .then(x => Promise.resolve(x))
        .end();
    });
  }
}

/////////////////////////////////////////////////////////

interface I {
  /** hi! */
  new (a: number);
}

// class C implements I {
//   constructor(a: number) {}
// }
