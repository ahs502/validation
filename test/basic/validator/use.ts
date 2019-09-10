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
  describe('use ring', () => {
    describe('basic functionality', () => {
      it('should provide the specified value from validation.$ along side the chain data to the task and propagate its value, without blocking the chain', () => {
        let result: any = undefined;
        class UseValidation extends Validation<'A', $Type> {
          constructor() {
            super(
              validator =>
                (result = validator
                  .put(validator.$.b[1].d.f[2], 10)
                  .with('data')
                  .use(validator.$.b[1].d.f[2], (value, data) => `${value}-${data}`)
                  .earn('A').value)
            );
          }
        }

        const validation = new UseValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toBe('10-data');
      });

      it('should be able to produce promises', async () => {
        let result: any = undefined;
        class UseValidation extends Validation<'A', $Type> {
          constructor() {
            super(validator =>
              (validator
                .put(validator.$.b[1].d.f[2], 10)
                .with('data')
                .use(validator.$.b[1].d.f[2], (value, data) => Promise.resolve(`${value}-${data}`))
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new UseValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toBe('10-data');
      });

      it('should be able to produce validation chains', () => {
        let result: any = undefined;
        class UseValidation extends Validation<'A', $Type> {
          constructor() {
            super(
              validator =>
                (result = validator
                  .put(validator.$.b[1].d.f[2], 10)
                  .with('data')
                  .use(validator.$.b[1].d.f[2], (value, data) => validator.with(`${value}-${data}`))
                  .earn('A').value)
            );
          }
        }

        const validation = new UseValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toBe('10-data');
      });

      it('should be able to produce asynchronous validation chains', async () => {
        let result: any = undefined;
        class UseValidation extends Validation<'A', $Type> {
          constructor() {
            super(validator =>
              (validator
                .put(validator.$.b[1].d.f[2], 10)
                .with('data')
                .use(validator.$.b[1].d.f[2], (value, data) => validator.with(Promise.resolve(`${value}-${data}`)))
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new UseValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toBe('10-data');
      });
    });

    describe('asynchronous functionality', () => {
      it('should provide the specified value from validation.$ along side the chain data to the task and propagate its value, without blocking the chain', async () => {
        let result: any = undefined;
        class UseValidation extends Validation<'A', $Type> {
          constructor() {
            super(validator =>
              (validator
                .put(validator.$.b[1].d.f[2], 10)
                .with(Promise.resolve('data'))
                .use(validator.$.b[1].d.f[2], (value, data) => `${value}-${data}`)
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new UseValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toBe('10-data');
      });

      it('should be able to produce promises', async () => {
        let result: any = undefined;
        class UseValidation extends Validation<'A', $Type> {
          constructor() {
            super(validator =>
              (validator
                .put(validator.$.b[1].d.f[2], 10)
                .with(Promise.resolve('data'))
                .use(validator.$.b[1].d.f[2], (value, data) => Promise.resolve(`${value}-${data}`))
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new UseValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toBe('10-data');
      });

      it('should be able to produce validation chains', async () => {
        let result: any = undefined;
        class UseValidation extends Validation<'A', $Type> {
          constructor() {
            super(validator =>
              (validator
                .put(validator.$.b[1].d.f[2], 10)
                .with(Promise.resolve('data'))
                .use(validator.$.b[1].d.f[2], (value, data) => validator.with(`${value}-${data}`))
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new UseValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toBe('10-data');
      });

      it('should be able to produce asynchronous validation chains', async () => {
        let result: any = undefined;
        class UseValidation extends Validation<'A', $Type> {
          constructor() {
            super(validator =>
              (validator
                .put(validator.$.b[1].d.f[2], 10)
                .with(Promise.resolve('data'))
                .use(validator.$.b[1].d.f[2], (value, data) => validator.with(Promise.resolve(`${value}-${data}`)))
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new UseValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toBe('10-data');
      });
    });

    it('should get bypassed correctly', () => {
      class UseValidation extends Validation<'A', $Type> {
        constructor() {
          super(validator => validator.if(false).use(validator.$.a, () => validator.earn('A')));
        }
      }

      const validation = new UseValidation();
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual([]);
    });
  });
});
