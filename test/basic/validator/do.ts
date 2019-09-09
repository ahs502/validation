import Validation from '../../../src/Validation';

describe('Validator', () => {
  describe('do ring', () => {
    describe('basic functionality', () => {
      it("should use the chain's data destructured and pass the result to the rest of the chain without blocking it", () => {
        const source = <const>[5, 'something', true];
        let result: any = undefined;
        class DoValidation extends Validation<'A'> {
          constructor() {
            super(
              validator =>
                (result = validator
                  .with(source)
                  .do((x, y, z) => [z, y, x])
                  .earn('A').value)
            );
          }
        }

        const validation = new DoValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual(source.slice().reverse());
      });

      it('should work with promise output', async () => {
        const source = <const>[5, 'something', true];
        let result: any = undefined;
        class DoValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(source)
                .do((x, y, z) => Promise.resolve([z, y, x]))
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new DoValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual(source.slice().reverse());
      });

      it('should work with validation chain output', () => {
        const source = <const>[5, 'something', true];
        let result: any = undefined;
        class DoValidation extends Validation<'A'> {
          constructor() {
            super(
              validator =>
                (result = validator
                  .with(source)
                  .do((x, y, z) => validator.with([z, y, x]))
                  .earn('A').value)
            );
          }
        }

        const validation = new DoValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual(source.slice().reverse());
      });

      it('should work with asynchronous validation chain output', async () => {
        const source = <const>[5, 'something', true];
        let result: any = undefined;
        class DoValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(source)
                .do((x, y, z) => validator.with(Promise.resolve([z, y, x])))
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new DoValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual(source.slice().reverse());
      });

      it('should get bypassed correctly', () => {
        class DoValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              validator
                .with(<const>[5])
                .if(false)
                .do(x => validator.earn('A'))
            );
          }
        }

        const validation = new DoValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
      });
    });

    describe('asynchronous functionality', () => {
      it("should use the chain's data destructured and pass the result to the rest of the chain without blocking it", async () => {
        const source = <const>[5, 'something', true];
        let result: any = undefined;
        class DoValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(source))
                .do((x, y, z) => [z, y, x])
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new DoValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toEqual(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual(source.slice().reverse());
      });

      it('should work with promise output', async () => {
        const source = <const>[5, 'something', true];
        let result: any = undefined;
        class DoValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(source))
                .do((x, y, z) => Promise.resolve([z, y, x]))
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new DoValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual(source.slice().reverse());
      });

      it('should work with validation chain output', async () => {
        const source = <const>[5, 'something', true];
        let result: any = undefined;
        class DoValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(source))
                .do((x, y, z) => validator.with([z, y, x]))
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new DoValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual(source.slice().reverse());
      });

      it('should work with asynchronous validation chain output', async () => {
        const source = <const>[5, 'something', true];
        let result: any = undefined;
        class DoValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(source))
                .do((x, y, z) => validator.with(Promise.resolve([z, y, x])))
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new DoValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual(source.slice().reverse());
      });

      it('should get bypassed correctly', async () => {
        class DoValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              validator
                .with(Promise.resolve(<const>[5]))
                .if(false)
                .do(x => validator.earn('A'))
            );
          }
        }

        const validation = new DoValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
      });
    });
  });
});
