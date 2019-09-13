import Validation from '../../../src/Validation';

type $Type = {
  a: number;
  readonly b: readonly {
    c: string;
    d: {
      readonly e: boolean;
      readonly f: number[];
    };
  }[];
};

describe('Validator', () => {
  describe('put ring', () => {
    describe('it should put a certain value into validation.$ without blocking the chain', () => {
      test('direct value', () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A', $Type> {
          constructor() {
            super(validator => (result = validator.put(validator.$.b[1].d.f[2], 10).earn('A').value));
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toBe(10);
        expect(validation.$).toEqual({ b: [undefined, { d: { f: [undefined, undefined, 10] } }] });
      });

      test('feeded value provider', () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A', $Type> {
          constructor() {
            super(
              validator =>
                (result = validator
                  .with(5)
                  .put(validator.$.b[1].d.f[2], x => x * 2)
                  .earn('A').value)
            );
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toBe(10);
        expect(validation.$).toEqual({ b: [undefined, { d: { f: [undefined, undefined, 10] } }] });
      });

      test('promised value', async () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A', $Type> {
          constructor() {
            super(validator => (validator.put(validator.$.b[1].d.f[2], Promise.resolve(10)).earn('A').value as Promise<any>).then(feed => (result = feed)));
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        expect(validation.$).toEqual({});
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toBe(10);
        expect(validation.$).toEqual({ b: [undefined, { d: { f: [undefined, undefined, 10] } }] });
      });

      test('feeded promised value provider', async () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A', $Type> {
          constructor() {
            super(validator =>
              (validator
                .with(5)
                .put(validator.$.b[1].d.f[2], x => Promise.resolve(x * 2))
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        expect(validation.$).toEqual({});
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toBe(10);
        expect(validation.$).toEqual({ b: [undefined, { d: { f: [undefined, undefined, 10] } }] });
      });
    });

    describe('it should work async correctly', () => {
      test('direct value', async () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A', $Type> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve())
                .put(validator.$.b[1].d.f[2], 10)
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        expect(validation.$).toEqual({});
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toBe(10);
        expect(validation.$).toEqual({ b: [undefined, { d: { f: [undefined, undefined, 10] } }] });
      });

      test('feeded value provider', async () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A', $Type> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(5))
                .put(validator.$.b[1].d.f[2], x => x * 2)
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        expect(validation.$).toEqual({});
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toBe(10);
        expect(validation.$).toEqual({ b: [undefined, { d: { f: [undefined, undefined, 10] } }] });
      });

      test('promised value', async () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A', $Type> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve())
                .put(validator.$.b[1].d.f[2], Promise.resolve(10))
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        expect(validation.$).toEqual({});
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toBe(10);
        expect(validation.$).toEqual({ b: [undefined, { d: { f: [undefined, undefined, 10] } }] });
      });

      test('feeded promised value provider', async () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A', $Type> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(5))
                .put(validator.$.b[1].d.f[2], x => Promise.resolve(x * 2))
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        expect(validation.$).toEqual({});
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toBe(10);
        expect(validation.$).toEqual({ b: [undefined, { d: { f: [undefined, undefined, 10] } }] });
      });
    });

    describe('it should get bypassed correctly', () => {
      test('sync', () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A', $Type> {
          constructor() {
            super(
              validator =>
                (result = validator
                  .if(false)
                  .put(validator.$.b[1].d.f[2], 10)
                  .earn('A').value)
            );
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        expect(validation.$).toEqual({});
      });

      test('async', async () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A', $Type> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve())
                .if(false)
                .put(validator.$.b[1].d.f[2], Promise.resolve(10))
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        expect(validation.$).toEqual({});
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        expect(validation.$).toEqual({});
      });
    });

    describe('it should invalidate iff the passing value is a failed validation', () => {
      class SubValidation extends Validation {
        constructor() {
          super(validator => validator.must(false));
        }
      }

      type $Sub = { sub: SubValidation };

      test('sync direct value', () => {
        class TestValidation extends Validation<string, $Sub> {
          constructor() {
            super(validator => validator.put(validator.$.sub, new SubValidation()));
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(false);
        expect(validation.$.sub).toBeInstanceOf(SubValidation);
      });

      test('sync feeded value provider', () => {
        class TestValidation extends Validation<string, $Sub> {
          constructor() {
            super(validator => validator.put(validator.$.sub, () => new SubValidation()));
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(false);
        expect(validation.$.sub).toBeInstanceOf(SubValidation);
      });

      test('sync promised value', async () => {
        class TestValidation extends Validation<string, $Sub> {
          constructor() {
            super(validator => validator.put(validator.$.sub, Promise.resolve(new SubValidation())));
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.$.sub).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(false);
        expect(validation.$.sub).toBeInstanceOf(SubValidation);
      });

      test('sync feeded promised value provider', async () => {
        class TestValidation extends Validation<string, $Sub> {
          constructor() {
            super(validator => validator.put(validator.$.sub, () => Promise.resolve(new SubValidation())));
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.$.sub).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(false);
        expect(validation.$.sub).toBeInstanceOf(SubValidation);
      });

      test('async direct value', async () => {
        class TestValidation extends Validation<string, $Sub> {
          constructor() {
            super(validator => validator.with(Promise.resolve()).put(validator.$.sub, new SubValidation()));
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.$.sub).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(false);
        expect(validation.$.sub).toBeInstanceOf(SubValidation);
      });

      test('async feeded value provider', async () => {
        class TestValidation extends Validation<string, $Sub> {
          constructor() {
            super(validator => validator.with(Promise.resolve()).put(validator.$.sub, () => new SubValidation()));
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.$.sub).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(false);
        expect(validation.$.sub).toBeInstanceOf(SubValidation);
      });

      test('async promised value', async () => {
        class TestValidation extends Validation<string, $Sub> {
          constructor() {
            super(validator => validator.with(Promise.resolve()).put(validator.$.sub, Promise.resolve(new SubValidation())));
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.$.sub).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(false);
        expect(validation.$.sub).toBeInstanceOf(SubValidation);
      });

      test('async feeded promised value provider', async () => {
        class TestValidation extends Validation<string, $Sub> {
          constructor() {
            super(validator => validator.with(Promise.resolve()).put(validator.$.sub, () => Promise.resolve(new SubValidation())));
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.$.sub).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(false);
        expect(validation.$.sub).toBeInstanceOf(SubValidation);
      });
    });
  });
});
